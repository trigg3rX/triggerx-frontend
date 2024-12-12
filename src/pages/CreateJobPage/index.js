import React, { useRef, useEffect } from 'react';
import { PageHeader } from './components/PageHeader';
import { TimeframeInputs } from './components/TimeframeInputs';
import { TimeIntervalInputs } from './components/TimeIntervalInputs';
import { ContractDetails } from './components/ContractDetails';
import { FunctionArguments } from './components/FunctionArguments';
import { EstimatedFeeModal } from './components/EstimatedFeeModal';
import { useTimeManagement } from './hooks/useTimeManagement';
import { useContractInteraction } from './hooks/useContractInteraction';
import { useStakeRegistry } from './hooks/useStakeRegistry';
import { useJobCreation } from './hooks/useJobCreation';

function CreateJobPage() {
  // Custom hooks
  const {
    timeframe,
    timeframeInSeconds,
    timeInterval,
    intervalInSeconds,
    handleTimeframeChange,
    handleTimeIntervalChange
  } = useTimeManagement();

  const {
    contractAddress,
    contractABI,
    functions,
    targetFunction,
    selectedFunction,
    functionInputs,
    argumentsInBytes,
    argsArray,
    handleContractAddressChange,
    handleFunctionChange,
    handleInputChange
  } = useContractInteraction();

  const {
    stakeRegistryAddress,
    stakeRegistryImplAddress,
    stakeRegistryABI
  } = useStakeRegistry();

  const {
    jobType,
    estimatedFee,
    isModalOpen,
    ethAmount,
    code_url,
    setJobType,
    setIsModalOpen,
    handleCodeUrlChange,
    estimateFee,
    handleSubmit
  } = useJobCreation();

  // Logo animation
  const logoRef = useRef(null);
  useEffect(() => {
    const logo = logoRef.current;
    if (logo) {
      logo.style.transform = 'rotateY(0deg)';
      logo.style.transition = 'transform 1s ease-in-out';

      const rotateLogo = () => {
        logo.style.transform = 'rotateY(360deg)';
        setTimeout(() => {
          logo.style.transform = 'rotateY(0deg)';
        }, 1000);
      };

      const interval = setInterval(rotateLogo, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(
      stakeRegistryImplAddress,
      stakeRegistryABI,
      contractAddress,
      targetFunction,
      argsArray,
      timeframeInSeconds,
      intervalInSeconds
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white pt-32 pb-20">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Panels*/}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                About Keeper Network
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Keeper Network is an innovative decentralized network of nodes that automate smart contract executions and maintenance tasks on various blockchain networks. It ensures that critical operations are performed reliably and on time.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose TriggerX?
              </h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  "Advanced cross-chain automation",
                  "Seamless integration with Ethereum network",
                  "User-friendly interface",
                  "Reliable and secure execution",
                  "Customizable parameters"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form Section - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Job Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                    required
                  >
                    <option value="">Select job type</option>
                    <option value="Time">Time-based</option>
                    <option value="Event">Event-based</option>
                  </select>
                </div>

                {/* Time Management */}
                <TimeframeInputs 
                  timeframe={timeframe} 
                  onTimeframeChange={handleTimeframeChange} 
                />
                
                <TimeIntervalInputs 
                  timeInterval={timeInterval} 
                  onTimeIntervalChange={handleTimeIntervalChange} 
                />

                {/* Contract Details */}
                <ContractDetails 
                  contractAddress={contractAddress}
                  contractABI={contractABI}
                  targetFunction={targetFunction}
                  functions={functions}
                  onContractAddressChange={handleContractAddressChange}
                  onFunctionChange={handleFunctionChange}
                />

                {/* Function Arguments */}
                <FunctionArguments 
                  selectedFunction={selectedFunction}
                  functionInputs={functionInputs}
                  onInputChange={handleInputChange}
                />

                {/* Code URL Input */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="code_url" className="block text-sm font-medium text-gray-300 mb-2">
                      Code URL (IPFS)
                    </label>
                    <input
                      id="code_url"
                      value={code_url}
                      onChange={handleCodeUrlChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                      placeholder="Enter IPFS URL to your code (e.g., ipfs://... or https://ipfs.io/ipfs/...)"
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      Provide an IPFS URL where your code is stored. Make sure the code follows the selected language's syntax.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Create Job
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Fee Modal */}
      <EstimatedFeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        estimatedFee={estimatedFee}
        onStake={() => handleSubmit(
          stakeRegistryImplAddress,
          stakeRegistryABI,
          contractAddress,
          targetFunction,
          argsArray,
          timeframeInSeconds,
          intervalInSeconds
        )}
      />
    </div>
  );
}

export default CreateJobPage;