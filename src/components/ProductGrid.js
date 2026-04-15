import React, { memo } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_SPACING = 16;
const CALCULATED_WIDTH = (width - ITEM_SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

const ProductGrid = ({ products = [], isLoading = false }) => {
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007aff" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    if (!products || products.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No products found</Text>
            </View>
        );
    }

    const renderProductItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <ProductCard product={item} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                numColumns={COLUMN_COUNT}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                maxToRenderPerBatch={10}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: ITEM_SPACING / 2,
        paddingBottom: ITEM_SPACING,
        flexGrow: 1,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: ITEM_SPACING,
        paddingHorizontal: ITEM_SPACING / 2,
    },
    itemContainer: {
        width: CALCULATED_WIDTH,
    },
    centerContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#888',
    },
});

export default memo(ProductGrid);