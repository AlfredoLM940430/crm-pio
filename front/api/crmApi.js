import axios from 'axios';
import getEnvVariables from '../helpers/getEnvVariables';
import { goToLogin } from '../helpers/navigate';

const { VITE_API_URL } = getEnvVariables();

const crmApi = axios.create({
    baseURL: VITE_API_URL,
});

crmApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
}, error => {
    return Promise.reject(error);
});

crmApi.interceptors.response.use(
    response => response,
    error => {
        console.log(error.response);
        if (error.response && (error.response.status === 401)) {
            localStorage.removeItem('token');
            goToLogin()
        }

        return Promise.reject(error);
    }
);

export default crmApi;