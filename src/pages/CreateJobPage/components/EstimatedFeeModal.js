import Modal from "react-modal";

export function EstimatedFeeModal({
  isOpen,
  onClose,
  estimatedFee,
  userBalance,
  onStake,
}) {
  const hasEnoughBalance = userBalance >= estimatedFee;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Estimate Fee"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md z-[10000]"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
    >
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
        Estimated Fee
      </h2>
      <div className="space-y-4 mb-6">
        <p className="text-gray-300">
          {estimatedFee && estimatedFee > 0 ? `Required TG: ${estimatedFee.toFixed(6)} TG` : "Something went wrong"}
        </p>

        <p className="text-gray-300">Your TG Balance: {userBalance} TG</p>
        {!hasEnoughBalance && (
          <p className="text-gray-300">
            Required ETH to stake: {(0.001 * estimatedFee).toFixed(6)} ETH
          </p>
        )}
      </div>
      <div className="flex gap-4">
        {hasEnoughBalance ? (
          <button
            onClick={onStake}
            disabled={!estimatedFee || estimatedFee <= 0} // Disable if fee is invalid
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${!estimatedFee || estimatedFee <= 0
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"  // Disabled styles
                : "bg-white text-black"  // Enabled styles
              }`}
          >
            Next
          </button>

        ) : (
          <button
            onClick={onStake}
            className="flex-1 px-6 py-3 bg-white rounded-lg font-semibold text-black transition-all duration-300"
          >
            Stake ETH
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
