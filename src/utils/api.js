/**
 * Utility functions for API calls that handle server down scenarios
 */

// Setting a timeout to detect unresponsive server
const TIMEOUT_DURATION = 15000; // 15 seconds

/**
 * Performs a fetch request with timeout handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response data or error
 */
export const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const { signal } = controller;

    // Create timeout that aborts the fetch
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    try {
        const response = await fetch(url, {
            ...options,
            signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            // Handle HTTP errors like 404, 500, etc.
            if (response.status >= 500) {
                throw new Error('server_down');
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('server_down');
        }

        if (error.message === 'server_down') {
            throw error;
        }

        if (error.message && error.message.includes('Failed to fetch')) {
            throw new Error('server_down');
        }

        throw error;
    }
};

/**
 * Handles API errors including server down scenarios
 * @param {Error} error - Error object from try/catch
 * @param {Function} setServerDown - Function from ErrorContext to set server down state
 * @returns {Object} - Error information
 */
export const handleApiError = (error, setServerDown) => {
    if (error.message === 'server_down') {
        setServerDown("The server is currently unavailable. Please try again later.");
        return { success: false, message: "Server is down" };
    }

    return { success: false, message: error.message || "An unknown error occurred" };
}; 