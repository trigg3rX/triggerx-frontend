// src/components/TransactionModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import { FiInfo } from "react-icons/fi";

const TransactionModal = ({ isOpen, onClose, onConfirm, modalType, modalData }) => {
    const [showAmountTooltip, setShowAmountTooltip] = useState(false);

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Estimate Fee"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-4 sm:p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-[95%] sm:w-full max-w-md z-[10000]"
            overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Transaction request</h2>

            <div className="space-y-4 sm:space-y-6">
                <div className="bg-[#1E1E1E] p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-sm sm:text-base">Interacting with</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px]">{modalData.contractAddress}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1E1E1E] p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <div className="flex items-center">
                            <span className="text-sm sm:text-base">Required ETH</span>
                            <div className="relative top-[4px]">
                                <FiInfo
                                    className="text-gray-400 hover:text-white cursor-pointer ml-2"
                                    size={15}
                                    onMouseEnter={() => setShowAmountTooltip(true)}
                                    onMouseLeave={() => setShowAmountTooltip(false)}
                                />
                                {showAmountTooltip && (
                                    <div className="absolute left-8 top-2 mt-2 p-3 sm:p-4 bg-[#181818] rounded-xl border border-[#4B4A4A] shadow-lg z-50 w-[240px] sm:w-[280px]">
                                        <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    Extra ETH held in the contract, will be used automatically to top up the address if its balance falls below the set minimum.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="text-white font-medium text-sm sm:text-base">{modalData.amount} ETH</span>
                    </div>

                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <div className="flex text-sm sm:text-base">Network Fee</div>
                        <span className="text-gray-300 text-sm sm:text-base">{modalData.networkFee}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base">Speed</span>
                        <div className="flex items-center">
                            <div className="text-orange-400 mr-2 text-sm sm:text-base">
                                <span className="mr-1">🦊</span>
                                <span>Market</span>
                            </div>
                            <span className="text-sm sm:text-base">~{modalData.speed}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1E1E1E] p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between rt items-start gap-3 flex-col justify-start sm:justify-between">
                        <span className="text-sm sm:text-base">Method: </span>
                        <span className="text-gray-300 text-sm sm:text-base">{modalData.contractMethod}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 sm:mt-8 flex justify-between gap-3 sm:gap-5">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 bg-white text-black text-sm sm:text-base"
                >
                    Confirm
                </button>
            </div>
        </Modal>
    );
};

export default TransactionModal;