export function ContractDetails({ 
  contractAddress, 
  contractABI, 
  targetFunction,
  functions,
  onContractAddressChange,
  onContractABIChange,
  onFunctionChange 
}) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-300 mb-2">Contract Address</label>
        <input
          type="text"
          id="contractAddress"
          value={contractAddress}
          onChange={onContractAddressChange}
          placeholder="Your op-sepolia contract address"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
          required
        />
      </div>

      <div>
        <label htmlFor="contractABI" className="block text-sm font-medium text-gray-300 mb-2">Contract ABI</label>
        <textarea
          id="contractABI"
          value={contractABI}
          onChange={onContractABIChange}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="targetFunction" className="block text-sm font-medium text-gray-300 mb-2">Target Function</label>
        <select
          id="targetFunction"
          value={targetFunction}
          onChange={onFunctionChange}
          className="w-full bg-[#1A1F2C] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all duration-300"
          required
        >
          <option value="" className="bg-[#1A1F2C] text-white">Select a function</option>
          {functions.map((func, index) => {
            const signature = `${func.name}(${func.inputs.map(input => input.type).join(',')})`;
            return (
              <option key={index} value={signature} className="bg-[#1A1F2C] text-white">
                {signature}
              </option>
            );
          })}
        </select>
        {functions.length === 0 && contractAddress && (
          <p className="mt-2 text-sm text-yellow-400">
            No writable functions found. Make sure the contract is verified on Blockscout / Etherscan.
          </p>
        )}
      </div>
    </div>
  );
} 