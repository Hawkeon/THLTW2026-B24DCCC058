import { useState, useEffect, useCallback } from 'react';
import { getLocalStorage, setLocalStorage, APP_PRODUCTS_KEY } from '@/utils/storage';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

const initialProducts: Product[] = [
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
    { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
    { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
    { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
    { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
    { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 }
];

export default function useProductsModel() {
    const [products, setProducts] = useState<Product[]>(() =>
        getLocalStorage<Product[]>(APP_PRODUCTS_KEY, initialProducts)
    );

    // Persist on change
    useEffect(() => {
        setLocalStorage(APP_PRODUCTS_KEY, products);
    }, [products]);

    const addProduct = useCallback((product: Omit<Product, 'id'>) => {
        setProducts((prev) => {
            const newId = prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1;
            return [...prev, { ...product, id: newId }];
        });
    }, []);

    const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
        setProducts((prev) => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    const deleteProduct = useCallback((id: number) => {
        setProducts((prev) => prev.filter(p => p.id !== id));
    }, []);

    // Increase or decrease stock. amount can be negative.
    const updateStock = useCallback((id: number, delta: number) => {
        setProducts((prev) => prev.map(p => {
            if (p.id !== id) return p;
            const newQuantity = p.quantity + delta;
            return { ...p, quantity: Math.max(0, newQuantity) };
        }));
    }, []);

    return {
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
    };
}
