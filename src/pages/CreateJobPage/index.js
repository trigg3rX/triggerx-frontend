//index.js
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "./components/PageHeader";
import { useJobCreation } from "./hooks/useJobCreation";
import { ChevronDown } from "lucide-react";
import { TimeframeInputs } from "./components/TimeframeInputs";
import { useTimeManagement } from "./hooks/useTimeManagement";
import { TimeIntervalInputs } from "./components/TimeIntervalInputs";
import { ContractDetails } from "./components/ContractDetails";
import { useContractInteraction } from "./hooks/useContractInteraction";
import { FunctionArguments } from "./components/FunctionArguments";
import { EstimatedFeeModal } from "./components/EstimatedFeeModal";
import { useStakeRegistry } from "./hooks/useStakeRegistry";
import { useAccount } from "wagmi";
import { optimismSepolia, baseSepolia } from "wagmi/chains";

const networkIcons = {
  [optimismSepolia.name]: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Optimism SVG path */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28ZM12.5021 19.1895C11.7876 19.1895 11.2022 19.0214 10.7458 18.6851C10.2955 18.3429 10.0703 17.8565 10.0703 17.2261C10.0703 17.094 10.0853 16.9318 10.1153 16.7397C10.1934 16.3074 10.3045 15.788 10.4486 15.1816C10.8569 13.5304 11.9107 12.7048 13.6099 12.7048C14.0723 12.7048 14.4866 12.7828 14.8528 12.9389C15.2191 13.089 15.5073 13.3172 15.7175 13.6234C15.9276 13.9236 16.0327 14.2839 16.0327 14.7042C16.0327 14.8303 16.0177 14.9894 15.9877 15.1816C15.8976 15.7159 15.7895 16.2353 15.6634 16.7397C15.4533 17.5623 15.09 18.1778 14.5736 18.586C14.0572 18.9883 13.3668 19.1895 12.5021 19.1895ZM12.6282 17.8925C12.9645 17.8925 13.2496 17.7935 13.4838 17.5953C13.724 17.3972 13.8951 17.094 13.9972 16.6857C14.1353 16.1212 14.2404 15.6289 14.3125 15.2086C14.3365 15.0825 14.3485 14.9534 14.3485 14.8213C14.3485 14.2749 14.0632 14.0017 13.4929 14.0017C13.1566 14.0017 12.8684 14.1007 12.6282 14.2989C12.394 14.4971 12.2259 14.8003 12.1238 15.2086C12.0158 15.6109 11.9077 16.1032 11.7996 16.6857C11.7756 16.8057 11.7636 16.9318 11.7636 17.0639C11.7636 17.6164 12.0518 17.8925 12.6282 17.8925ZM16.2939 19.0362C16.3299 19.0782 16.381 19.0993 16.447 19.0993H17.6719C17.7319 19.0993 17.789 19.0782 17.843 19.0362C17.897 18.9941 17.9301 18.9401 17.9421 18.8741L18.3564 16.9016H19.5723C20.3589 16.9016 20.9773 16.7365 21.4277 16.4063C21.884 16.076 22.1872 15.5656 22.3373 14.8751C22.3734 14.713 22.3914 14.5569 22.3914 14.4068C22.3914 13.8844 22.1872 13.4851 21.7789 13.2089C21.3766 12.9327 20.8422 12.7946 20.1757 12.7946H17.78C17.7199 12.7946 17.6629 12.8156 17.6088 12.8576C17.5548 12.8997 17.5218 12.9537 17.5098 13.0198L16.2669 18.8741C16.2549 18.9341 16.2638 18.9881 16.2939 19.0362ZM20.2928 15.4515C20.1067 15.5896 19.8875 15.6587 19.6354 15.6587H18.5996L18.9418 14.0465H20.0226C20.2688 14.0465 20.4429 14.0945 20.545 14.1906C20.6471 14.2807 20.6981 14.4128 20.6981 14.5869C20.6981 14.665 20.6891 14.755 20.6711 14.8571C20.6111 15.1153 20.485 15.3134 20.2928 15.4515Z"
        fill="currentColor"
      />
    </svg>
  ),
  [baseSepolia.name]: (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.98995 14C11.3092 14 14 11.3137 14 8C14 4.6863 11.3092 2 7.98995 2C4.84104 2 2.25776 4.41765 2.0009 7.49506H10.9195V8.49416H2C2.25171 11.5767 4.83736 14 7.98995 14Z"
        fill="currentColor"
      />
    </svg>
  ),
};

