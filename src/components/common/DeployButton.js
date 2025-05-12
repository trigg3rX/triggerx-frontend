// src/components/common/DeployButton.js
import React from 'react';

const DeployButton = ({ onClick, isLoading }) => {
    return (
        <button
            onClick={onClick}
            className="bg-[#C07AF6] text-white px-8 py-3 rounded-lg transition-colors text-lg hover:bg-[#B15AE6]"
            disabled={isLoading}
        >
            {isLoading ? 'Deploying...' : '🛠️ Deploy Contract'}
        </button>
    );
};

export default DeployButton;