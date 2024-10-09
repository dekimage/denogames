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
  serverTimestamp,
  startAfter,
} from "firebase/firestore";

import Logger from "@/utils/logger";

const DEFAULT_USER = {};

const logger = new Logger({ debugEnabled: false }); // switch to true to see console logs from firebase

class Store {
  // App Data
  app = { games: [] };
  summariesFetched = false; // Flag to track if summaries are fetched
  fetchedGameDetails = {};
  fetching = false;

  // App Store

  products = [];
  user = null;
  cart = [];
  orders = [];
  notifications = [];

  productDetails = [];
  // reviews = [];
  // lastReviewFetched = null;
  // hasMoreReviews = true;

  reviewsByProduct = {};

  // Last review fetched for each product (for pagination)
  lastReviewFetchedByProduct = {};

  // Whether more reviews are available for each product
  hasMoreReviewsByProduct = {};
  // Static Data

  lists = [];
  // App States
  isMobileOpen = false;
  loading = false; // Initialize to false
  loadingUser = false;
  loadingProducts = false;
  loadingCart = false;
  loadingNotifications = false;

  // New properties for filters
  filters = {
    types: [],
    difficulty: [],
    minPlayers: 1,
    maxPlayers: 6,
  };

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
    this.clearCart = this.clearCart.bind(this);
    this.continueToCheckout = this.continueToCheckout.bind(this);

