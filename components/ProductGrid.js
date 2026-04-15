import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, isLoading }) {
  // 🔄 Loading state
  if (isLoading) {
    return (
      <View style={{ marginTop: 20 }}>
        <ActivityIndicator size="large" />
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Loading products...{" "}
        </Text>{" "}
      </View>
    );
  }

  // ❌ No products
  if (!products || products.length === 0) {
    return (
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Text style={{ fontSize: 18 }}> No products found📦 </Text>{" "}
        <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
          Try adjusting filters{" "}
        </Text>{" "}
      </View>
    );
  }

  // ✅ Product list
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <ProductCard product={item} />{" "}
        </View>
      )}
    />
  );
}
