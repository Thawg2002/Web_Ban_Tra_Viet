import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000,
    headers: { "X-Custom-Header": "foobar" },
});
const refreshToken = async () => {
    const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
        {},
        {
            withCredentials: true,
        },
    );
    return response?.data?.accessToken;
};

instance.interceptors.request.use(
    async function (config) {
        config.withCredentials = true;
        return config;
    },
    function (error) {
        console.log("error", error);

        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // If error is 401 and it's not a retry, attempt to refresh the token
        console.log(error);
        if (error.response.status === 401) {
            originalRequest._retry = true;
            try {
                const { data } = await refreshToken();
                instance.defaults.headers.common["Authorization"] =
                    `Bearer ${data?.accessToken}`;
                originalRequest.headers["Authorization"] =
                    `Bearer ${data?.accessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure, possibly logging out the user
                console.error("Refresh token failed", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);
// Gán accessToken từ localStorage vào header Authorization trong mỗi request
//
export default instance;
