 
import axios from "axios";

// 👉 base URL for Platzi Fake Store API - https://fakeapi.platzi.com/
const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 All API functions
export const productAPI = {
  // get all products with pagination [GET] https://api.escuelajs.co/api/v1/products
  getAllProducts: async (limit = 0) => {
    try {
      const response = await api.get("/products", {
        params: {
          limit: limit || 250, // Fetch all products (0 = no limit, default 250)
          offset: 0,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching products:", error.message);
      return [];
    }
  },

  // single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data || null;
    } catch (error) {
      console.error("Error fetching product:", error.message);
      return null;
    }
  },

  // category list [GET] https://api.escuelajs.co/api/v1/categories
  getCategories: async () => {
    try {
      const response = await api.get("/categories");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }
  },

  // category wise products by ID
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}/products`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching category products:", error.message);
      return [];
    }
  },

  // search products by title
  searchProducts: async (query) => {
    try {
      const response = await api.get("/products", {
        params: {
          title: query,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error searching products:", error.message);
      return [];
    }
  },
};

export default api;