const supportedNetworks = [optimismSepolia, baseSepolia];

const useFormKeyboardNavigation = () => {
  // This ref will help us avoid re-focusing the first input when unnecessary
  const initialized = useRef(false);

  const handleKeyDown = (event) => {
    // Only process if the key is Enter and not in a textarea
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault(); // Prevent form submission

      // Get all focusable elements in the form
      const form = event.target.closest("form");
      if (!form) return;

      const focusableElements = [
        ...form.querySelectorAll(
          'input, select, button, [tabindex]:not([tabindex="-1"]), [role="button"]'
        ),
      ].filter(
        (el) =>
          !el.disabled && el.style.display !== "none" && el.type !== "submit"
      );

      // Find current element index
      const currentIndex = focusableElements.indexOf(event.target);

      // If it's a dropdown trigger element, open the dropdown
      if (
        event.target.getAttribute("role") === "button" ||
        event.target.closest('[role="button"]') ||
        event.target.classList.contains("cursor-pointer")
      ) {
        // Simulate click to open dropdown
        event.target.click();
        return;
      }

      // Move to next element if available
      if (currentIndex !== -1 && currentIndex < focusableElements.length - 1) {
        focusableElements[currentIndex + 1].focus();
      }
    }
  };

  // This effect will focus the first input ONLY on initial component mount
  const focusFirstInput = (formRef) => {
    if (formRef.current && !initialized.current) {
      const firstInput = formRef.current.querySelector('input, [tabindex="0"]');
      if (firstInput) {
        firstInput.focus();
        initialized.current = true; // Mark as initialized to prevent future re-focusing
      }
    }
  };

  return { handleKeyDown, focusFirstInput };
};

