import Modal from "react-modal";
import { FiInfo } from "react-icons/fi";
import React, { useState, useRef, useEffect } from "react";
import { Tooltip } from 'antd';
import { useBalance, useAccount } from 'wagmi';



export function EstimatedFeeModal({
  isOpen,
  onClose,
  estimatedFee,
  userBalance,
  onStake,
}) {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({
    address,
  });

  const hasEnoughBalance = userBalance >= estimatedFee;
  const requiredEth = (0.001 * estimatedFee).toFixed(6);
  const hasEnoughEthToStake = ethBalance && Number(ethBalance.formatted) >= Number(requiredEth);
  const [showRequiredTGTooltip, setShowRequiredTGTooltip] = useState(false);
  const [showBalanceTooltip, setShowBalanceTooltip] = useState(false);
  const [showStakeTooltip, setShowStakeTooltip] = useState(false);

  


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Estimate Fee"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md z-[10000]"
  overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"

    >
      <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white text-center">
        Estimated Fee
      </h2>
      <div className="space-y-4 mb-6">
      <div className="text-gray-300 flex justify-between">
      <p className="flex">Required TG
      <div className="relative top-[4px]">
            <FiInfo
              className="text-gray-400 hover:text-white cursor-pointer ml-2"
              size={15}
              onMouseEnter={() => setShowRequiredTGTooltip(true)}
              onMouseLeave={() => setShowRequiredTGTooltip(false)}
            />
        {showRequiredTGTooltip && (
              <div className="absolute right-0 mt-2 p-4 bg-[#181818] rounded-xl border border-[#4B4A4A] shadow-lg z-50 w-[280px]">
                <div className="flex flex-col gap-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <span>TriggerGas (TG) is the standard unit for calculating computational and resource costs in the TriggerX platform.</span>
                  </div>
                 
                </div>
              </div>
            )}
          </div>
          </p>
          <p> {estimatedFee && estimatedFee > 0 ? ` ${estimatedFee.toFixed(4)} TG` : "Something went wrong"}</p>
         
           
        </div>

        <div className="text-gray-300 flex justify-between">
      <p className="flex">Your TG Balance
     
          </p>
          <Tooltip title={userBalance || '0'} placement="top">
    <p className="cursor-help">{userBalance ? Number(userBalance).toFixed(6) : '0.0000'} </p>
  </Tooltip>
        </div>
      
       
        {!hasEnoughBalance && (
           <div className="text-gray-300 flex justify-between">
           <p className="flex">  Required ETH to stake
           <div className="relative top-[4px]">
                 <FiInfo
                   className="text-gray-400 hover:text-white cursor-pointer ml-2"
                   size={15}
                   onMouseEnter={() => setShowStakeTooltip(true)}
                   onMouseLeave={() => setShowStakeTooltip(false)}
                 />
                 {showStakeTooltip && (
                   <div className="absolute right-0 mt-2 p-4 bg-[#181818] rounded-xl border border-[#4B4A4A] shadow-lg z-50 w-[280px]">
                     <div className="flex flex-col gap-2 text-sm text-gray-300">
                       <div className="flex items-center gap-2">
                         <span>Required ETH to Stake is based on the total TriggerGas consumed and TriggerGas's unit price.</span>
                       </div>
                       
                     </div>
                   </div>
                 )}
               </div>
               </p>
             <p> {(0.001 * estimatedFee).toFixed(6)} ETH </p>
             </div>
        )}
      </div>
      <div className="flex gap-4">
        {hasEnoughBalance ? (
          <button
          onClick={onStake}
          // disabled={!estimatedFee || estimatedFee <= 0} // Disable if fee is invalid
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${!estimatedFee || estimatedFee <= 0
              ? "bg-gray-400 text-gray-700 "  // Disabled styles
              : "bg-white text-black"  // Enabled styles
            }`}
        >
          Next
        </button>
        ) : (
          <button
    onClick={onStake}
    disabled={!hasEnoughEthToStake}
    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
      !hasEnoughEthToStake
        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
        : "bg-white text-black"
    }`}
  >
    {hasEnoughEthToStake ? "Stake ETH" : "Insufficient ETH"}
  </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
