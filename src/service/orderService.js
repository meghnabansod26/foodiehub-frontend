import axios from "axios";

// Base API URL from Vite environment
const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchUserOrders = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error occurred while fetching the orders", error);
        throw error;
    }
};

export const createOrder = async (orderData, token) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/orders/create`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error occurred while creating the order", error);
        throw error;
    }
};

export const verifyPayment = async (paymentData, token) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/orders/verify`,
            paymentData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.status === 200;
    } catch (error) {
        console.error("Error occurred while verifying the payment", error);
        throw error;
    }
};

export const deleteOrder = async (orderId, token) => {
    try {
        await axios.delete(`${BASE_URL}/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("Error occurred while deleting the order", error);
        throw error;
    }
};
