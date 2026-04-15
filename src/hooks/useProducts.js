import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prods, cats] = await Promise.all([
        productAPI.getAllProducts(),
        productAPI.getCategories()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return { products, categories, loading, error, refresh: fetchData };
};
