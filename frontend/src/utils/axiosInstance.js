import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('access')
            ? 'Bearer ' + localStorage.getItem('access')
            : null,
        'Content-Type': 'application/json',
        'accept': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async function (error) {
        const originalRequest = error.config;

        if (typeof error.response === 'undefined') {
            console.log(
                'A server/network error occurred. ' +
                'Looks like CORS might be the problem. ' +
                'Sorry about this - we will get it fixed shortly.'
            );
            return Promise.reject(error);
        }

        if (
            error.response.status === 401 &&
            originalRequest.url ===
                'http://localhost:8000/api/token/refresh/'
        ) {
            window.location.href = '/login/';
            return Promise.reject(error);
        }

        if (
            error.response.data.code === 'token_not_valid' &&
            error.response.status === 401 &&
            error.response.statusText === 'Unauthorized'
        ) {
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                const now = Math.ceil(Date.now() / 1000);
                console.log(tokenParts.exp);

                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken })
                        .then((response) => {
                            localStorage.setItem('access', response.data.access);
                            axiosInstance.defaults.headers['Authorization'] =
                                'Bearer ' + response.data.access;
                            originalRequest.headers['Authorization'] =
                                'Bearer ' + response.data.access;

                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log('Refresh token is expired', tokenParts.exp, now);
                    window.location.href = '/login/';
                }
            } else {
                console.log('Refresh token not available.');
                window.location.href = '/login/';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
