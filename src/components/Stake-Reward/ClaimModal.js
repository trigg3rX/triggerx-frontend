import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const ClaimModal = ({
  isOpen,
  onClose,
  onConfirm,
  address,
  claimAmount,
  networkName,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const confettiCanvasRef = React.useRef(null);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setIsSuccess(false);
      setCopied(false);
    }
  }, [isOpen]);

  // Function to play confetti inside modal
  const playModalConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const myConfetti = confetti.create(canvas, { resize: true });

    // Create a 3-second animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      // Release confetti from random positions
      myConfetti({
        particleCount: 30,
        spread: 100,
        origin: { y: 0.6, x: Math.random() },
        colors: ["#FFD700", "#FFA500", "#F8FF7C"],
        shapes: ["circle"],
        scalar: 1.2,
      });
    }, 250);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsLoading(false);
      setIsSuccess(true);
      playModalConfetti();

      // Close modal with a delay after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 4000);
    } catch (error) {
      setIsLoading(false);
      console.error("Claim error in modal:", error);
    }
  };

  // Function to truncate address
  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 7)}...${addr.substring(addr.length - 15)}`;
  };

  // Function to copy address and update icon
  const copyAddressToClipboard = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.success("Address copied to clipboard!");
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Failed to copy address"));
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={!isLoading ? onClose : undefined}
      contentLabel="Claim ETH"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md z-[10000] overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
    >
      {/* Confetti canvas overlay */}
      <canvas
        ref={confettiCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center h-full py-8 z-20 relative">
          <div className="text-3xl font-bold mb-6 text-white">Woohoo!</div>
          <div className="text-xl text-[#F8FF7C] font-bold mb-6">
            You claimed successfully!
          </div>
          <div className="text-lg mb-6">
            <span className="text-green-400 font-bold">{claimAmount} ETH</span>{" "}
            has been added to your wallet
          </div>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg bg-white text-black font-semibold transition-all duration-300 hover:bg-gray-100 mt-4"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 z-20 relative">Claim ETH</h2>

          <div className="space-y-6 z-20 relative">
            <div className="bg-[#1E1E1E] p-4 rounded-lg">
              <div className="mb-4">
                <span className="text-gray-400">Network</span>
                <div className="mt-1 text-white font-medium">{networkName}</div>
              </div>

              <div className="mb-4">
                <span className="text-gray-400">Your Address</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-white font-medium">
                    {truncateAddress(address)}
                  </span>
                  <button
                    onClick={copyAddressToClipboard}
                    className="text-white bg-[#303030] hover:bg-[#404040] p-1 rounded-md"
                    title="Copy address"
                  >
                    {copied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-gray-400">Claim Amount</span>
                <div className="mt-1 text-[#F8FF7C] font-bold text-xl">
                  {claimAmount} ETH
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between gap-5">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-white text-black ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Claiming...
                </span>
              ) : (
                "Claim"
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ClaimModal;
