import { makeAutoObservable, runInAction } from "mobx";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  getAuth,
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
  updateDoc,
  getDocs,
  where,
  orderBy,
  limit,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";

class Store {
  // App Data

  fetching = false;

  // App Store

  products = [];
  user = null;
  cart = [];
  orders = [];
  notifications = [];

  // reviews = [];
  // lastReviewFetched = null;
  // hasMoreReviews = true;

  reviewsByProduct = {};

  // Last review fetched for each product (for pagination)
  lastReviewFetchedByProduct = {};

  // Whether more reviews are available for each product
  hasMoreReviewsByProduct = {};
  // Static Data

  // App States
  isMobileOpen = false;
  loading = false; // Initialize to false
  loadingUser = false;
  loadingProducts = false;
  loadingCart = false;
  loadingNotifications = false;
  cartFetched = false;
  // New properties for filters
  filters = {
    types: [],
    difficulty: [],
    minPlayers: 1,
    maxPlayers: 6,
  };

  blogs = [];
  blogDetails = new Map();
  blogsLoading = false;
  blogDetailsLoading = new Map();
  blogsFetched = false;

  // Add a new state to track when everything is fully loaded
  userFullyLoaded = false;

  // Add to existing properties
  achievements = [];
  achievementsLoading = false;

  // Add new properties
  claimingReward = false;

  ordersFetched = false; // New flag to track if orders were fetched

  activeLocation = null;

  // Add these new properties to your Store class
  gameDetailsCache = new Map(); // Store fetched game details
  gameDetailsLoading = new Map(); // Track loading state for each game

  // Add a new loading state for orders
  ordersLoading = false;
  ordersFetched = false; // Flag to track if orders were already fetched

  // Add these properties to your Store class
  userReviews = [];
  userReviewsLoading = false;
  userReviewsFetched = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
    this.fetchProducts();

