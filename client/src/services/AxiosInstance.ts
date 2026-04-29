import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost/DalivaSibugUcag/server/public/api";
const AxiosInstance = axios.create({ baseURL });

AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    } else {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status !== 422) {
            console.error("Unexpected response error:", error);
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;