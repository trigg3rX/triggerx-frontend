import Modal from 'react-modal';

export function EstimatedFeeModal({ 
  isOpen, 
  onClose, 
  estimatedFee, 
  onStake 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Estimate Fee"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0A0F1C] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Estimated Fee
      </h2>
      <p className="text-gray-300 mb-6">The estimated fee for creating this job is: {estimatedFee} ETH</p>
      <div className="flex gap-4">
        <button 
          onClick={onStake} 
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          Stake
        </button>
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