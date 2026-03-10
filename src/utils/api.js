import axios from 'axios';

export const baseURL = import.meta.env.VITE_API_URL || 'https://blockmate.onrender.com/api/v1';

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

// Smart Interceptor to help the user "fix it"
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLocalhostFallback = baseURL.includes('localhost');
        const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

        if (!error.response && isLocalhostFallback && isProduction) {
            console.error("BLOCKMATE DEPLOYMENT ERROR: Your frontend is live but trying to talk to localhost.");
            error.message = "Network Error: Application misconfigured. Reverting to smart fallback...";
        }
        return Promise.reject(error);
    }
);

export default api;
