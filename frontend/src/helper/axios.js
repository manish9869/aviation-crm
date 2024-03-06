import axios from "axios";

// Create an instance of axios
const axiosInstance = axios.create();

// Add request interceptor to modify outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here, such as adding headers
    // For example, add an authorization header if needed
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here or handle global success actions
    return response;
  },
  (error) => {
    // You can handle response errors globally
    return Promise.reject(error);
  }
);

export default axiosInstance;
