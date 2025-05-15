import { useCallback } from 'react';
import { fetchWithTimeout, handleApiError } from '../utils/api';
import { useError } from '../contexts/ErrorContext';

/**
 * Custom hook for making API calls with server down handling
 */
const useApi = () => {
    const { setServerDown } = useError();

    /**
     * Performs a GET request with error handling
     * @param {string} url - API endpoint
     * @param {Object} options - Additional fetch options
     * @returns {Promise} - API response or error
     */
    const get = useCallback(async (url, options = {}) => {
        try {
            return await fetchWithTimeout(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
        } catch (error) {
            return handleApiError(error, setServerDown);
        }
    }, [setServerDown]);

    /**
     * Performs a POST request with error handling
     * @param {string} url - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} options - Additional fetch options
     * @returns {Promise} - API response or error
     */
    const post = useCallback(async (url, data, options = {}) => {
        try {
            return await fetchWithTimeout(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });
        } catch (error) {
            return handleApiError(error, setServerDown);
        }
    }, [setServerDown]);

    /**
     * Performs a PUT request with error handling
     * @param {string} url - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} options - Additional fetch options
     * @returns {Promise} - API response or error
     */
    const put = useCallback(async (url, data, options = {}) => {
        try {
            return await fetchWithTimeout(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });
        } catch (error) {
            return handleApiError(error, setServerDown);
        }
    }, [setServerDown]);

    /**
     * Performs a DELETE request with error handling
     * @param {string} url - API endpoint
     * @param {Object} options - Additional fetch options
     * @returns {Promise} - API response or error
     */
    const del = useCallback(async (url, options = {}) => {
        try {
            return await fetchWithTimeout(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
        } catch (error) {
            return handleApiError(error, setServerDown);
        }
    }, [setServerDown]);

    return {
        get,
        post,
        put,
        delete: del
    };
};

export default useApi; 