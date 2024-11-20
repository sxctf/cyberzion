/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// TODO: Maybe a hack
type CustomAxiosHandler = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
) => Promise<AxiosResponse<T, T> & { error?: any }>;

declare module 'axios' {
    export interface AxiosInstance {
        post: CustomAxiosHandler;
    }
}
// Hack end

const instance = axios.create();

instance.interceptors.response.use(
    response => response,
    error => Promise.resolve({ error })
);

export const useAPI = () => instance;
