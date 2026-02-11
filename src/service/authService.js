import axios from "axios";

// Use Vite environment variable
const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const login = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data);
        return response;
    } catch (error) {
        throw error;
    }
};
