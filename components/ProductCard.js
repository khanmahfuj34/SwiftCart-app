import React, { memo } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

function ProductCard({ product }) {
    const router = useRouter();

    return (
        <View style={styles.card}>
            {/* Image */}
            <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
            />

            {/* Category + Rating */}
            <View style={styles.row}>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.rating}>⭐{product?.rating?.rate ?? 0}</Text>
            </View>

            {/* Title */}
            <Text numberOfLines={2} style={styles.title}>
                {product.title}
            </Text>

            {/* Price */}
            <Text style={styles.price}>
                ${product.price}
            </Text>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={styles.detailsBtn}
                    onPress={() => router.push(`/product/${product.id}`)}
                >
                    <Text style={styles.btnText}>Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cartBtn}>
                    <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 10,
        margin: 8,
        borderRadius: 10,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 120,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    category: {
        fontSize: 12,
        color: "#555",
    },
    rating: {
        fontSize: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 5,
        color: "#007bff",
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 10,
        gap: 5,
    },
    detailsBtn: {
        flex: 1,
        backgroundColor: "#eee",
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
    },
    cartBtn: {
        flex: 1,
        backgroundColor: "#007bff",
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
    },
    btnText: {
        fontSize: 12,
        color: "#000",
    },
});