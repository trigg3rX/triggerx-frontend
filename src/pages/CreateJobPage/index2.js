//index.js
import React, { useRef, useEffect, useState, useMemo } from "react";
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
import { ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

function CreateJobPage() {
  const [selectedNetwork, setSelectedNetwork] = useState("Optimism");
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [linkedJobs, setLinkedJobs] = useState([]);
  const [linkedJobNetworks, setLinkedJobNetworks] = useState([]);
  const [codeUrls, setCodeUrls] = useState({ main: "" });

  // Custom hooks
  const {
    timeframe,
    timeframeInSeconds,
    timeInterval,
    intervalInSeconds,
    handleTimeframeChange,
    handleTimeIntervalChange,
  } = useTimeManagement();

  const mainContractInteraction = useContractInteraction("main");

  // Fixed approach - create individual hooks for each possible job
  // This ensures hooks are called at the top level in a consistent order
  const job1Interaction = useContractInteraction("job-1");
  const job2Interaction = useContractInteraction("job-2");
  const job3Interaction = useContractInteraction("job-3");

  // Create the linkedContractInteractions object from the individual hooks
  const linkedContractInteractions = useMemo(() => {
    const interactions = {};
    if (linkedJobs.includes(1)) interactions[1] = job1Interaction;
    if (linkedJobs.includes(2)) interactions[2] = job2Interaction;
    if (linkedJobs.includes(3)) interactions[3] = job3Interaction;
    return interactions;
  }, [linkedJobs, job1Interaction, job2Interaction, job3Interaction]);

  // const {
  //   contractAddress,
  //   contractABI,
  //   functions,
  //   targetFunction,
  //   selectedFunction,
  //   functionInputs,
  //   // argumentsInBytes,
  //   argsArray,
  //   handleContractAddressChange,
  //   handleFunctionChange,
  //   handleInputChange,
  //   argumentType,
  //   handleArgumentTypeChange,
  // } = useContractInteraction();

  const { stakeRegistryAddress, stakeRegistryImplAddress, stakeRegistryABI } =
    useStakeRegistry();

  const {
    jobType,
    estimatedFee,
    userBalance,
    isModalOpen,
    // ethAmount,
    code_url,
    setJobType,
    setIsModalOpen,
    handleCodeUrlChange,
    estimateFee,
    handleSubmit,
    scriptFunction,
    handleScriptFunctionChange,
  } = useJobCreation();

  // trigger option
  const options = [
    { value: "1", label: "Time-based Trigger", icon: "\u23F0" },
    {
      value: "2",
      label: "Condition-based Trigger",
      icon: "⚡",
    },
    {
      value: "3",
      label: "Event-based Trigger",
      icon: "\u2737",
    },
  ];

  const networks = ["Optimism", "Base"];

  const networkIcons = {
    Optimism: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28ZM12.5021 19.1895C11.7876 19.1895 11.2022 19.0214 10.7458 18.6851C10.2955 18.3429 10.0703 17.8565 10.0703 17.2261C10.0703 17.094 10.0853 16.9318 10.1153 16.7397C10.1934 16.3074 10.3045 15.788 10.4486 15.1816C10.8569 13.5304 11.9107 12.7048 13.6099 12.7048C14.0723 12.7048 14.4866 12.7828 14.8528 12.9389C15.2191 13.089 15.5073 13.3172 15.7175 13.6234C15.9276 13.9236 16.0327 14.2839 16.0327 14.7042C16.0327 14.8303 16.0177 14.9894 15.9877 15.1816C15.8976 15.7159 15.7895 16.2353 15.6634 16.7397C15.4533 17.5623 15.09 18.1778 14.5736 18.586C14.0572 18.9883 13.3668 19.1895 12.5021 19.1895ZM12.6282 17.8925C12.9645 17.8925 13.2496 17.7935 13.4838 17.5953C13.724 17.3972 13.8951 17.094 13.9972 16.6857C14.1353 16.1212 14.2404 15.6289 14.3125 15.2086C14.3365 15.0825 14.3485 14.9534 14.3485 14.8213C14.3485 14.2749 14.0632 14.0017 13.4929 14.0017C13.1566 14.0017 12.8684 14.1007 12.6282 14.2989C12.394 14.4971 12.2259 14.8003 12.1238 15.2086C12.0158 15.6109 11.9077 16.1032 11.7996 16.6857C11.7756 16.8057 11.7636 16.9318 11.7636 17.0639C11.7636 17.6164 12.0518 17.8925 12.6282 17.8925ZM16.2939 19.0362C16.3299 19.0782 16.381 19.0993 16.447 19.0993H17.6719C17.7319 19.0993 17.789 19.0782 17.843 19.0362C17.897 18.9941 17.9301 18.9401 17.9421 18.8741L18.3564 16.9016H19.5723C20.3589 16.9016 20.9773 16.7365 21.4277 16.4063C21.884 16.076 22.1872 15.5656 22.3373 14.8751C22.3734 14.713 22.3914 14.5569 22.3914 14.4068C22.3914 13.8844 22.1872 13.4851 21.7789 13.2089C21.3766 12.9327 20.8422 12.7946 20.1757 12.7946H17.78C17.7199 12.7946 17.6629 12.8156 17.6088 12.8576C17.5548 12.8997 17.5218 12.9537 17.5098 13.0198L16.2669 18.8741C16.2549 18.9341 16.2638 18.9881 16.2939 19.0362ZM20.2928 15.4515C20.1067 15.5896 19.8875 15.6587 19.6354 15.6587H18.5996L18.9418 14.0465H20.0226C20.2688 14.0465 20.4429 14.0945 20.545 14.1906C20.6471 14.2807 20.6981 14.4128 20.6981 14.5869C20.6981 14.665 20.6891 14.755 20.6711 14.8571C20.6111 15.1153 20.485 15.3134 20.2928 15.4515Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
    Base: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.98995 14C11.3092 14 14 11.3137 14 8C14 4.6863 11.3092 2 7.98995 2C4.84104 2 2.25776 4.41765 2.0009 7.49506H10.9195V8.49416H2C2.25171 11.5767 4.83736 14 7.98995 14Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  };

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
      contractAddress: mainContractInteraction.contractAddress,
      hasABI: !!mainContractInteraction.contractABI,
      targetFunction: mainContractInteraction.targetFunction,
      argsArray: mainContractInteraction.argsArray,
      timeframeInSeconds,
      intervalInSeconds,
    });

    // First estimate the fee
    await estimateFee(
      mainContractInteraction.contractAddress,
      mainContractInteraction.contractABI,
      mainContractInteraction.targetFunction,
      mainContractInteraction.argsArray,
      timeframeInSeconds,
      intervalInSeconds
    );

    // handleSubmit will be called later through the modal's onStake
  };

  const handleLinkJob = () => {
    if (linkedJobs.length < 3) {
      const newJobId = linkedJobs.length + 1;
      setLinkedJobs([...linkedJobs, newJobId]);
      setLinkedJobNetworks((prev) => ({
        ...prev,
        [newJobId]: selectedNetwork,
      }));
      setCodeUrls((prev) => ({
        ...prev,
        [newJobId]: "",
      }));
    }
  };

  const handleSubmitWithLinkedJobs = () => {
    const mainJobData = {
      network: selectedNetwork,
      contractAddress: mainContractInteraction.contractAddress,
      contractABI: mainContractInteraction.contractABI,
      targetFunction: mainContractInteraction.targetFunction,
      argsArray: mainContractInteraction.argsArray,
      codeUrl: codeUrls.main || code_url,
    };

    const linkedJobsData = linkedJobs.map((jobId) => {
      const jobInteraction = linkedContractInteractions[jobId];
      return {
        jobId,
        network: linkedJobNetworks[jobId] || selectedNetwork,
        contractAddress: jobInteraction.contractAddress,
        contractABI: jobInteraction.contractABI,
        targetFunction: jobInteraction.targetFunction,
        argsArray: jobInteraction.argsArray,
        codeUrl: codeUrls[jobId] || "",
      };
    });

    console.log("Submitting main job:", mainJobData);
    console.log("Submitting linked jobs:", linkedJobsData);

    handleSubmit(
      stakeRegistryAddress,
      stakeRegistryABI,
      mainContractInteraction.contractAddress,
      mainContractInteraction.targetFunction,
      mainContractInteraction.argsArray,
      timeframeInSeconds,
      intervalInSeconds,
      linkedJobsData
    );
  };

  return (
    <div className="min-h-screen  text-white pt-32 pb-20">
      {/* Background gradients */}
      <div className="fixed inset-0  pointer-events-none" />
      <div className="fixed top-0 left-1/2 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader />

        <div className="w-[70%] mx-auto">
          <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* Job Type Selection */}
            <div className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 py-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8">
              <label className="block text-base font-medium text-gray-300 mb-6">
                Trigger Type
              </label>
              <div className="flex gap-4 justify-between w-[95%] mx-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (!option.disabled) {
                        setJobType(option.value);
                        setLinkedJobs([]);
                      }
                    }}
                    className="relative flex flex-col items-center justify-center w-[33%] gap-2 px-4 pb-4 pt-8 rounded-lg transition-all duration-300 bg-white/5 border border-white/10"
                  >
                    <div
                      className={`${
                        Number(option.value) === jobType ? "bg-white" : ""
                      } absolute top-2 left-2 rounded-full w-2 h-2 border`}
                    ></div>
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 py-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8">
              <div className="relative flex items-center justify-between gap-6">
                <label className="block text-base font-medium text-gray-300">
                  Network
                </label>
                <div className="relative w-[80%]">
                  <div
                    className="w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center gap-5"
                    onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                  >
                    <div className="w-6 h-6">
                      {networkIcons[selectedNetwork]}
                    </div>
                    {selectedNetwork}
                    <ChevronDown className="absolute top-3 right-4 text-white text-xs" />
                  </div>
                  {isNetworkOpen && (
                    <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                      {networks.map((network) => (
                        <div
                          key={network}
                          className="py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg flex items-center gap-5"
                          onClick={() => {
                            setSelectedNetwork(network);
                            setIsNetworkOpen(false);
                          }}
                        >
                          <div className="w-6 h-6">{networkIcons[network]}</div>
                          {network}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Time Management */}
              <TimeframeInputs
                timeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
              />

              {jobType === 1 && (
                <TimeIntervalInputs
                  timeInterval={timeInterval}
                  onTimeIntervalChange={handleTimeIntervalChange}
                />
              )}

              {(jobType === 1 || jobType === 2) && (
                <>
                  <ContractDetails
                    contractAddress={mainContractInteraction.contractAddress}
                    contractABI={mainContractInteraction.contractABI}
                    targetFunction={mainContractInteraction.targetFunction}
                    functions={mainContractInteraction.functions}
                    onContractAddressChange={
                      mainContractInteraction.handleContractAddressChange
                    }
                    onFunctionChange={
                      mainContractInteraction.handleFunctionChange
                    }
                    argumentType={mainContractInteraction.argumentType}
                    onArgumentTypeChange={
                      mainContractInteraction.handleArgumentTypeChange
                    }
                  />

                  {mainContractInteraction.contractAddress && (
                    <FunctionArguments
                      selectedFunction={
                        mainContractInteraction.selectedFunction
                      }
                      functionInputs={mainContractInteraction.functionInputs}
                      onInputChange={mainContractInteraction.handleInputChange}
                      argumentType={mainContractInteraction.argumentType}
                    />
                  )}
                </>
              )}
              {jobType === 3 && (
                <>
                  <ContractDetails
                    contractAddress={mainContractInteraction.contractAddress}
                    contractABI={mainContractInteraction.contractABI}
                    targetFunction={mainContractInteraction.targetFunction}
                    functions={mainContractInteraction.functions}
                    onContractAddressChange={
                      mainContractInteraction.handleContractAddressChange
                    }
                    onFunctionChange={
                      mainContractInteraction.handleFunctionChange
                    }
                    argumentType={mainContractInteraction.argumentType}
                    onArgumentTypeChange={
                      mainContractInteraction.handleArgumentTypeChange
                    }
                  />
                </>
              )}

              <div className="flex items-center justify-between">
                <label
                  htmlFor="code_url"
                  className="block text-base font-medium text-gray-300"
                >
                  IPFS Code URL
                </label>
                <input
                  id="code_url"
                  value={code_url}
                  onChange={(e) => {
                    handleCodeUrlChange(e);
                  }}
                  className="w-[80%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none "
                  placeholder="Enter IPFS URL or CID (e.g., ipfs://... or https://ipfs.io/ipfs/...)"
                />
              </div>

              <h4 className="w-[78%] ml-auto mt-4 text-xs text-gray-400">
                Provide an IPFS URL or CID, where your code is stored.
              </h4>
            </div>

            {linkedJobs.map((jobId) => (
              <div
                key={jobId}
                className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 pt-0 pb-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8"
              >
                <p className="w-full text-center py-4 underline underline-offset-4">Linked Job {jobId}</p>
                <div className="relative flex items-center justify-between gap-6">
                  <label className="block text-base font-medium text-gray-300">
                    Network
                  </label>
                  <div className="relative w-[80%]">
                    <div className="w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg border border-white/10 flex items-center gap-5">
                      <div className="w-6 h-6">
                        {networkIcons[selectedNetwork]}
                      </div>
                      {selectedNetwork}
                    </div>
                  </div>
                </div>

                {jobId > 0 &&
                  linkedContractInteractions[jobId - 1]?.targetFunction && (
                    <div className="relative flex items-center justify-between gap-6">
                      <label className="block text-base font-medium text-gray-300">
                        Trigger Function
                      </label>
                      <div className="relative w-[80%]">
                        {linkedContractInteractions[jobId - 1].targetFunction}
                      </div>
                    </div>
                  )}

                <ContractDetails
                  contractAddress={
                    linkedContractInteractions[jobId]?.contractAddress || ""
                  }
                  contractABI={
                    linkedContractInteractions[jobId]?.contractABI || ""
                  }
                  targetFunction={
                    linkedContractInteractions[jobId]?.targetFunction || ""
                  }
                  functions={linkedContractInteractions[jobId]?.functions || []}
                  onContractAddressChange={
                    linkedContractInteractions[jobId]
                      ?.handleContractAddressChange
                  }
                  onFunctionChange={
                    linkedContractInteractions[jobId]?.handleFunctionChange
                  }
                  argumentType={
                    linkedContractInteractions[jobId]?.argumentType || "static"
                  }
                  onArgumentTypeChange={
                    linkedContractInteractions[jobId]?.handleArgumentTypeChange
                  }
                />

                {linkedContractInteractions[jobId]?.contractAddress && (
                  <FunctionArguments
                    selectedFunction={
                      linkedContractInteractions[jobId]?.selectedFunction ||
                      null
                    }
                    functionInputs={
                      linkedContractInteractions[jobId]?.functionInputs || []
                    }
                    onInputChange={
                      linkedContractInteractions[jobId]?.handleInputChange
                    }
                    argumentType={
                      linkedContractInteractions[jobId]?.argumentType ||
                      "static"
                    }
                  />
                )}

                <div className="flex items-center justify-between">
                  <label
                    htmlFor="code_url"
                    className="block text-base font-medium text-gray-300"
                  >
                    IPFS Code URL
                  </label>
                  <input
                    id="code_url"
                    value={code_url}
                    onChange={(e) => {
                      handleCodeUrlChange(e);
                    }}
                    className="w-[80%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none "
                    placeholder="Enter IPFS URL or CID (e.g., ipfs://... or https://ipfs.io/ipfs/...)"
                  />
                </div>

                <h4 className="w-[78%] ml-auto mt-4 text-xs text-gray-400">
                  Provide an IPFS URL or CID, where your code is stored.
                </h4>
              </div>
            ))}

            {/* Button */}
            <div className="flex items-center justify-center gap-2 mx-auto">
              <button
                type="submit"
                className="px-10 py-3 bg-white hover:translate-y-1 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-black"
              >
                Create Job
              </button>
              <button
                onClick={handleLinkJob}
                className="px-10 py-3 bg-white hover:translate-y-1 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-black"
              >
                Link Job
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Estimated Fee Modal */}
      {/* <EstimatedFeeModal
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
      /> */}
    </div>
  );
}

export default CreateJobPage;
