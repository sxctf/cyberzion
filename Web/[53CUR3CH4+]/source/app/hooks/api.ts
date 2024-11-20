import axios from 'axios';
import config from '../../config.json';

const api = axios.create({
    baseURL: config.api_url,
    timeout: 30000,
    withCredentials: true
});

api.interceptors.response.use(
    response => response,
    error => Promise.resolve({ error })
);

export const useAPI = () => api;
