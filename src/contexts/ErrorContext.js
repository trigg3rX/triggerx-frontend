import React, { createContext, useState, useContext, useEffect } from "react";

const ErrorContext = createContext();

export function useError() {
    return useContext(ErrorContext);
}

export function ErrorProvider({ children }) {
    const [serverError, setServerError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const setServerDown = (message = "Server is currently unavailable. Please try again later.") => {
        setServerError(true);
        setErrorMessage(message);
    };

    const clearError = () => {
        setServerError(false);
        setErrorMessage("");
    };

    // Value object that will be provided to consumers
    const value = {
        serverError,
        errorMessage,
        setServerDown,
        clearError
    };

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
} 