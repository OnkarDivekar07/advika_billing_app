// import axios from "axios";

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL, // http://localhost:5000
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // http://localhost:5000
});

// Automatically attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: handle expired token globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;