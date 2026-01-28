import { useState, useEffect, useCallback } from 'react';
import { useModel } from 'umi';
import { getLocalStorage, setLocalStorage, APP_ORDERS_KEY } from '@/utils/storage';

export type OrderStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    products: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
}

const initialOrders: Order[] = [
    {
        id: 'DH001',
        customerName: 'Nguyễn Văn A',
        phone: '0912345678',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        products: [{ productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }],
        totalAmount: 25000000,
        status: 'Chờ xử lý',
        createdAt: '2024-01-15'
    }
];

export default function useOrdersModel() {
    const [orders, setOrders] = useState<Order[]>(() =>
        getLocalStorage<Order[]>(APP_ORDERS_KEY, initialOrders)
    );

    // We need to access product model actions for inventory sync
    // Note: Circular dependency between models is tricky in some setups, but here 
    // orders depends on products, NOT vice versa, so it should be fine.
    // Ideally, logic orchestrating both should be in a controller or the component, 
    // but for this assignment, we'll put the sync logic here or expose a composed action.
    // Actually, 'useModel' hooks are component-level, so calling useModel inside another useModel 
    // works if they are providing context. However, often it's safer to pass helpers.
    // Let's rely on the components to call both product.updateStock and order.updateStatus 
    // OR we try to access it here. Let's try access here for cleaner component code if Umi supports it.
    // If Umi version < 3.5 or specific setup, useModel inside model might fail.
    // Safe approach: define pure state logic here, and components orchestrate.

    // Persist
    useEffect(() => {
        setLocalStorage(APP_ORDERS_KEY, orders);
    }, [orders]);

    const createOrder = useCallback((order: Order) => {
        setOrders((prev) => [order, ...prev]);
    }, []);

    const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
        setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }, []);

    return {
        orders,
        createOrder,
        updateOrderStatus,
    };
}
