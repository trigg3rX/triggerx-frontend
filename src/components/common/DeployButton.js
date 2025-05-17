// src/components/common/DeployButton.js
import React from 'react';

const DeployButton = ({ onClick, isLoading }) => {
    return (
        <button
            onClick={onClick}
            className="bg-[#C07AF6] text-white px-8 py-3 my-5 rounded-full transition-all text-lg flex items-center hover:bg-[#B15AE6] hover:shadow-md hover:shadow-[#C07AF6]/20 hover:-translate-y-0.5"

            disabled={isLoading}
        >
            {isLoading ? 'Deploying...' : '🛠️ Deploy Contract'}
        </button>
    );
};

export default DeployButton;