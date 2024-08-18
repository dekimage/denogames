import { makeAutoObservable, runInAction } from "mobx";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signInAnonymously,
  getAuth,
  EmailAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  onSnapshot,
  updateDoc,
  getDocs,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import Logger from "@/utils/logger";

const DEFAULT_USER = {};

const logger = new Logger({ debugEnabled: false }); // switch to true to see console logs from firebase

class Store {
  // App Data

  todos = [];
  products = [];
  user = null;
  cart = [];
  orders = [];

  productDetails = [];
  reviews = [];

  // Static Data

  lists = [];
  // App States
  isMobileOpen = false;
  loading = true;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
    this.fetchProducts = this.fetchProducts.bind(this);
    this.setIsMobileOpen = this.setIsMobileOpen.bind(this);
    this.loginWithEmail = this.loginWithEmail.bind(this);
    this.signupWithEmail = this.signupWithEmail.bind(this);

    this.fetchCart = this.fetchCart.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.continueToCheckout = this.continueToCheckout.bind(this);

    this.claimXP = this.claimXP.bind(this);
    this.verifyDiscordCode = this.verifyDiscordCode.bind(this);
    this.verifyKickstarterCode = this.verifyKickstarterCode.bind(this);
    this.addXP = this.addXP.bind(this);
    this.checkForRewards = this.checkForRewards.bind(this);
    this.syncUserProfile = this.syncUserProfile.bind(this);
    this.fetchUserOrders = this.fetchUserOrders.bind(this);

