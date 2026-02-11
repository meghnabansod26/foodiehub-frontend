import axios from "axios";

// Base API URL from Vite environment
const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchFoodList = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/foods`);
        return response.data;
    } catch (error) {
        console.log("Error fetching food list", error);
        throw error;
    }
};

export const fetchFoodDetails = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/foods/${id}`);
        return response.data;
    } catch (error) {
        console.log("Error fetching food details:", error);
        throw error;
    }
};