    this.claimXP = this.claimXP.bind(this);
    this.verifyDiscordCode = this.verifyDiscordCode.bind(this);
    this.verifyKickstarterCode = this.verifyKickstarterCode.bind(this);
    this.addXP = this.addXP.bind(this);
    this.checkForRewards = this.checkForRewards.bind(this);
    this.syncUserProfile = this.syncUserProfile.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);

    this.fetchProductDetails = this.fetchProductDetails.bind(this);
    this.fetchReviews = this.fetchReviews.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.updateProductRating = this.updateProductRating.bind(this);

    this.fetchNotifications = this.fetchNotifications.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);

    this.fetchGamesSummaryFromFirestore =
      this.fetchGamesSummaryFromFirestore.bind(this);
    this.fetchGameDetailsFromFirestore =
      this.fetchGameDetailsFromFirestore.bind(this);

    // New methods for filters
    this.setFilter = this.setFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  initializeAuth() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (this.loadingUser) return;
      runInAction(() => {
        this.loadingUser = true;
        this.loading = true; // Set global loading state
      });

      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          runInAction(() => {
            this.user = { uid: user.uid, ...userDoc.data() };
          });
          await this.fetchProducts();
          await this.fetchCart();
          await this.fetchNotifications();
        } else {
          runInAction(() => {
            this.user = null;
          });
          await this.fetchCart();
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        runInAction(() => {
          this.loadingUser = false;
          this.loading = false; // Reset global loading state
        });
      }
    });
  }

  // APP LOGIC SHARED FOR REACT NATIVE LATER !!!
  async addGamesToFirestore(games) {
    try {
      const collectionRef = collection(db, "appgames");

      // Iterate over each game
      for (const game of games) {
        // Add game to 'appgames' collection
        const gameDocRef = await addDoc(collectionRef, {
          name: game.name,
          description: game.description,
          isActive: game.isActive,
          createdAt: game.createdAt,
        });

        console.log("Game added with ID:", gameDocRef.id);

        // Add cards to 'cards' subcollection within this game
        if (game.cards && game.cards.length > 0) {
          const cardsCollectionRef = collection(
            db,
            `appgames/${gameDocRef.id}/cards`
          );

          for (const card of game.cards) {
            await addDoc(cardsCollectionRef, card);
            console.log("Card added to game with ID:", gameDocRef.id);
          }
        }

        // Add expansions to 'expansions' subcollection within this game
        if (game.expansions && game.expansions.length > 0) {
          const expansionsCollectionRef = collection(
            db,
            `appgames/${gameDocRef.id}/expansions`
          );

          for (const expansion of game.expansions) {
            await addDoc(expansionsCollectionRef, expansion);
            console.log("Expansion added to game with ID:", gameDocRef.id);
          }
        }
      }

      console.log("All games, cards, and expansions added successfully.");
    } catch (error) {
      console.error("Error adding games to Firestore:", error);
    }
  }

  async updateGamesWithConfig(games) {
    try {
      // Step 1: Fetch all existing game documents to get their IDs
      const gamesCollectionRef = collection(db, "appgames");
      const gamesSnapshot = await getDocs(gamesCollectionRef);

      // Step 2: Create a map of slug to document ID
      const gameIdMap = {};
      gamesSnapshot.forEach((doc) => {
        const gameData = doc.data();
        if (gameData.slug) {
          gameIdMap[gameData.slug] = doc.id;
        }
      });

      // Step 3: Iterate over the provided games and update each one using its mapped document ID
      for (const game of games) {
        const gameId = gameIdMap[game.slug];
        if (gameId) {
          const gameDocRef = doc(db, "appgames", gameId);

          // Step 4: Update the game document with the new config
          await updateDoc(gameDocRef, {
            types: game.types,
            methodsConfig: game.methodsConfig,
          });

          console.log(`Game "${game.name}" updated with new config.`);
        } else {
          console.log(`No matching game found for slug: ${game.slug}`);
        }
      }
    } catch (error) {
      console.error("Error updating games with config:", error);
    }
  }

  async fetchGamesSummaryFromFirestore() {
    if (this.fetching || this.summariesFetched) return; // Avoid refetching
    this.fetching = true;
    try {
      // Fetch only the main details of the games
      const collectionRef = collection(db, "appgames");
      const querySnapshot = await getDocs(collectionRef);
      const games = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        cards: null, // Will be fetched later
        expansions: null, // Will be fetched later
      }));

      // Update the MobX store with the fetched game summaries
      runInAction(() => {
        this.app.games = games;
        this.summariesFetched = true; // Set the flag to indicate summaries have been fetched
        this.fetching = false;
      });

      console.log("Game summaries fetched successfully:", games);
    } catch (error) {
      console.log("Error fetching game summaries from Firestore:", error);
      this.fetching = false;
    }
  }

  async fetchGameDetailsFromFirestore(gameId) {
    // Check if the game's details are already loaded
    if (this.fetching) return;
    if (this.fetchedGameDetails[gameId]) return; // Avoid refetching
    this.fetching = true;
    const game = this.app.games.find((g) => g.id === gameId);
    if (!game || (game.cards !== null && game.expansions !== null)) return; // Already fetched, no need to fetch again

    try {
      // Fetch the 'cards' subcollection for this game
      const cardsCollectionRef = collection(db, `appgames/${gameId}/cards`);
      const cardsSnapshot = await getDocs(cardsCollectionRef);
      const cards = cardsSnapshot.docs.map((cardDoc) => ({
        id: cardDoc.id,
        ...cardDoc.data(),
      }));

      // Fetch the 'expansions' subcollection for this game
      const expansionsCollectionRef = collection(
        db,
        `appgames/${gameId}/expansions`
      );
      const expansionsSnapshot = await getDocs(expansionsCollectionRef);
      const expansions = expansionsSnapshot.docs.map((expansionDoc) => ({
        id: expansionDoc.id,
        ...expansionDoc.data(),
      }));

      // Update the specific game in the MobX store with cards and expansions
      runInAction(() => {
        const gameToUpdate = this.app.games.find((g) => g.id === gameId);
        if (gameToUpdate) {
          gameToUpdate.cards = cards;
          gameToUpdate.expansions = expansions;
        }
        this.fetchedGameDetails[gameId] = true;
      });

      console.log(`Details for game ${gameId} fetched successfully.`);
      this.fetching = false;
    } catch (error) {
      console.log(
        `Error fetching details for game ${gameId} from Firestore:`,
        error
      );
    }
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

  // NOTIFICAITONS

  // Function to add a notification to a user's subcollection
  async addNotification(notification) {
    const userId = this.user.uid;
    try {
      const notificationRef = collection(db, `users/${userId}/notifications`);
      await addDoc(notificationRef, {
        ...notification,
        isRead: false,
        createdAt: serverTimestamp(),
      });

      runInAction(() => {
        this.notifications.push({
          id: notification.id, // Replace with the actual ID if needed
          ...notification,
          isRead: false,
          createdAt: new Date(), // Replace with actual timestamp from Firestore if needed
        });
      });
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  }

  // Function to fetch all notifications for a user
  async fetchNotifications() {
    if (this.loadingNotifications) return;
    this.loadingNotifications = true;
    if (!this.user) return;
    const userId = this.user.uid;
    try {
      const notificationsRef = collection(db, `users/${userId}/notifications`);
      const notificationsSnapshot = await getDocs(notificationsRef);
      runInAction(() => {
        this.notifications = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
      this.loadingNotifications = false;
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  // Function to mark a notification as read
  async markAsRead(userId, notificationId) {
    try {
      const notificationRef = doc(
        db,
        `users/${userId}/notifications`,
        notificationId
      );
      await updateDoc(notificationRef, { isRead: true });
      runInAction(() => {
        const notificationIndex = this.notifications.findIndex(
          (n) => n.id === notificationId
        );
        if (notificationIndex !== -1) {
          this.notifications[notificationIndex].isRead = true;
        }
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Function to delete a notification
  async deleteNotification(userId, notificationId) {
    try {
      const notificationRef = doc(
        db,
        `users/${userId}/notifications`,
        notificationId
      );
      await deleteDoc(notificationRef);
      runInAction(() => {
        this.notifications = this.notifications.filter(
          (n) => n.id !== notificationId
        );
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  // REVIEWS
  // Fetch the last 10 reviews for a specific product
  // async fetchReviews(productId, lastVisible = null) {
  //   try {
  //     const reviewsCollectionRef = collection(db, "reviews");
  //     let q;

  //     if (lastVisible) {
  //       q = query(
  //         reviewsCollectionRef,
  //         where("productId", "==", productId),
  //         orderBy("createdAt", "desc"),
  //         startAfter(lastVisible),
  //         limit(2)
  //       );
  //     } else {
  //       q = query(
  //         reviewsCollectionRef,
  //         where("productId", "==", productId),
  //         orderBy("createdAt", "desc"),
  //         limit(2)
  //       );
  //     }

  //     const querySnapshot = await getDocs(q);

  //     const newReviews = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     runInAction(() => {
  //       // Use a Set to track review IDs and filter out duplicates
  //       const existingReviewIds = new Set(this.reviews.map((r) => r.id));
  //       const uniqueNewReviews = newReviews.filter(
  //         (r) => !existingReviewIds.has(r.id)
  //       );

  //       this.reviews = [...this.reviews, ...uniqueNewReviews];
  //       this.lastReviewFetched =
  //         querySnapshot.docs[querySnapshot.docs.length - 1];
  //       this.hasMoreReviews = querySnapshot.docs.length === 2;
  //     });
  //   } catch (error) {
  //     console.log("Error fetching reviews:", error);
  //   }
  // }

  async fetchReviews(productId, lastVisible = null) {
    try {
      const reviewsCollectionRef = collection(db, "reviews");
      let q;

      if (lastVisible) {
        q = query(
          reviewsCollectionRef,
          where("productId", "==", productId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(2)
        );
      } else {
        q = query(
          reviewsCollectionRef,
          where("productId", "==", productId),
          orderBy("createdAt", "desc"),
          limit(2)
        );
      }

      const querySnapshot = await getDocs(q);

      const newReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      runInAction(() => {
        if (!this.reviewsByProduct[productId]) {
          this.reviewsByProduct[productId] = [];
        }

        // Use a Set to track review IDs and filter out duplicates
        const existingReviewIds = new Set(
          this.reviewsByProduct[productId].map((r) => r.id)
        );
        const uniqueNewReviews = newReviews.filter(
          (r) => !existingReviewIds.has(r.id)
        );

        this.reviewsByProduct[productId] = [
          ...this.reviewsByProduct[productId],
          ...uniqueNewReviews,
        ];
        this.lastReviewFetchedByProduct[productId] =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        this.hasMoreReviewsByProduct[productId] =
          querySnapshot.docs.length === 2;
      });
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  }

  async submitReview(productId, rating, comment) {
    try {
      // Ensure the user has purchased the product
      const ordersCollectionRef = collection(db, "orders");
      const ordersQuery = query(
        ordersCollectionRef,
        where("userId", "==", this.user.uid), // Filter by the current user's ID
        where("productIds", "array-contains", productId)
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      const hasPurchased = !ordersSnapshot.empty;
      if (!hasPurchased) {
        console.log("You can only review products you've purchased.");
        return;
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
          username: this.user.username,
          rating,
          comment,
          createdAt: new Date(),
        });
        await this.updateProductRating(productId, rating);

        // Add notification
        const notification = {
          title: "Review Submitted!",
          message: `You gained 3 XP for leaving a review.`,
          link: `/rewards`,
          type: "review",
        };
        await this.addNotification(notification);
      } else {
        console.log("You have already reviewed this product.");
      }
    } catch (error) {
      console.log("Error submitting review:", error);
    }
  }

  async updateReview(reviewId, productId, newRating, newComment) {
    try {
      const reviewDocRef = doc(db, "reviews", reviewId);
      const reviewSnapshot = await getDoc(reviewDocRef);

      if (!reviewSnapshot.exists()) {
        console.log("Review not found.");
        return;
      }

      const reviewData = reviewSnapshot.data();
      const oldRating = reviewData.rating;

      // Update the review in Firestore
      await updateDoc(reviewDocRef, {
        rating: newRating,
        comment: newComment,
        updatedAt: new Date(),
      });

      // Update the product's average rating based on the rating change
      await this.updateProductRating(productId, newRating, oldRating);

      // Update the review in the local MobX store for the specific product
      runInAction(() => {
        if (this.reviewsByProduct[productId]) {
          this.reviewsByProduct[productId] = this.reviewsByProduct[
            productId
          ].map((review) =>
            review.id === reviewId
              ? { ...review, rating: newRating, comment: newComment }
              : review
          );
        }
      });
    } catch (error) {
      console.log("Error updating review:", error);
    }
  }

  async updateProductRating(productId, newRating, oldRating = null) {
    try {
      const productDocRef = doc(db, "products", productId);
      const productSnapshot = await getDoc(productDocRef);

      if (!productSnapshot.exists()) {
        console.log("Product not found.");
        return;
      }

      const productData = productSnapshot.data();
      const currentRating = productData.averageRating || 0;
      const totalReviews = productData.totalReviews || 0;

      let newAverageRating;

      if (oldRating === null) {
        // First review case
        const newTotalRating = currentRating * totalReviews + newRating;
        newAverageRating = newTotalRating / (totalReviews + 1);

        // Update product with new average rating and increment total reviews
        await updateDoc(productDocRef, {
          averageRating: parseFloat(newAverageRating.toFixed(1)),
          totalReviews: totalReviews + 1,
        });
      } else {
        // Update existing review case
        const newTotalRating =
          currentRating * totalReviews - oldRating + newRating;
        newAverageRating = newTotalRating / totalReviews;

        // Update product with new average rating
        await updateDoc(productDocRef, {
          averageRating: parseFloat(newAverageRating.toFixed(1)),
        });
      }
    } catch (error) {
      console.log("Error updating product rating:", error);
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
    if (this.loadingCart) return;
    this.loadingCart = true;
    if (this.user) {
      this.fetchCartFromFirestore();
    } else {
      // this.fetchCartFromLocalStorage();
    }
  }

  clearCart() {
    runInAction(() => {
      this.cart = [];
    });

    if (this.user) {
      this.syncCartWithFirestore();
    } else {
      this.syncCartWithLocalStorage();
    }
  }

  async fetchCartFromFirestore() {
    try {
      const cartDocRef = doc(db, "carts", this.user.uid);
      const cartDoc = await getDoc(cartDocRef);
      runInAction(() => {
        this.cart = cartDoc.exists() ? cartDoc.data().items : [];
      });
      this.loadingCart = false;
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
      // this.syncCartWithLocalStorage();
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
      // this.syncCartWithLocalStorage();
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

  async fetchOrders() {
    if (!this.user) return;

    try {
      const ordersCollectionRef = collection(db, "orders");
      const q = query(
        ordersCollectionRef,
        where("userId", "==", this.user.uid)
      );
      const querySnapshot = await getDocs(q);

      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      runInAction(() => {
        this.orders = fetchedOrders;
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
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
    this.loadingProducts = true;
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
        this.loadingProducts = false;
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

  // New methods for filters
  setFilter(filterType, value) {
    if (Array.isArray(this.filters[filterType])) {
      if (this.filters[filterType].includes(value)) {
        this.filters[filterType] = this.filters[filterType].filter(
          (item) => item !== value
        );
      } else {
        this.filters[filterType].push(value);
      }
    } else {
      this.filters[filterType] = value;
    }
  }

  resetFilters() {
    this.filters = {
      types: [],
      difficulty: [],
      minPlayers: 1,
      maxPlayers: 6,
    };
  }

  get filteredProducts() {
    return this.products.filter((product) => {
      const typeMatch =
        this.filters.types.length === 0 ||
        this.filters.types.some((type) => product.types?.includes(type));
      const difficultyMatch =
        this.filters.difficulty.length === 0 ||
        this.filters.difficulty.includes(product.difficulty);
      const playersMatch =
        product.minPlayers >= this.filters.minPlayers &&
        product.maxPlayers <= this.filters.maxPlayers;
      return typeMatch && difficultyMatch && playersMatch;
    });
  }
}

const MobxStore = new Store();
export default MobxStore;
