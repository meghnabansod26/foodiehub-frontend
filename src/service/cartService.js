import axios from "axios";

// Base API URL from Vite environment
const BASE_URL = import.meta.env.VITE_API_URL;

export const addToCart = async (foodId, token) => {
    try {
        await axios.post(
            `${BASE_URL}/cart`,
            { foodId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error("Error while adding the cart data", error);
    }
};

export const removeQtyFromCart = async (foodId, token) => {
    try {
        await axios.post(
            `${BASE_URL}/cart/remove`,
            { foodId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error("Error while removing qty from cart", error);
    }
};

export const getCartData = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.items;
    } catch (error) {
        console.error("Error while fetching the cart data", error);
    }
};

export const clearCartItems = async (token, setQuantities) => {
    try {
        await axios.delete(`${BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setQuantities({});
    } catch (error) {
        console.error("Error while clearing the cart", error);
        throw error;
    }
};
