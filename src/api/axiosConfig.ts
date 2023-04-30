import axios from 'axios';

const controller = new AbortController();
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const AuthService = {
    getUserInfo: () => {
        return JSON.parse(localStorage.getItem('user') || '{}');
    },
    getAccessToken: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.accessToken;
    },
    getRefreshToken: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.refreshToken;
    },
};

const axiosConfig = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    timeout: 30000,
    cancelToken: source.token,
    signal: controller.signal,
});

// Add a request interceptor
axiosConfig.interceptors.request.use(
    (config: any) => {
        const userAccessToken = AuthService.getAccessToken();
        if (userAccessToken && config.headers) {
            config.headers['Authorization'] = `Bearer ${userAccessToken}`;
        }
        if (config.headers) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Add a response interceptor
axiosConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (!window.navigator.onLine) {
            window.location.reload();
            return;
        }
        if (error?.response?.status === 403) {
            controller.abort();
            try {
                const response = await axios.post(
                    '/refresh-token',
                    {
                        refreshToken: AuthService.getRefreshToken(),
                    },
                    {
                        headers: {
                            Authorization:
                                'Bearer ' + AuthService.getAccessToken(),
                        },
                        baseURL: process.env.REACT_APP_SERVER_URL,
                        timeout: 30000,
                    },
                );
                localStorage.removeItem('user');
                localStorage.setItem(
                    'user',
                    JSON.stringify(response.data.data),
                );
                window.location.reload();
            } catch (error) {
                window.localStorage.removeItem('user');
                window.location.replace('/');
            }
        } else if (error?.response?.status === 401) {
            window.location.replace('/sign-in');
        } else return Promise.reject(error);
    },
);

export default axiosConfig;
