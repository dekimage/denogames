import { makeAutoObservable, runInAction } from "mobx";
import { auth } from "@/firebase";

class AdminStore {
  achievements = [];
  products = [];
  patrons = [];
  refreshStatus = {
    message: null,
    updatedCount: 0,
    failedCount: 0,
    failures: [],
    error: null,
  };
  loading = {
    achievements: false,
    products: false,
    patrons: false,
    refreshingPatrons: false,
  };

  constructor() {
    makeAutoObservable(this);
  }

  async getAuthHeaders() {
    if (!auth.currentUser) {
      console.error("AdminStore: User not logged in for getting headers.");
      throw new Error("User not authenticated.");
    }
    try {
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) {
        throw new Error("Failed to get authentication token.");
      }
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("AdminStore: Error getting auth token:", error);
      throw new Error("Authentication token retrieval failed.");
    }
  }

  // Achievements
  async fetchAchievements() {
    if (this.achievements.length > 0) return this.achievements;

    try {
      runInAction(() => {
        this.loading.achievements = true;
      });

      const headers = await this.getAuthHeaders();
      const response = await fetch("/api/admin/achievements", { headers });
      if (!response.ok) throw new Error("Failed to fetch achievements");

      const data = await response.json();

      runInAction(() => {
        this.achievements = data.achievements || [];
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw error;
    } finally {
      runInAction(() => {
        this.loading.achievements = false;
      });
    }
  }

  async createAchievement(achievement) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch("/api/admin/achievements", {
        method: "POST",
        headers,
        body: JSON.stringify(achievement),
      });

      if (!response.ok) throw new Error("Failed to create achievement");
      const { item } = await response.json();

      runInAction(() => {
        this.achievements = [item, ...this.achievements];
      });
      return item;
    } catch (error) {
      console.error("Error creating achievement:", error);
      throw error;
    }
  }

  async updateAchievement(id, data) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch("/api/admin/achievements", {
        method: "POST",
        headers,
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) throw new Error("Failed to update achievement");
      const { item } = await response.json();

      runInAction(() => {
        const index = this.achievements.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.achievements[index] = item;
        }
      });
      return item;
    } catch (error) {
      console.error("Error updating achievement:", error);
      throw error;
    }
  }

  async deleteAchievement(id) {
    try {
      // First find the achievement to get its image URL
      const achievement = this.achievements.find((a) => a.id === id);
      const headers = await this.getAuthHeaders();

      // Delete the achievement document
      const response = await fetch(`/api/admin/achievements?id=${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Failed to delete achievement");

      // If there was an image, delete it too
      if (achievement?.image) {
        const imageResponse = await fetch("/api/admin/upload", {
          method: "DELETE",
          headers,
          body: JSON.stringify({ fileUrl: achievement.image }),
        });

        if (!imageResponse.ok) {
          console.error("Failed to delete achievement image");
        }
      }

      runInAction(() => {
        this.achievements = this.achievements.filter((a) => a.id !== id);
      });
    } catch (error) {
      console.error("Error deleting achievement:", error);
      throw error;
    }
  }

  // Products Methods
  async fetchProducts() {
    if (this.loading.products) return;

    try {
      runInAction(() => {
        this.loading.products = true;
      });

      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      runInAction(() => {
        this.products = data.products || [];
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    } finally {
      runInAction(() => {
        this.loading.products = false;
      });
    }
  }

  getProductById(id) {
    return this.products.find((p) => p.id === id);
  }

  async createProduct(product) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Failed to create product");
      const { item } = await response.json();

      runInAction(() => {
        this.products = [item, ...this.products];
      });
      return item;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id, data) {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) throw new Error("Failed to update product");
      const { item } = await response.json();

      runInAction(() => {
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.products[index] = item;
        }
      });
      return item;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = this.products.find((p) => p.id === id);
      const token = await auth.currentUser?.getIdToken();

      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      // Delete thumbnail if exists
      if (product?.thumbnail) {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileUrl: product.thumbnail }),
        });
      }

      runInAction(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Patreon Methods
  async fetchPatrons() {
    console.log("AdminStore: Fetching patrons...");
    runInAction(() => {
      this.loading.patrons = true;
      this.patrons = [];
    });

    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch("/api/admin/patrons", { headers });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to fetch patrons (${response.status})`
        );
      }

      const data = await response.json();
      console.log("AdminStore: Patrons received:", data.patrons);

      runInAction(() => {
        this.patrons = (data.patrons || []).sort((a, b) => {
          const nameA = a.name?.toLowerCase() || "";
          const nameB = b.name?.toLowerCase() || "";
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      });
    } catch (error) {
      console.error("AdminStore: Error fetching patrons:", error);
      runInAction(() => {
        this.patrons = [];
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading.patrons = false;
      });
    }
  }

  async refreshAllPatrons() {
    if (this.loading.refreshingPatrons) return;

    console.log("AdminStore: Initiating bulk Patreon refresh...");
    runInAction(() => {
      this.loading.refreshingPatrons = true;
      this.refreshStatus = {
        message: "Starting refresh...",
        updatedCount: 0,
        failedCount: 0,
        failures: [],
        error: null,
      };
    });

    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch("/api/admin/patreon/refresh-all", {
        method: "POST",
        headers,
      });

      const data = await response.json();
      console.log("AdminStore: Refresh response received:", data);

      if (!response.ok) {
        throw new Error(data.error || `Refresh failed (${response.status})`);
      }

      runInAction(() => {
        this.refreshStatus = {
          message: data.message || "Refresh complete.",
          updatedCount: data.updatedCount || 0,
          failedCount: data.failedCount || 0,
          failures: data.failures || [],
          error: null,
        };
      });

      console.log("AdminStore: Refresh successful, refetching patron list...");
      await this.fetchPatrons();
    } catch (error) {
      console.error("AdminStore: Error refreshing patrons:", error);
      runInAction(() => {
        this.refreshStatus = {
          message: "Refresh failed.",
          updatedCount: 0,
          failedCount: this.patrons.length,
          failures: [],
          error: error.message,
        };
      });
    } finally {
      runInAction(() => {
        this.loading.refreshingPatrons = false;
      });
    }
  }

  // Clear store data (useful for logout)
  clearStore() {
    runInAction(() => {
      this.achievements = [];
      this.products = [];
      this.patrons = [];
      this.refreshStatus = {
        message: null,
        updatedCount: 0,
        failedCount: 0,
        failures: [],
        error: null,
      };
      this.loading = {
        achievements: false,
        products: false,
        patrons: false,
        refreshingPatrons: false,
      };
    });
  }
}

export default new AdminStore();
