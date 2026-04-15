// eslint-disable-next-line import/no-unresolved
import axios from "axios";

// 👉 base URL for Platzi Fake Store API
const api = axios.create({
    baseURL: "https://api.escuelajs.co/api/v1",
    timeout: 10000,
});

// 🔥 All API functions
export const productAPI = {
    // get all products
    getAllProducts: async() => {
        try {
            const response = await api.get("/products");
            return response.data;
        } catch (error) {
            console.log("Error fetching products:", error.message);
            return [];
        }
    },

    // single product
    getProductById: async(id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.log("Error fetching product:", error.message);
            return null;
        }
    },

    // category list
    getCategories: async() => {
        try {
            const response = await api.get("/categories");
            return response.data;
        } catch (error) {
            console.log("Error fetching categories:", error.message);
            return [];
        }
    },

    // category wise products
    getProductsByCategory: async(categoryId) => {
        try {
            const response = await api.get(`/categories/${categoryId}/products`);
            return response.data;
        } catch (error) {
            console.log("Error fetching category products:", error.message);
            return [];
        }
    },
};

export default api;