function CreateJobPage() {
  const [selectedNetwork, setSelectedNetwork] = useState(
    supportedNetworks[0].name
  );
  const [triggerChainId, setTriggerChainId] = useState(supportedNetworks[0].id);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [linkedJobs, setLinkedJobs] = useState({});
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState([]);
  const [functionError, setFunctionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const formRef = useRef(null);
  const { handleKeyDown, focusFirstInput } = useFormKeyboardNavigation();

  useEffect(() => {
    focusFirstInput(formRef);
  });

  const dropdownRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNetworkOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLinkJob = (jobType) => {
    setLinkedJobs((prevJobs) => {
      const existingJobs = prevJobs[jobType] || []; // Get existing jobs for the selected job type
      if (existingJobs.length < 3) {
        // Limit to 3 linked jobs per type
        return {
          ...prevJobs,
          [jobType]: [...existingJobs, existingJobs.length + 1], // Add a new linked job
        };
      }
      return prevJobs; // Do nothing if the limit is reached
    });
  };

  const {
    timeframe,
    handleTimeframeChange,
    timeframeInSeconds,
    timeInterval,
    intervalInSeconds,
    errorFrame,
    setErrorFrame,
    errorInterval,
    setErrorInterval,
    errorFrameRef,
    errorIntervalRef,
    handleTimeIntervalChange,
  } = useTimeManagement();

  const {
    jobType,
    setJobType,
    codeUrls,
    handleCodeUrlChange,
    estimateFee,
    estimatedFee,
    setEstimatedFee,
    userBalance,
    isModalOpen,
    //     // ethAmount,
    setIsModalOpen,
    // estimateFee,
    handleSubmit,
    //     scriptFunction,
    //     handleScriptFunctionChange,
  } = useJobCreation();

  const { stakeRegistryAddress, stakeRegistryImplAddress, stakeRegistryABI } =
    useStakeRegistry();

  const timeContractInteraction = useContractInteraction(1);
  const time1ContractInteraction = useContractInteraction(1_1);
  const time2ContractInteraction = useContractInteraction(1_2);
  const time3ContractInteraction = useContractInteraction(1_3);

  const conditionContractInteraction = useContractInteraction(2);
  const condition1ContractInteraction = useContractInteraction(2_1);
  const condition2ContractInteraction = useContractInteraction(2_2);
  const condition3ContractInteraction = useContractInteraction(2_3);

  const eventFunctionContractInteraction = useContractInteraction(3);
  const eventFunction1ContractInteraction = useContractInteraction(3_1);
  const eventFunction2ContractInteraction = useContractInteraction(3_2);
  const eventFunction3ContractInteraction = useContractInteraction(3_3);

  const eventContractInteraction = useContractInteraction(4);

  const handleFormSubmit = async (e, jobType) => {
    e.preventDefault();

    // Mapping jobType to corresponding contract interaction
    const contractInteractionMap = {
      1: timeContractInteraction,
      2: conditionContractInteraction,
      3: eventFunctionContractInteraction,
    };

    const linkedJobsMap = {
      1: [
        time1ContractInteraction,
        time2ContractInteraction,
        time3ContractInteraction,
      ],
      2: [
        condition1ContractInteraction,
        condition2ContractInteraction,
        condition3ContractInteraction,
      ],
      3: [
        eventFunction1ContractInteraction,
        eventFunction2ContractInteraction,
        eventFunction3ContractInteraction,
      ],
    };

    const selectedContract = contractInteractionMap[jobType];

    if (!selectedContract) {
      console.error("Invalid job type selected:", jobType);
      return;
    }

    if (
      timeframe.years === 0 &&
      timeframe.months === 0 &&
      timeframe.days === 0
    ) {
      setErrorFrame("Please set a valid timeframe before submitting.");

      setTimeout(() => {
        errorFrameRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100); // Small delay ensures it happens after state updates

      return;
    } else if (
      timeInterval.hours === 0 &&
      timeInterval.minutes === 0 &&
      timeInterval.seconds === 0
    ) {
      setErrorInterval("Please set a valid timeinterval before submitting.");

      setTimeout(() => {
        errorIntervalRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100); // Small delay ensures it happens after state updates

      return;
    } else if (!selectedContract.targetFunction) {
      setFunctionError(true);
      return;
    }

    setIsLoading(true);

    try {
      // Construct an array of contract addresses (main job + linked jobs if available)
      const jobsArray = [
        selectedContract,
        ...(linkedJobsMap[jobType] || []),
      ].filter((job) => job && job.contractAddress);

      const jobDetails = jobsArray.map((job, index, arr) => {
        let taskdefinitionid;
        if (jobType === 1) {
          // For jobtype 1: static -> 1, dynamic -> 2
          taskdefinitionid =
            job.argumentType === "static"
              ? 1
              : job.argumentType === "dynamic"
              ? 2
              : null;
        } else if (jobType === 2) {
          // For jobtype 2: static -> 5, dynamic -> 6
          taskdefinitionid =
            job.argumentType === "static"
              ? 5
              : job.argumentType === "dynamic"
              ? 6
              : null;
        } else if (jobType === 3) {
          // For jobtype 3: static -> 3, dynamic -> 4
          taskdefinitionid =
            job.argumentType === "static"
              ? 3
              : job.argumentType === "dynamic"
              ? 4
              : null;
        }

        const argType =
          job.argumentType === "static"
            ? 0
            : job.argumentType === "dynamic"
            ? 1
            : null;
        const nextJob = arr[index + 1];

        return {
          jobType: jobType,
          user_address: address,
          stake_amount: 0,
          token_amount: 0,
          task_definition_id: taskdefinitionid,
          priority: 0,
          security: 0,
          time_frame: timeframeInSeconds,
          time_interval: intervalInSeconds,
          recurring: false, /////bakiiiiiiiiiiiiiiiiiiiiiiiiiiiii
          trigger_chain_id: triggerChainId.toString(),
          trigger_contract_address: job.contractAddress,
          trigger_event:
            jobType === 3
              ? eventContractInteraction.targetEvent || "NULL"
              : "NULL",
          script_ipfs_url:
            index === 0
              ? codeUrls[jobType]?.main || ""
              : codeUrls[jobType]?.[index] || "",
          script_target_function: "trigger",
          target_chain_id: triggerChainId.toString(),
          target_contract_address: nextJob ? nextJob.contractAddress : "NULL",
          target_function: job.targetFunction,
          arg_type: argType,
          arguments: job.argsArray,
          script_trigger_function: "action",
          hasABI: !!job.contractABI,
          contractABI: job.contractABI,
        };
      });

      console.log("jobdetails", jobDetails);

      // Estimate the fee for all jobs and sum them up
      const rawFee = await estimateFee(timeframeInSeconds, intervalInSeconds);
      // console.log("raw fee",rawFee);
      const totalEstimatedFee = typeof rawFee === "undefined" ? 2 : rawFee; // Use 0 as fallback per your comment

      console.log("Total Estimated Fee:", totalEstimatedFee);
      setJobDetails(jobDetails);
      setEstimatedFee(totalEstimatedFee);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error during job creation:", error);
      // Handle the error appropriately (e.g., show an error message)
    } finally {
      // Set loading to false regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white pt-10 md:pt-20 lg:pt-32 pb-20 mt-[5rem] lg:mt-[9rem] relative">
      {/* Background gradients */}
      <div className="fixed inset-0  pointer-events-none" />
      <div className="fixed top-0 left-1/2 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="mx-auto px-6 relative z-30">
        <PageHeader />

        <form
          ref={formRef}
          onSubmit={(e) => handleFormSubmit(e, jobType)}
          onKeyDown={handleKeyDown} // Add the keydown handler to the entire form
          className="w-full lg:w-[80%] max-w-[1600px] mx-auto"
        >
          <div className="space-y-8">
            {/* Job Type Selection */}
            <div className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 py-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8">
              <label className="block text-sm sm:text-base font-medium text-gray-300 mb-6 text-nowrap">
                Trigger Type
              </label>
              <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between w-[95%] mx-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (!option.disabled) {
                        setJobType(Number(option.value));
                      }
                    }}
                    className="text-nowrap relative flex flex-wrap flex-col items-center justify-center w-full md:w-[33%] gap-2 px-4 pb-4 pt-8 rounded-lg transition-all duration-300 bg-white/5 border border-white/10 text-xs xs:text-base"
                  >
                    <div
                      className={`${
                        Number(option.value) === jobType ? "bg-white" : ""
                      } absolute top-2 left-2 rounded-full w-2.5 h-2.5 border`}
                    ></div>
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 py-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8">
              {/* network */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <label className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap">
                  Network
                </label>
                <div
                  ref={dropdownRef}
                  className="relative w-full md:w-[70%] xl:w-[80%]"
                >
                  <div
                    className="w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center gap-5"
                    onClick={() => setIsNetworkOpen((prev) => !prev)}
                  >
                    <div className="w-6 h-6 text-xs xs:text-sm sm:text-base">
                      {networkIcons[selectedNetwork]}
                    </div>
                    {selectedNetwork}
                    <ChevronDown className="absolute top-3 right-4 text-white text-xs" />
                  </div>
                  {isNetworkOpen && (
                    <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                      {supportedNetworks.map((network) => (
                        <div
                          key={network.id}
                          className="py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg flex items-center gap-5 text-xs xs:text-sm sm:text-base"
                          onClick={() => {
                            setSelectedNetwork(network.name);
                            setTriggerChainId(network.id);
                            setIsNetworkOpen(false);
                          }}
                        >
                          <div className="w-6 h-6">
                            {networkIcons[network.name] || null}
                          </div>
                          {network.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <TimeframeInputs
                timeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
                error={errorFrame}
                ref={errorFrameRef}
              />

              {jobType === 1 && (
                <TimeIntervalInputs
                  timeInterval={timeInterval}
                  onTimeIntervalChange={handleTimeIntervalChange}
                  error={errorInterval}
                  ref={errorIntervalRef}
                />
              )}

              {jobType === 3 && (
                <>
                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <label className="block text-sm sm:text-base font-medium text-gray-300 w-[20%]">
                      Event Contract Address
                    </label>
                    <input
                      type="text"
                      id="contractAddress"
                      value={eventContractInteraction.contractAddress}
                      onChange={
                        eventContractInteraction.handleContractAddressChange
                      }
                      placeholder="Your Contract address"
                      className="w-full md:w-[70%] xl:w-[80%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <h4 className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap">
                      Contract ABI
                    </h4>
                    <div className="w-[70%] xl:w-[80%] text-start ml-3">
                      {eventContractInteraction.contractABI ? (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <div className="flex items-center ml-3">
                          <h4 className="text-gray-400 pr-2 text-xs xs:text-sm sm:text-base">
                            Not Available{" "}
                          </h4>
                          <h4 className="text-red-400 mt-[2px]"> ✕</h4>
                        </div>
                      )}
                    </div>
                  </div>
                  {eventContractInteraction.contractAddress && (
                    <>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <label
                          htmlFor="targetEvent"
                          className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
                        >
                          Target event
                        </label>

                        <div className="relative w-full md:w-[70%] xl:w-[80%] z-50">
                          <div
                            className="w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center justify-between"
                            onClick={() => setIsEventOpen(!isEventOpen)}
                          >
                            {eventContractInteraction.targetEvent ||
                              "Select an event"}
                            <ChevronDown className="text-white text-xs" />
                          </div>
                          {isEventOpen && (
                            <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                              {eventContractInteraction.events.map(
                                (func, index) => {
                                  const signature = `${func.name}(${func.inputs
                                    .map((input) => input.type)
                                    .join(",")})`;
                                  return (
                                    <div
                                      key={index}
                                      className="py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg"
                                      onClick={() => {
                                        eventContractInteraction.handleEventChange(
                                          {
                                            target: { value: signature },
                                          }
                                        );
                                        setIsEventOpen(false);
                                      }}
                                    >
                                      {signature}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {eventContractInteraction.events.length === 0 &&
                        eventContractInteraction.contractAddress && (
                          <h4 className="w-full md:w-[67%] xl:w-[78%] ml-auto  text-sm text-yellow-400">
                            No writable events found. Make sure the contract is
                            verified on Blockscout / Etherscan.
                          </h4>
                        )}
                    </>
                  )}
                </>
              )}

              {[1, 2, 3].includes(jobType) &&
                (() => {
                  const contractInteraction =
                    jobType === 1
                      ? timeContractInteraction
                      : jobType === 2
                      ? conditionContractInteraction
                      : eventFunctionContractInteraction;
                  return (
                    <>
                      <ContractDetails
                        contractAddress={contractInteraction.contractAddress}
                        contractABI={contractInteraction.contractABI}
                        targetFunction={contractInteraction.targetFunction}
                        functions={contractInteraction.functions}
                        onContractAddressChange={
                          contractInteraction.handleContractAddressChange
                        }
                        onFunctionChange={
                          contractInteraction.handleFunctionChange
                        }
                        argumentType={contractInteraction.argumentType}
                        onArgumentTypeChange={
                          contractInteraction.handleArgumentTypeChange
                        }
                        functionError={functionError}
                        setFunctionError={setFunctionError}
                      />
                      {contractInteraction.contractAddress && (
                        <FunctionArguments
                          selectedFunction={
                            contractInteraction.selectedFunction
                          }
                          functionInputs={contractInteraction.functionInputs}
                          onInputChange={contractInteraction.handleInputChange}
                          argumentType={contractInteraction.argumentType}
                        />
                      )}
                    </>
                  );
                })()}

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <label
                  htmlFor={jobType + "_code_url"}
                  className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
                >
                  IPFS Code URL
                </label>

                <input
                  id={jobType + "_code_url"}
                  value={codeUrls[jobType] || ""}
                  required
                  onChange={(e) => {
                    handleCodeUrlChange(e, jobType);
                  }}
                  className="text-xs xs:text-sm sm:text-base w-full md:w-[70%] xl:w-[80%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none "
                  placeholder="Enter IPFS URL or CID (e.g., ipfs://... or https://ipfs.io/ipfs/...)"
                />
              </div>

              <h4 className="w-full md:w-[67%] xl:w-[78%] ml-auto mt-0 text-xs text-gray-400">
                Provide an IPFS URL or CID, where your code is stored.
              </h4>
            </div>

            {linkedJobs[jobType]?.length > 0 && (
              <div className="space-y-8">
                {linkedJobs[jobType].map((jobId) => (
                  <div
                    key={jobId}
                    className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 pt-0 pb-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8"
                  >
                    <p className="w-full text-center py-4 underline underline-offset-4">
                      Linked Job {jobId}
                    </p>

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <label className="block text-sm sm:text-base font-medium text-gray-300">
                        Network
                      </label>
                      <div className="relative w-full md:w-[70%] xl:w-[80%]">
                        <div className="text-xs xs:text-sm sm:text-base w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg border border-white/10 flex items-center gap-5">
                          <div className="w-6 h-6">
                            {networkIcons[selectedNetwork]}
                          </div>
                          {selectedNetwork}
                        </div>
                      </div>
                    </div>

                    {[1, 2, 3].includes(jobType) &&
                      [1, 2, 3].includes(jobId) &&
                      (() => {
                        const interactions = {
                          1: {
                            1: timeContractInteraction,
                            2: time1ContractInteraction,
                            3: time2ContractInteraction,
                          },
                          2: {
                            1: conditionContractInteraction,
                            2: condition1ContractInteraction,
                            3: condition2ContractInteraction,
                          },
                          3: {
                            1: eventFunctionContractInteraction,
                            2: eventFunction1ContractInteraction,
                            3: eventFunction2ContractInteraction,
                          },
                        };

                        const currentInteraction =
                          interactions[jobType]?.[jobId];

                        return (
                          currentInteraction && (
                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                              <label className="block text-sm sm:text-base font-medium text-gray-300">
                                Trigger Function
                              </label>
                              <div className="text-xs xs:text-sm sm:text-base relative w-full md:w-[70%] xl:w-[80%]">
                                {currentInteraction.targetFunction}
                              </div>
                            </div>
                          )
                        );
                      })()}

                    {jobType === 1 && (
                      <>
                        <ContractDetails
                          setFunctionError={setFunctionError}
                          contractAddress={
                            jobId === 1
                              ? time1ContractInteraction.contractAddress
                              : jobId === 2
                              ? time2ContractInteraction.contractAddress
                              : jobId === 3
                              ? time3ContractInteraction.contractAddress
                              : ""
                          }
                          contractABI={
                            jobId === 1
                              ? time1ContractInteraction.contractABI
                              : jobId === 2
                              ? time2ContractInteraction.contractABI
                              : jobId === 3
                              ? time3ContractInteraction.contractABI
                              : []
                          }
                          targetFunction={
                            jobId === 1
                              ? time1ContractInteraction.targetFunction
                              : jobId === 2
                              ? time2ContractInteraction.targetFunction
                              : jobId === 3
                              ? time3ContractInteraction.targetFunction
                              : ""
                          }
                          functions={
                            jobId === 1
                              ? time1ContractInteraction.functions
                              : jobId === 2
                              ? time2ContractInteraction.functions
                              : jobId === 3
                              ? time3ContractInteraction.functions
                              : []
                          }
                          onContractAddressChange={
                            jobId === 1
                              ? time1ContractInteraction.handleContractAddressChange
                              : jobId === 2
                              ? time2ContractInteraction.handleContractAddressChange
                              : jobId === 3
                              ? time3ContractInteraction.handleContractAddressChange
                              : () => {}
                          }
                          onFunctionChange={
                            jobId === 1
                              ? time1ContractInteraction.handleFunctionChange
                              : jobId === 2
                              ? time2ContractInteraction.handleFunctionChange
                              : jobId === 3
                              ? time3ContractInteraction.handleFunctionChange
                              : () => {}
                          }
                          argumentType={
                            jobId === 1
                              ? time1ContractInteraction.argumentType
                              : jobId === 2
                              ? time2ContractInteraction.argumentType
                              : jobId === 3
                              ? time3ContractInteraction.argumentType
                              : ""
                          }
                          onArgumentTypeChange={
                            jobId === 1
                              ? time1ContractInteraction.handleArgumentTypeChange
                              : jobId === 2
                              ? time2ContractInteraction.handleArgumentTypeChange
                              : jobId === 3
                              ? time3ContractInteraction.handleArgumentTypeChange
                              : () => {}
                          }
                        />
                        {jobId === 1 &&
                          time1ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                time1ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                time1ContractInteraction.functionInputs
                              }
                              onInputChange={
                                time1ContractInteraction.handleInputChange
                              }
                              argumentType={
                                time1ContractInteraction.argumentType
                              }
                            />
                          )}
                        {jobId === 2 &&
                          time2ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                time2ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                time2ContractInteraction.functionInputs
                              }
                              onInputChange={
                                time2ContractInteraction.handleInputChange
                              }
                              argumentType={
                                time2ContractInteraction.argumentType
                              }
                            />
                          )}
                        {jobId === 3 &&
                          time3ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                time3ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                time3ContractInteraction.functionInputs
                              }
                              onInputChange={
                                time3ContractInteraction.handleInputChange
                              }
                              argumentType={
                                time3ContractInteraction.argumentType
                              }
                            />
                          )}
                      </>
                    )}

                    {jobType === 2 && (
                      <>
                        <ContractDetails
                          setFunctionError={setFunctionError}
                          contractAddress={
                            jobId === 1
                              ? condition1ContractInteraction.contractAddress
                              : jobId === 2
                              ? condition2ContractInteraction.contractAddress
                              : jobId === 3
                              ? condition3ContractInteraction.contractAddress
                              : ""
                          }
                          contractABI={
                            jobId === 1
                              ? condition1ContractInteraction.contractABI
                              : jobId === 2
                              ? condition2ContractInteraction.contractABI
                              : jobId === 3
                              ? condition3ContractInteraction.contractABI
                              : []
                          }
                          targetFunction={
                            jobId === 1
                              ? condition1ContractInteraction.targetFunction
                              : jobId === 2
                              ? condition2ContractInteraction.targetFunction
                              : jobId === 3
                              ? condition3ContractInteraction.targetFunction
                              : ""
                          }
                          functions={
                            jobId === 1
                              ? condition1ContractInteraction.functions
                              : jobId === 2
                              ? condition2ContractInteraction.functions
                              : jobId === 3
                              ? condition3ContractInteraction.functions
                              : []
                          }
                          onContractAddressChange={
                            jobId === 1
                              ? condition1ContractInteraction.handleContractAddressChange
                              : jobId === 2
                              ? condition2ContractInteraction.handleContractAddressChange
                              : jobId === 3
                              ? condition3ContractInteraction.handleContractAddressChange
                              : () => {}
                          }
                          onFunctionChange={
                            jobId === 1
                              ? condition1ContractInteraction.handleFunctionChange
                              : jobId === 2
                              ? condition2ContractInteraction.handleFunctionChange
                              : jobId === 3
                              ? condition3ContractInteraction.handleFunctionChange
                              : () => {}
                          }
                          argumentType={
                            jobId === 1
                              ? condition1ContractInteraction.argumentType
                              : jobId === 2
                              ? condition2ContractInteraction.argumentType
                              : jobId === 3
                              ? condition3ContractInteraction.argumentType
                              : ""
                          }
                          onArgumentTypeChange={
                            jobId === 1
                              ? condition1ContractInteraction.handleArgumentTypeChange
                              : jobId === 2
                              ? condition2ContractInteraction.handleArgumentTypeChange
                              : jobId === 3
                              ? condition3ContractInteraction.handleArgumentTypeChange
                              : () => {}
                          }
                        />
                        {jobId === 1 &&
                          condition1ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                condition1ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                condition1ContractInteraction.functionInputs
                              }
                              onInputChange={
                                condition1ContractInteraction.handleInputChange
                              }
                              argumentType={
                                condition1ContractInteraction.argumentType
                              }
                            />
                          )}
                        {jobId === 2 &&
                          condition2ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                condition2ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                condition2ContractInteraction.functionInputs
                              }
                              onInputChange={
                                condition2ContractInteraction.handleInputChange
                              }
                              argumentType={
                                condition2ContractInteraction.argumentType
                              }
                            />
                          )}
                        {jobId === 3 &&
                          condition3ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                condition3ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                condition3ContractInteraction.functionInputs
                              }
                              onInputChange={
                                condition3ContractInteraction.handleInputChange
                              }
                              argumentType={
                                condition3ContractInteraction.argumentType
                              }
                            />
                          )}
                      </>
                    )}

                    {jobType === 3 && (
                      <>
                        <ContractDetails
                          setFunctionError={setFunctionError}
                          contractAddress={
                            jobId === 1
                              ? eventFunction1ContractInteraction.contractAddress
                              : jobId === 2
                              ? eventFunction2ContractInteraction.contractAddress
                              : jobId === 3
                              ? eventFunction3ContractInteraction.contractAddress
                              : ""
                          }
                          contractABI={
                            jobId === 1
                              ? eventFunction1ContractInteraction.contractABI
                              : jobId === 2
                              ? eventFunction2ContractInteraction.contractABI
                              : jobId === 3
                              ? eventFunction3ContractInteraction.contractABI
                              : []
                          }
                          targetFunction={
                            jobId === 1
                              ? eventFunction1ContractInteraction.targetFunction
                              : jobId === 2
                              ? eventFunction2ContractInteraction.targetFunction
                              : jobId === 3
                              ? eventFunction3ContractInteraction.targetFunction
                              : ""
                          }
                          functions={
                            jobId === 1
                              ? eventFunction1ContractInteraction.functions
                              : jobId === 2
                              ? eventFunction2ContractInteraction.functions
                              : jobId === 3
                              ? eventFunction3ContractInteraction.functions
                              : []
                          }
                          onContractAddressChange={
                            jobId === 1
                              ? eventFunction1ContractInteraction.handleContractAddressChange
                              : jobId === 2
                              ? eventFunction2ContractInteraction.handleContractAddressChange
                              : jobId === 3
                              ? eventFunction3ContractInteraction.handleContractAddressChange
                              : () => {}
                          }
                          onFunctionChange={
                            jobId === 1
                              ? eventFunction1ContractInteraction.handleFunctionChange
                              : jobId === 2
                              ? eventFunction2ContractInteraction.handleFunctionChange
                              : jobId === 3
                              ? eventFunction3ContractInteraction.handleFunctionChange
                              : () => {}
                          }
                          argumentType={
                            jobId === 1
                              ? eventFunction1ContractInteraction.argumentType
                              : jobId === 2
                              ? eventFunction2ContractInteraction.argumentType
                              : jobId === 3
                              ? eventFunction3ContractInteraction.argumentType
                              : ""
                          }
                          onArgumentTypeChange={
                            jobId === 1
                              ? eventFunction1ContractInteraction.handleArgumentTypeChange
                              : jobId === 2
                              ? eventFunction2ContractInteraction.handleArgumentTypeChange
                              : jobId === 3
                              ? eventFunction3ContractInteraction.handleArgumentTypeChange
                              : () => {}
                          }
                        />
                        {jobId === 1 &&
                          eventFunction1ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                eventFunction1ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                eventFunction1ContractInteraction.functionInputs
                              }
                              onInputChange={
                                eventFunction1ContractInteraction.handleInputChange
                              }
                              argumentType={
                                eventFunction1ContractInteraction.argumentType
                              }
                            />
                          )}
                        {jobId === 2 &&
                          eventFunction2ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                eventFunction2ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                eventFunction2ContractInteraction.functionInputs
                              }
                              onInputChange={
                                eventFunction2ContractInteraction.handleInputChange
                              }
                              argumentType={
                                eventFunction2ContractInteraction.argumentType
                              }
                            />
                          )}
                        {jobId === 3 &&
                          eventFunction3ContractInteraction.contractAddress && (
                            <FunctionArguments
                              selectedFunction={
                                eventFunction3ContractInteraction.selectedFunction
                              }
                              functionInputs={
                                eventFunction3ContractInteraction.functionInputs
                              }
                              onInputChange={
                                eventFunction3ContractInteraction.handleInputChange
                              }
                              argumentType={
                                eventFunction3ContractInteraction.argumentType
                              }
                            />
                          )}
                      </>
                    )}

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <label
                        htmlFor={jobType + "_" + jobId + "_code_url"}
                        className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
                      >
                        IPFS Code URL
                      </label>
                      <input
                        id={jobType + "_" + jobId + "_code_url"}
                        value={codeUrls[jobType]?.[jobId] || ""}
                        required
                        onChange={(e) => handleCodeUrlChange(e, jobType, jobId)}
                        className="text-xs xs:text-sm sm:text-base w-full md:w-[70%] xl:w-[80%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none "
                        placeholder="Enter IPFS URL or CID (e.g., ipfs://... or https://ipfs.io/ipfs/...)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 justify-center items-center">
              <button
                type="submit"
                className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform"
                disabled={isLoading} // Disable while loading
              >
                <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                {isLoading ? (
                  <span className="flex items-center gap-2 text-nowrap font-actayRegular relative z-10 rounded-full opacity-50 cursor-not-allowed text-xs sm:text-base overflow-hidden">
                    Estimating Fees
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        className="spinner_rXNP"
                        cx="9"
                        cy="4"
                        rx="3"
                        ry="3"
                      />
                    </svg>
                  </span>
                ) : (
                  // Show button text
                  <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                    Create Job
                  </span>
                )}
              </button>
              {(linkedJobs[jobType]?.length ?? 0) < 3 && (
                <button
                  onClick={() => handleLinkJob(jobType)}
                  className="relative bg-[#222222] text-black border border-black px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform"
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                  <span className="absolute inset-0 bg-white rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>

                  <span
                    className={`${
                      isLoading ? "cursor-not-allowed opacity-50 " : ""
                    }font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base`}
                  >
                    Link Job
                  </span>
                </button>
              )}
            </div>
          </div>
        </form>
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
            jobDetails,
            // targetFunction,
            // argsArray,
            // timeframeInSeconds,
            // intervalInSeconds,
          });
          handleSubmit(
            stakeRegistryAddress,
            stakeRegistryABI,
            jobDetails
            // targetFunction,
            // argsArray,
            // timeframeInSeconds,
            // intervalInSeconds
          );
        }}
        userBalance={userBalance}
      />
    </div>
  );
}

export default CreateJobPage;
