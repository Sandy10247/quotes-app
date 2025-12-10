import axios from "axios";

const getBaseUrl = (env: string | undefined) => {
    if (env === "production") {
        return window.location.href
    }
    return "http://localhost:8080/"
}

// Create an axios instance with default configuration
export const axiosInstance = axios.create({
    baseURL: getBaseUrl(process.env.NODE_ENV) + 'api',
    timeout: 5 * 1000,
});


// interceptor to check and add Auth header for all requests
axiosInstance.interceptors.request.use(
    function (config) {
        // Add an authorization token to the request header
        const token = getAuthToken();
        if (token && token !== "EMPTY") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        console.log("error :- ", error)
        // Handle request errors
        return Promise.reject(error);
    }
);

// Function to set the Authorization header for axios instance and local storage
export const setAuthToken = (token: string | null): void => {
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.setItem('authToken', "EMPTY");
    }
};

// Get Auth Token from Local Storage
export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};
