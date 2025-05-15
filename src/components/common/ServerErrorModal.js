import React from "react";
import Modal from "react-modal";
import { useError } from "../../contexts/ErrorContext";

// Set the app element for accessibility
if (typeof window !== 'undefined') {
    Modal.setAppElement('#root');
}

const ServerErrorModal = () => {
    const { serverError, errorMessage, clearError } = useError();

    // Custom styles for the modal
    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#0a0a0a',
            borderRadius: '0.5rem',
            border: '1px solid white',
            padding: '1.5rem',
            maxWidth: '28rem',
            width: '90%'
        }
    };

    return (
        <Modal
            isOpen={serverError}
            onRequestClose={clearError}
            style={customStyles}
            contentLabel="Server Error Modal"
        >
            <div className="flex flex-col items-center">
                <div className="text-red-500 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Server Error</h3>
                <p className="text-gray-300 text-center mb-6">{errorMessage}</p>
                <button
                    onClick={clearError}
                    className="bg-[#F8FF7C] hover:bg-opacity-90 text-black font-medium py-2 px-6 rounded-full"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default ServerErrorModal; 