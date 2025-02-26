//index.js
import React, { useRef, useEffect } from "react";
import { PageHeader } from "./components/PageHeader";
import { TimeframeInputs } from "./components/TimeframeInputs";
import { TimeIntervalInputs } from "./components/TimeIntervalInputs";
import { ContractDetails } from "./components/ContractDetails";
import { FunctionArguments } from "./components/FunctionArguments";
import { EstimatedFeeModal } from "./components/EstimatedFeeModal";
import { useTimeManagement } from "./hooks/useTimeManagement";
import { useContractInteraction } from "./hooks/useContractInteraction";
import { useStakeRegistry } from "./hooks/useStakeRegistry";
import { useJobCreation } from "./hooks/useJobCreation";
import Modal from "react-modal";
// import { toast } from 'react-toastify';
// import { ethers } from 'ethers';
// import axios from 'axios';

if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

function CreateJobPage() {
  // Custom hooks
  const {
    timeframe,
    timeframeInSeconds,
    timeInterval,
    intervalInSeconds,
    handleTimeframeChange,
    handleTimeIntervalChange,
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
    handleInputChange,
    argumentType,
    handleArgumentTypeChange,
  } = useContractInteraction();

  const { stakeRegistryAddress, stakeRegistryImplAddress, stakeRegistryABI } =
    useStakeRegistry();

  const {
    jobType,
    estimatedFee,
    userBalance,
    isModalOpen,
    ethAmount,
    code_url,
    setJobType,
    setIsModalOpen,
    handleCodeUrlChange,
    estimateFee,
    handleSubmit,
    scriptFunction,
    handleScriptFunctionChange,
  } = useJobCreation();

  // Logo animation
  const logoRef = useRef(null);
  useEffect(() => {
    const logo = logoRef.current;
    if (logo) {
      logo.style.transform = "rotateY(0deg)";
      logo.style.transition = "transform 1s ease-in-out";

      const rotateLogo = () => {
        logo.style.transform = "rotateY(360deg)";
        setTimeout(() => {
          logo.style.transform = "rotateY(0deg)";
        }, 1000);
      };

      const interval = setInterval(rotateLogo, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log("Estimating fee with params:", {
      contractAddress,
      hasABI: !!contractABI,
      targetFunction,
      argsArray,
      timeframeInSeconds,
      intervalInSeconds,
    });

    // First estimate the fee
    await estimateFee(
      contractAddress,
      contractABI,
      targetFunction,
      argsArray,
      timeframeInSeconds,
      intervalInSeconds
    );

    // handleSubmit will be called later through the modal's onStake
  };

  return (
    <div className="min-h-screen  text-white  mt-[20rem]">
      {/* Background gradients */}
      <div className="fixed inset-0  pointer-events-none" />
      <div className="fixed top-0 left-1/2 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Panels*/}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#141414]  rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
                About Keeper Network
              </h3>
              <h4 className="text-[#A2A2A2] leading-relaxed text-md">
                Keeper Network is an innovative decentralized network of nodes
                that automate smart contract executions and maintenance tasks on
                various blockchain networks. It ensures that critical operations
                are performed reliably and on time.
              </h4>
            </div>

            <div className="bg-[#141414]  backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="relative font-semibold">
                <h1 className="text-2xl relative  pb-5">
                  Why Choose
                  <span className="relative text-[#C07AF6] py-2 px-4 ml-3 font-bold">
                    TriggerX ?{/* Decorative Elements */}
                    <div className="absolute inset-0 border-2 border-transparent pointer-events-none">
                      {/* Top Left Corner */}
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#C07AF6] rounded-tl-md"></div>
                      {/* Bottom Right Corner */}
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#C07AF6] rounded-br-md"></div>
                    </div>
                  </span>
                </h1>
              </div>
              <ul className="space-y-3 text-[#A2A2A2]">
                {[
                  "Advanced cross-chain automation",
                  "Seamless integration with Ethereum network",
                  "User-friendly interface",
                  "Reliable and secure execution",
                  "Customizable parameters",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form Section - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-[#141414]  backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Job Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10  rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                    required
                  >
                    <option value="0">Select job type</option>
                    <option value="1">Time-based</option>
                    <option value="2" disabled>
                      Event-based
                    </option>
                    <option value="3" disabled>
                      Condition-based
                    </option>
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
                  argumentType={argumentType}
                  onArgumentTypeChange={handleArgumentTypeChange}
                />

                {/* Function Arguments */}
                <FunctionArguments
                  selectedFunction={selectedFunction}
                  functionInputs={functionInputs}
                  onInputChange={handleInputChange}
                  argumentType={argumentType}
                />

                {/* Code URL Input */}
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="code_url"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Code URL (or IPFS CID)
                    </label>
                    <input
                      id="code_url"
                      value={code_url}
                      onChange={(e) => {
                        handleCodeUrlChange(e);
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none "
                      placeholder="Enter IPFS URL or CID (e.g., ipfs://... or https://ipfs.io/ipfs/...)"
                    />
                    <h4 className="mt-2 text-sm text-gray-400">
                      Provide an IPFS URL or CIDwhere your code is stored.
                    </h4>
                  </div>
                </div>

                {/* Script Function Input */}
                <div>
                  <label
                    htmlFor="script_function"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Script Function Name
                  </label>
                  <input
                    id="script_function"
                    value={scriptFunction}
                    onChange={handleScriptFunctionChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none "
                    placeholder="Enter the script function name"
                  />
                  <h4 className="mt-2 text-sm text-gray-400">
                    Provide the name of the function to be executed in your
                    script
                  </h4>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className=" liquid-button2  px-8 py-4 bg-white rounded-lg text-lg font-semibold  transition-all duration-300 flex items-center justify-center gap-2 text-black"
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
        onClose={() => {
          console.log("Closing fee modal");
          setIsModalOpen(false);
        }}
        estimatedFee={estimatedFee}
        onStake={() => {
          console.log("Initiating stake with params:", {
            stakeRegistryImplAddress,
            hasABI: !!stakeRegistryABI,
            contractAddress,
            targetFunction,
            argsArray,
            timeframeInSeconds,
            intervalInSeconds,
          });
          handleSubmit(
            stakeRegistryAddress,
            stakeRegistryABI,
            contractAddress,
            targetFunction,
            argsArray,
            timeframeInSeconds,
            intervalInSeconds
          );
        }}
        userBalance={userBalance}
      />
    </div>
  );
}

export default CreateJobPage;