    this.fetchProductDetails = this.fetchProductDetails.bind(this);
    this.fetchReviews = this.fetchReviews.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
    this.updateProductRating = this.updateProductRating.bind(this);
  }

  initializeAuth() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        runInAction(() => {
          this.user = { uid: user.uid, ...userDoc.data() };
        });
        await this.fetchProducts();
        await this.fetchCart();
      } else {
        runInAction(() => {
          this.user = null;
          this.fetchCart();
        });
      }
    });
  }
  // HELPER UTILS
  async addProductsToFirestore(products, collectionName) {
    try {
      const collectionRef = collection(db, collectionName);

      const promises = products.map(async (product) => {
        // Add product to Firestore with an auto-generated ID
        const docRef = await addDoc(collectionRef, product);
        console.log("Document written with ID: ", docRef.id);
      });

      await Promise.all(promises);

      console.log("Products added successfully:", products);
    } catch (error) {
      console.log("Error adding products:", error);
    }
  }

  // REVIEWS
  // Fetch the last 10 reviews for a specific product
  async fetchReviews(productId) {
    try {
      const reviewsCollectionRef = collection(db, "reviews");
      const q = query(
        reviewsCollectionRef,
        where("productId", "==", productId),
        // orderBy("createdAt", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);

      runInAction(() => {
        this.reviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  }

  // Create or update a review
  async submitReview(productId, rating, comment) {
    try {
      // Ensure the user has purchased the product
      const ordersCollectionRef = collection(db, "orders");
      const ordersQuery = query(
        ordersCollectionRef,
        where("userId", "==", this.user.uid), // Filter by the current user's ID
        where("items", "array-contains", { id: productId })
      );

      const ordersSnapshot = await getDocs(ordersQuery);

      // Check if any document in the query results has the product in the items array
      const hasPurchased = !ordersSnapshot.empty;
      if (!hasPurchased) {
        console.log("You can only review products you've purchased.");
      }

      // Check if the user has already left a review for this product
      const reviewsCollectionRef = collection(db, "reviews");
      const q = query(
        reviewsCollectionRef,
        where("productId", "==", productId),
        where("userId", "==", this.user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Create a new review
        await addDoc(reviewsCollectionRef, {
          productId,
          userId: this.user.uid,
          rating,
          comment,
          createdAt: new Date(),
        });
      } else {
        // Update the existing review
        const reviewDocRef = querySnapshot.docs[0].ref;
        await updateDoc(reviewDocRef, {
          rating,
          comment,
          createdAt: new Date(),
        });
      }

      runInAction(() => {
        this.reviews = [
          ...this.reviews,
          {
            productId,
            userId: this.user.uid,
            rating,
            comment,
            createdAt: new Date(),
          },
        ];
      });

      // Update product's average rating
      await this.updateProductRating(productId);
    } catch (error) {
      console.log("Error submitting review:", error);
    }
  }

  // Delete a review
  async deleteReview(reviewId, productId) {
    try {
      const reviewDocRef = doc(db, "reviews", reviewId);
      await deleteDoc(reviewDocRef);

      // Update product's average rating
      runInAction(() => {
        this.reviews = this.reviews.filter((review) => review.id !== reviewId);
      });
      await this.updateProductRating(productId);
    } catch (error) {
      console.log("Error deleting review:", error);
    }
  }

  // Update the product's average rating
  async updateProductRating(productId) {
    try {
      const reviewsCollectionRef = collection(db, "reviews");
      const q = query(
        reviewsCollectionRef,
        where("productId", "==", productId)
      );
      const querySnapshot = await getDocs(q);

      const totalReviews = querySnapshot.docs.length;
      const totalRating = querySnapshot.docs.reduce(
        (sum, doc) => sum + doc.data().rating,
        0
      );

      const averageRating = totalReviews ? totalRating / totalReviews : 0;

      // Update the product's document with the new average rating
      const productDocRef = doc(db, "products", productId);
      await updateDoc(productDocRef, { averageRating });

      // Update product details in MobX store
      runInAction(() => {
        const product = this.productDetails.find(
          (product) => product.id === productId
        );
        if (product) {
          product.averageRating = averageRating;
        }
      });
    } catch (error) {
      console.error("Error updating product rating:", error);
    }
  }

  // product details + game details

  // Fetch detailed game data
  async fetchProductDetails(slug) {
    const existingDetails = this.productDetails.find(
      (product) => product.slug === slug
    );
    if (existingDetails) {
      return existingDetails;
    }

    try {
      // Fetch product data based on the slug
      const productQuery = query(
        collection(db, "products"),
        where("slug", "==", slug)
      );
      const productSnapshot = await getDocs(productQuery);

      if (!productSnapshot.empty) {
        const productDoc = productSnapshot.docs[0];
        const productData = productDoc.data();
        const productId = productDoc.id; // Get the document ID

        // Fetch game data using gameId from productData
        const gameDocRef = doc(db, "games", productData.gameId);
        const gameDoc = await getDoc(gameDocRef);
        const gameData = gameDoc.data();

        const productDetails = {
          id: productId, // Include the product ID here
          ...productData,
          ...gameData,
          slug: slug,
        };

        runInAction(() => {
          this.productDetails.push(productDetails);
        });

        return productDetails;
      } else {
        console.log("No product found with the given slug.");
      }
    } catch (error) {
      console.log("Error fetching product details:", error);
    }
  }

  async fetchCart() {
    if (this.user) {
      this.fetchCartFromFirestore();
    } else {
      this.fetchCartFromLocalStorage();
    }
  }

  async fetchCartFromFirestore() {
    try {
      const cartDocRef = doc(db, "carts", this.user.uid);
      const cartDoc = await getDoc(cartDocRef);
      runInAction(() => {
        this.cart = cartDoc.exists() ? cartDoc.data().items : [];
      });
    } catch (error) {
      console.log("Error fetching cart from Firestore:", error);
    }
  }

  fetchCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    runInAction(() => {
      this.cart = cart;
    });
  }

  // Add to Cart
  addToCart(product) {
    if (this.cart.includes(product.id)) return;
    if (this.user?.purchasedProducts?.includes(product.id)) return;

    runInAction(() => {
      this.cart.push(product.id);
    });

    if (this.user) {
      this.syncCartWithFirestore();
    } else {
      this.syncCartWithLocalStorage();
    }
  }

  // Remove from Cart
  removeFromCart(productId) {
    runInAction(() => {
      this.cart = this.cart.filter((id) => id !== productId);
    });

    if (this.user) {
      this.syncCartWithFirestore();
    } else {
      this.syncCartWithLocalStorage();
    }
  }

  // Sync Cart with Firestore
  async syncCartWithFirestore() {
    try {
      const cartDocRef = doc(db, "carts", this.user.uid);
      await setDoc(cartDocRef, { items: this.cart });
    } catch (error) {
      console.log("Error syncing cart with Firestore:", error);
    }
  }

  syncCartWithLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
  // Continue to Checkout
  continueToCheckout() {
    if (!this.cart.length) return;

    // Redirect to checkout page or prepare data for checkout
    console.log("Proceeding to checkout with cart items:", this.cart);
  }

  // Global Loading State
  setLoading(isLoading) {
    runInAction(() => {
      this.loading = isLoading;
    });
  }

  // Rewards user profile
  async fetchUserOrders() {
    if (!this.user.uid) return;

    try {
      // Fetch purchase history
      const ordersCollectionRef = collection(
        db,
        `users/${this.user.uid}/orders`
      );
      const querySnapshot = await getDocs(ordersCollectionRef);

      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      runInAction(() => {
        this.orders = orders;
      });
    } catch (error) {
      console.log("Error fetching user orders:", error);
    }
  }

  claimXP(action, code) {
    if (action === "discord" && this.verifyDiscordCode(code)) {
      this.addXP(10);
      runInAction(() => {
        this.user.discordJoined = true;
      });
    } else if (action === "kickstarter" && this.verifyKickstarterCode(code)) {
      this.addXP(15);
      runInAction(() => {
        this.user.kickstarterBacked = true;
      });
    } else if (action === "newsletter") {
      this.addXP(5);
      runInAction(() => {
        this.user.newsletterSignedUp = true;
      });
    }
    this.checkForRewards();
  }

  verifyDiscordCode(code) {
    // Example verification logic for Discord code
    return code === "WELCOME123"; // Replace with actual logic
  }

  verifyKickstarterCode(code) {
    // Example verification logic for Kickstarter code
    return code === "BACKER123"; // Replace with actual logic
  }

  // Function to add XP and check for rewards
  addXP(points) {
    runInAction(() => {
      this.user.xp += points;
    });
    this.checkForRewards();
  }

  // Function to check if new rewards are unlocked
  checkForRewards() {
    const rewardsTrack = [
      { xp: 10, reward: "Special Card" },
      { xp: 20, reward: "Mini Expansion" },
      { xp: 30, reward: "Extended Content" },
      // Add more rewards...
    ];

    rewardsTrack.forEach((milestone) => {
      if (
        this.user.xp >= milestone.xp &&
        !this.user.rewards.includes(milestone.reward)
      ) {
        runInAction(() => {
          this.user.rewards.push(milestone.reward);
        });
      }
    });

    this.syncUserProfile();
  }

  async syncUserProfile() {
    try {
      if (this.user.uid) {
        const userDocRef = doc(db, "users", this.user.uid);
        await setDoc(userDocRef, {
          xp: this.user.xp,
          rewards: this.user.rewards,
          discordJoined: this.user.discordJoined,
          kickstarterBacked: this.user.kickstarterBacked,
          newsletterSignedUp: this.user.newsletterSignedUp,
          // Add any other relevant user data here
        });
        console.log("User profile synced successfully!");
      } else {
        console.log("User is not logged in. Cannot sync profile.");
      }
    } catch (error) {
      console.log("Error syncing user profile:", error);
    }
  }

  async fetchProducts() {
    this.loading = true;
    try {
      const productsCollectionRef = collection(db, "products");
      const querySnapshot = await getDocs(productsCollectionRef);

      runInAction(() => {
        this.products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.loading = false;
      });
    } catch (error) {
      console.log("Error fetching products:", error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  get availableProducts() {
    if (!this.user) {
      return this.products;
    }
    const purchasedGameIds = this.user.purchasedProducts || [];
    return this.products.filter((game) => !purchasedGameIds.includes(game.id));
  }

  // GLOBAL MOBX STATE
  setIsMobileOpen(isMobileOpen) {
    runInAction(() => {
      this.isMobileOpen = isMobileOpen;
    });
  }

  // AUTH FUNCTIONS

  async loginWithEmail({ email, password }) {
    try {
      this.loading = true;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      runInAction(() => {
        this.user = userCredential.user;
        this.loading = false;
      });
    } catch (error) {
      console.log("Error logging in:", error);
      runInAction(() => {
        this.loading = false;
      });
      throw error;
    }
  }

  async signupWithEmail(email, password, username) {
    try {
      this.loading = true;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Additional user properties
      const newUserProfile = {
        ...DEFAULT_USER,
        createdAt: new Date(),
        username: username,
        email: email,
        uid: userCredential.user.uid,
      };

      // Create a user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), newUserProfile);

      runInAction(() => {
        this.user = newUserProfile;
        this.loading = false;
      });
    } catch (error) {
      console.log("Error signing up:", error);
      runInAction(() => {
        this.loading = false;
      });
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(auth); // Sign out from Firebase Authentication
      runInAction(() => {
        this.user = null; // Reset the user in the store
      });
    } catch (error) {
      console.log("Error during logout:", error);
      // Handle any errors that occur during logout
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUserProfile = {
          ...DEFAULT_USER,
          createdAt: new Date(),
          username: user.displayName || "New User",
          email: user.email,
          uid: user.uid,
        };

        await setDoc(userDocRef, newUserProfile);

        runInAction(() => {
          this.user = newUserProfile;
        });
      } else {
        runInAction(() => {
          this.user = { uid: user.uid, ...userDoc.data() };
        });
      }
    } catch (error) {
      console.log("Error with Google sign-in:", error);
    }
  }

  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      // Handle success, such as showing a message to the user
    } catch (error) {
      console.log("Error sending password reset email:", error);
      // Handle errors, such as invalid email, etc.
    }
  }
}

const MobxStore = new Store();
export default MobxStore;
