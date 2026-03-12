import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// If VITE_API_URL is not set, we default to localhost in dev and a placeholder in prod
// The user MUST set VITE_API_URL in Netlify's environment variables
export const baseURL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:8000/api/v1' : '/api/v1');

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 10000 // 10 second timeout to prevent "stuck" buttons
});

// Smart Interceptor to help the user "fix it"
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLocalhostFallback = baseURL.includes('localhost');
        const isProduction = !isLocalhost;

        if (!error.response && isLocalhostFallback && isProduction) {
            console.error("BLOCKMATE DEPLOYMENT ERROR: Your frontend is live but trying to talk to localhost.");
            error.message = "Network Error: Application misconfigured. Check VITE_API_URL.";
        }

        if (error.code === 'ECONNABORTED') {
            error.message = "Request timed out. Please check if the server is running.";
        }

        return Promise.reject(error);
    }
);

export default api;

