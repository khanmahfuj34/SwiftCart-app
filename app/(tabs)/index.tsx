import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ProductGrid from "../../components/ProductGrid";
import { productAPI } from "../services/api";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await productAPI.getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          My E-commerce App 🛒
        </Text>
      </View>

      <ProductGrid products={products} isLoading={loading} />
    </ScrollView>
  );
}
