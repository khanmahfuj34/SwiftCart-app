import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGQneWQH7CjChs7VvJmfrAtbGN9iNNM8Y",
  authDomain: "swiftcart-app-68c3b.firebaseapp.com",
  projectId: "swiftcart-app-68c3b",
  storageBucket: "swiftcart-app-68c3b.firebasestorage.app",
  messagingSenderId: "786839384011",
  appId: "1:786839384011:web:9ce0c8c19eaadfe661d04e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);