    this.fetchProducts = this.fetchProducts.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);
    this.fetchAchievements = this.fetchAchievements.bind(this);

    this.claimSpecialReward = this.claimSpecialReward.bind(this);

    //AUTH
    this.loginWithEmail = this.loginWithEmail.bind(this);
    this.signupWithEmail = this.signupWithEmail.bind(this);
    this.logout = this.logout.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);

    //CART
    this.fetchCart = this.fetchCart.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.transferLocalStorageCartToFirestore =
      this.transferLocalStorageCartToFirestore.bind(this);

    //REVIEWS
    this.fetchReviews = this.fetchReviews.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.updateProductRating = this.updateProductRating.bind(this);

    //NOTIFICATIONS
    this.fetchNotifications = this.fetchNotifications.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);

    //FILTERS - SHOP
    this.setFilter = this.setFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);

    //BLOG
    this.fetchBlogs = this.fetchBlogs.bind(this);
    this.fetchBlogDetails = this.fetchBlogDetails.bind(this);
    this.isBlogDetailsLoading = this.isBlogDetailsLoading.bind(this);

    this.getRelatedExpansions = this.getRelatedExpansions.bind(this);

    this.setActiveLocation = this.setActiveLocation.bind(this);
    this.setIsMobileOpen = this.setIsMobileOpen.bind(this);

    // Bind the new method
    this.fetchGameDetails = this.fetchGameDetails.bind(this);

    // Add these methods to your Store class
    this.fetchUserReviews = this.fetchUserReviews.bind(this);
  }

  initializeAuth() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!this.loadingUser) {
        runInAction(() => {
          this.loadingUser = true;
          this.loading = true;
          this.userFullyLoaded = false; // Reset this when we start loading
        });
      }

      try {
        if (user) {
          // Get the user's ID token
          const token = await user.getIdToken();

          // Fetch user data from the API route
          const response = await fetch("/api/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const { user: userData } = await response.json();

          runInAction(() => {
            this.user = userData;
            this.userFullyLoaded = true; // Set this when we have everything
          });
          await this.fetchAchievements();
          await this.fetchCart();
          // await this.fetchNotifications();
        } else {
          runInAction(() => {
            this.user = null;
            this.userFullyLoaded = true; // Also set this when we know there's no user
          });
          await this.fetchCart();
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        runInAction(() => {
          this.userFullyLoaded = true; // Set this even on error
        });
      } finally {
        runInAction(() => {
          this.loadingUser = false;
          this.loading = false;
        });
      }
    });
  }

  setActiveLocation = (location) => {
    this.activeLocation = location;
  };

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
          limit(1)
        );
      } else {
        q = query(
          reviewsCollectionRef,
          where("productId", "==", productId),
          orderBy("createdAt", "desc"),
          limit(1)
        );
      }

      const querySnapshot = await getDocs(q);

      const newReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // console.log("Fetched new reviews:", newReviews);

      runInAction(() => {
        if (!this.reviewsByProduct[productId]) {
          this.reviewsByProduct[productId] = [];
        }

        // Use a Set to ensure uniqueness based on review ID
        const uniqueReviews = new Set(
          [...this.reviewsByProduct[productId], ...newReviews].map((review) =>
            JSON.stringify(review)
          )
        );
        this.reviewsByProduct[productId] = Array.from(uniqueReviews).map(
          (review) => JSON.parse(review)
        );

        this.lastReviewFetchedByProduct[productId] =
          querySnapshot.docs[querySnapshot.docs.length - 1];

        const totalReviews =
          this.products.find((p) => p.id === productId)?.totalReviews || 0;
        this.hasMoreReviewsByProduct[productId] =
          this.reviewsByProduct[productId].length < totalReviews;

        // console.log("Updated reviews:", this.reviewsByProduct[productId]);
        // console.log(
        //   "Has more reviews:",
        //   this.hasMoreReviewsByProduct[productId]
        // );
        // console.log(
        //   "Last review fetched:",
        //   this.lastReviewFetchedByProduct[productId]
        // );
      });

      return newReviews;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }

  async submitReview(productId, rating, comment) {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("No auth token available");

      const response = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const { reviewId } = await response.json();

      // Find the product to update its rating locally
      const productIndex = this.products.findIndex((p) => p.id === productId);
      if (productIndex >= 0) {
        const product = this.products[productIndex];
        const totalReviews = (product.totalReviews || 0) + 1;
        const currentRating = product.averageRating || 0;
        const newRating =
          (currentRating * (totalReviews - 1) + rating) / totalReviews;

        runInAction(() => {
          this.products[productIndex] = {
            ...product,
            averageRating: parseFloat(newRating.toFixed(1)),
            totalReviews: totalReviews,
          };
        });
      }

      // Add the review to userReviews
      const product = this.products.find((p) => p.id === productId);
      runInAction(() => {
        this.userReviews.unshift({
          id: reviewId,
          productId,
          userId: this.user.uid,
          username: this.user.username,
          rating,
          comment,
          createdAt: new Date().toISOString(),
          product: product
            ? {
                name: product.name,
                slug: product.slug,
                type: product.type,
                thumbnail: product.thumbnail,
              }
            : null,
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  }

  async updateReview(reviewId, productId, newRating, newComment) {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("No auth token available");

      const response = await fetch("/api/reviews/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewId,
          productId,
          rating: newRating,
          comment: newComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update review");
      }

      // Find the review to update it locally
      const reviewIndex = this.userReviews.findIndex((r) => r.id === reviewId);
      if (reviewIndex >= 0) {
        const oldRating = this.userReviews[reviewIndex].rating;

        runInAction(() => {
          this.userReviews[reviewIndex] = {
            ...this.userReviews[reviewIndex],
            rating: newRating,
            comment: newComment,
            updatedAt: new Date().toISOString(),
          };
        });

        // Update the product rating locally as well
        const productIndex = this.products.findIndex((p) => p.id === productId);
        if (productIndex >= 0) {
          const product = this.products[productIndex];
          const totalReviews = product.totalReviews || 0;
          if (totalReviews > 0) {
            const currentRating = product.averageRating || 0;
            const newAvgRating =
              (currentRating * totalReviews - oldRating + newRating) /
              totalReviews;

            runInAction(() => {
              this.products[productIndex] = {
                ...product,
                averageRating: parseFloat(newAvgRating.toFixed(1)),
              };
            });
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
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

  // Add a method to get achievement progress for an add-on
  getAddOnProgress(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (
      !product ||
      product.type !== "add-on" ||
      !product.requiredAchievements?.length
    ) {
      return 0;
    }

    const completed = product.requiredAchievements.filter((achievementId) =>
      this.user?.achievements?.includes(
        this.achievements.find((a) => a.id === achievementId)?.id
        //kluc
      )
    ).length;

    return {
      completed,
      total: product.requiredAchievements.length,
      percentage: (completed / product.requiredAchievements.length) * 100,
    };
  }

  async fetchCart() {
    if (this.loadingCart || this.cartFetched) return;
    this.loadingCart = true;

    try {
      if (this.user?.uid) {
        // Check if user and uid exist
        await this.fetchCartFromFirestore();
      } else {
        this.fetchCartFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      this.loadingCart = false;
      this.cartFetched = true;
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
    if (!this.user?.uid) return; // Guard clause

    try {
      const cartDocRef = doc(db, "carts", this.user.uid);
      const cartDoc = await getDoc(cartDocRef);

      runInAction(() => {
        this.cart = cartDoc.exists() ? cartDoc.data().items : [];
      });
    } catch (error) {
      console.error("Error fetching cart from Firestore:", error);
      // Set empty cart on error
      runInAction(() => {
        this.cart = [];
      });
    }
  }

  fetchCartFromLocalStorage() {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      runInAction(() => {
        this.cart = cart;
      });
    } else {
      // Set an empty cart for SSR
      runInAction(() => {
        this.cart = [];
      });
    }
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
    if (!this.user?.uid) return; // Guard clause

    try {
      const cartDocRef = doc(db, "carts", this.user.uid);
      await setDoc(cartDocRef, { items: this.cart });
    } catch (error) {
      console.log("Error syncing cart with Firestore:", error);
    }
  }

  syncCartWithLocalStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    }
  }

  async transferLocalStorageCartToFirestore() {
    const localCart =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("cart") || "[]")
        : [];

    if (localCart.length > 0 && this.user) {
      try {
        // Get the existing Firestore cart for the authenticated user
        const cartDocRef = doc(db, "carts", this.user.uid);
        const cartDoc = await getDoc(cartDocRef);
        const firestoreCart = cartDoc.exists() ? cartDoc.data().items : [];

        // Get the user's purchased products to filter them out of the cart
        const userDocRef = doc(db, "users", this.user.uid);
        const userDoc = await getDoc(userDocRef);
        const purchasedProducts = userDoc.exists()
          ? userDoc.data().purchasedProducts || []
          : [];

        // Merge the local cart and Firestore cart, avoiding duplicates
        let mergedCart = [...new Set([...firestoreCart, ...localCart])];

        // Filter out already purchased products
        mergedCart = mergedCart.filter(
          (productId) => !purchasedProducts.includes(productId)
        );

        // Update the cart in Mobx and sync the merged cart with Firestore
        runInAction(() => {
          this.cart = mergedCart;
        });

        // Sync the filtered and merged cart with Firestore
        await this.syncCartWithFirestore();

        // Clear the localStorage cart after successful transfer
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
        }
      } catch (error) {
        console.error(
          "Error transferring localStorage cart to Firestore:",
          error
        );
      }
    }
  }

  // Global Loading State
  setLoading(isLoading) {
    runInAction(() => {
      this.loading = isLoading;
    });
  }

  async fetchOrders() {
    // Return early if we already have the orders or if they're already being fetched
    if (this.ordersFetched || this.ordersLoading || !this.user) return;

    try {
      // Set loading flag to true before starting the fetch
      runInAction(() => {
        this.ordersLoading = true;
      });

      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("No auth token available");

      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      runInAction(() => {
        this.orders = data.orders;
        this.ordersFetched = true; // Mark as fetched
        this.ordersLoading = false;
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      runInAction(() => {
        this.ordersFetched = false; // Reset flag on error
        this.ordersLoading = false;
      });
    }
  }

  // Add a method to reset orders state (useful for logout)
  resetOrders() {
    runInAction(() => {
      this.orders = [];
      this.ordersFetched = false;
    });
  }

  async logout() {
    try {
      await signOut(auth);
      runInAction(() => {
        this.user = null;
        this.achievements = [];
        this.resetOrders(); // Clear orders data on logout
        this.resetUserReviews(); // Clear reviews data on logout
      });
    } catch (error) {
      console.log("Error during logout:", error);
    }
  }

  async fetchProducts() {
    if (this.products.length > 0 && !this.loadingProducts) return;
    this.loadingProducts = true;
    try {
      // Use absolute URL instead of relative URL
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      const response = await fetch(`${origin}/api/products`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();

      runInAction(() => {
        this.products = data.products || [];
        this.loadingProducts = false;
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      runInAction(() => {
        this.loadingProducts = false;
        this.products = []; // Ensure products is an array even if fetch fails
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
      await this.transferLocalStorageCartToFirestore();
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
      const user = userCredential.user;

      // Call your API to handle Firestore profile creation and merging
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          username: username,
        }),
      });

      const result = await response.json();

      if (result.success) {
        runInAction(() => {
          this.user = result.user; // Store full user profile from API response
          this.loading = false;
        });
        await this.transferLocalStorageCartToFirestore();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error signing up with email:", error);
      runInAction(() => {
        this.loading = false;
      });
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      this.loading = true;
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Call your API to handle Firestore profile creation and merging (just like email sign-up)
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          username: user.displayName || "New User",
        }),
      });

      const resultData = await response.json();

      if (resultData.success) {
        runInAction(() => {
          this.user = resultData.user; // Store full user profile from API response
          this.loading = false;
        });
        await this.transferLocalStorageCartToFirestore();
      } else {
        throw new Error(resultData.error);
      }
    } catch (error) {
      console.error("Error with Google sign-in:", error);
      runInAction(() => {
        this.loading = false;
      });
      throw error;
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

  async fetchBlogs(limit = null) {
    if (this.blogsLoading) return;

    // If we already have blogs and no limit is specified, or we've already fetched all blogs
    if (
      this.blogs.length > 0 &&
      (limit === null || this.blogs.length >= limit) &&
      this.blogsFetched
    ) {
      // If we need just a subset and we already have more, return early
      return;
    }

    this.blogsLoading = true;
    try {
      // Add limit parameter to the API call if specified
      const url = limit ? `/api/wordpress?limit=${limit}` : "/api/wordpress";
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch blogs");

      const data = await response.json();

      // Ensure all blog objects have the required fields
      const processedBlogs = data.map((blog) => ({
        ...blog,
        // Ensure thumbnail exists
        thumbnail: blog.thumbnail || null,
        // Ensure date is properly formatted
        date: blog.date || new Date().toISOString(),
        // Ensure categories is an array
        categories: Array.isArray(blog.categories) ? blog.categories : [],
        // Ensure excerpt exists
        excerpt: blog.excerpt || "",
      }));

      runInAction(() => {
        this.blogs = processedBlogs;
        this.blogsFetched = true;
        this.blogsLoading = false;
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      runInAction(() => {
        this.blogsLoading = false;
      });
      throw error; // Re-throw to allow component to handle the error
    }
  }

  async fetchBlogDetails(slug) {
    if (this.blogDetails.has(slug)) return this.blogDetails.get(slug);
    if (this.blogDetailsLoading.get(slug)) return;

    runInAction(() => {
      this.blogDetailsLoading.set(slug, true);
    });

    try {
      const response = await fetch(`/api/wordpress?slug=${slug}`);
      if (!response.ok) throw new Error("Failed to fetch blog details");
      const data = await response.json();
      runInAction(() => {
        this.blogDetails.set(slug, data);
        this.blogDetailsLoading.set(slug, false);
      });
      return data;
    } catch (error) {
      console.error("Error fetching blog details:", error);
      runInAction(() => {
        this.blogDetailsLoading.set(slug, false);
      });
    }
  }

  // Getter for checking if a specific blog's details are loading
  isBlogDetailsLoading(slug) {
    return this.blogDetailsLoading.get(slug) || false;
  }

  getRelatedExpansions(gameId, { includeOwned = false } = {}) {
    const expansions = this.products.filter((product) => {
      const isExpansionForGame =
        product.type === "expansion" &&
        product.relatedGames &&
        product.relatedGames.includes(gameId);

      if (!includeOwned) {
        // Original behavior: filter out owned expansions
        return (
          isExpansionForGame &&
          !this.user?.purchasedProducts?.includes(product.id)
        );
      }

      // Return all expansions with ownership info
      return isExpansionForGame;
    });

    if (includeOwned) {
      // Enrich with ownership information when requested
      return expansions.map((expansion) => ({
        ...expansion,
        isOwned: this.user?.purchasedProducts?.includes(expansion.id) || false,
      }));
    }

    return expansions;
  }

  updateUserProfile(userData) {
    runInAction(() => {
      // Merge the new user data with existing user data
      this.user = {
        ...this.user,
        ...userData,
        // Ensure we keep these critical fields
        uid: this.user.uid,
        email: this.user.email,
      };
    });
  }

  async fetchAchievements() {
    if (this.achievements.length > 0 && !this.achievementsLoading) return; // Don't refetch if we have data

    try {
      runInAction(() => {
        this.achievementsLoading = true;
      });

      const response = await fetch("/api/achievements", {
        headers: {
          Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch achievements");

      const { achievements } = await response.json();

      runInAction(() => {
        this.achievements = achievements;
        this.achievementsLoading = false;
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
      runInAction(() => {
        this.achievementsLoading = false;
      });
    }
  }

  async claimSpecialReward(rewardId) {
    try {
      runInAction(() => {
        this.claimingReward = true;
      });

      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/special-rewards/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rewardId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to claim reward");
      }

      const { unlockedRewards } = await response.json();

      runInAction(() => {
        this.user.unlockedRewards = unlockedRewards;
      });

      return true;
    } catch (error) {
      console.error("Error claiming reward:", error);
      throw error;
    } finally {
      runInAction(() => {
        this.claimingReward = false;
      });
    }
  }

  // Add this method to your Store class
  getAchievementByKey(id) {
    return this.achievements.find((achievement) => achievement.id === id);
  }

  // Add this method to your MobxStore class
  getProductBySlug(slug) {
    const product = this.products.find((p) => p.slug === slug);

    if (
      product &&
      product.type === "add-on" &&
      product.requiredAchievements?.length
    ) {
      // Enrich with achievement data from the store
      const achievements = product.requiredAchievements
        .map((id) => this.achievements.find((a) => a.id === id))
        .filter(Boolean);

      // Return a new object with the achievements added
      return {
        ...product,
        achievements,
      };
    }

    return product;
  }

  // Add this method to your Store class
  async fetchGameDetails(slug) {
    // If we're already loading this game's details, return the existing promise
    if (this.gameDetailsLoading.get(slug)) {
      return this.gameDetailsLoading.get(slug);
    }

    // If we already have cached data for this game, return it
    if (this.gameDetailsCache.has(slug)) {
      return this.gameDetailsCache.get(slug);
    }

    // Create a promise for the data fetch
    const fetchPromise = (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("No auth token available");

        const response = await fetch(`/api/game-details/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Cache the result
        runInAction(() => {
          this.gameDetailsCache.set(slug, data);
        });

        return data;
      } catch (error) {
        console.error("Error fetching game details:", error);
        throw error;
      } finally {
        // Remove the loading promise when done
        runInAction(() => {
          this.gameDetailsLoading.delete(slug);
        });
      }
    })();

    // Store the promise so we can return it for concurrent requests
    this.gameDetailsLoading.set(slug, fetchPromise);

    return fetchPromise;
  }

  // Add these methods to your Store class
  async fetchUserReviews() {
    // Return early if we already have the reviews or if they're already being fetched
    if (this.userReviewsFetched || this.userReviewsLoading || !this.user)
      return;

    try {
      // Set loading flag to true before starting the fetch
      runInAction(() => {
        this.userReviewsLoading = true;
      });

      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("No auth token available");

      const response = await fetch("/api/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      runInAction(() => {
        this.userReviews = data.reviews;
        this.userReviewsFetched = true; // Mark as fetched
        this.userReviewsLoading = false;
      });
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      runInAction(() => {
        this.userReviewsFetched = false; // Reset flag on error
        this.userReviewsLoading = false;
      });
    }
  }

  // Add this method to reset reviews state on logout
  resetUserReviews() {
    runInAction(() => {
      this.userReviews = [];
      this.userReviewsFetched = false;
    });
  }
}

const MobxStore = new Store();
export default MobxStore;
