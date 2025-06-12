import React from "react";

const WalletModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
          Wallet Not Detected
        </h2>
        <p className="text-gray-300 mb-4">
          Please install a web3 wallet like MetaMask to access this application.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-white rounded-lg text-black font-semibold transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WalletModal;
