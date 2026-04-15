// eslint-disable-next-line import/no-unresolved
import axios from "axios";

// 👉 simple base URL
const api = axios.create({
    baseURL: "https://fakestoreapi.com",
    timeout: 5000,
});

// 🔥 All API functions
export const productAPI = {

    // সব product
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
            const response = await api.get("/products/categories");
            return response.data;
        } catch (error) {
            console.log("Error fetching categories:", error.message);
            return [];
        }
    },

    // category wise product
    getProductsByCategory: async(category) => {
        try {
            const response = await api.get(`/products/category/${category}`);
            return response.data;
        } catch (error) {
            console.log("Error fetching category products:", error.message);
            return [];
        }
    },
};

export default api;