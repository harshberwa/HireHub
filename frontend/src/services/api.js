import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:5000/api", // backend base URL
});

// Request Interceptor (Token Attach)
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
	},
);

// Response Interceptor (Error Handling)
API.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Token expired or invalid
			localStorage.removeItem("token");
			localStorage.removeItem("user");

			window.location.href = "/login";
		}

		return Promise.reject(error);
	},
);

export default API;
