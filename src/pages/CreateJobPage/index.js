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
import { EstimatedFeeModal } from "./components/EstimatedFeeModal";
import { useStakeRegistry } from "./hooks/useStakeRegistry";
import { useAccount } from "wagmi";
import { optimismSepolia, baseSepolia } from "wagmi/chains";
import { Toaster, toast } from "react-hot-toast";
// import ProcessModal from "./components/ProcessModel";

import timeBasedIcon from "../../assets/time-based.gif";
import conditionBasedIcon from "../../assets/condition-based.gif";
import eventBasedIcon from "../../assets/event-based.gif";
import timeBasedGif from "../../assets/time-based.gif";
import conditionBasedGif from "../../assets/condition-based.gif";
import eventBasedGif from "../../assets/event-based.gif";

import DeleteConfirmationButton from "./components/DeleteConfirmationButton";
import { WarningOutlined } from "@ant-design/icons";
import { useProxyFactory } from "./hooks/useProxyFactory";
import { randomBytes } from "ethers";

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
  return { handleKeyDown };
};

// trigger option
const options = [
  {
    value: "1",
    label: "Time-based Trigger",
    icon: timeBasedIcon,
    gif: timeBasedGif,
  },
  {
    value: "2",
    label: "Condition-based Trigger",
    icon: conditionBasedIcon,
    gif: conditionBasedGif,
  },
  {
    value: "3",
    label: "Event-based Trigger",
    icon: eventBasedIcon,
    gif: eventBasedGif,
  },
];

function CreateJobPage() {
  const [selectedNetwork, setSelectedNetwork] = useState(
    supportedNetworks[0].name
  );
  const [triggerChainId, setTriggerChainId] = useState(supportedNetworks[0].id);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [linkedJobs, setLinkedJobs] = useState({});
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState([]);
  const [conditionScript, setConditionScript] = useState("");
  const { address, isConnected } = useAccount(); // Get isConnected from useAccount
  const [connected, setConnected] = useState(false);
  const formRef = useRef(null);
  const { handleKeyDown } = useFormKeyboardNavigation();
  const [contractDetails, setContractDetails] = useState({});
  const [recurring, setRecurring] = useState(false);
  const { deployNewProxy, isDeploying } = useProxyFactory();

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        toast.error("Please install MetaMask to use this application!");
        setConnected(false);
        return;
      }
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length === 0) {
          // Clear any existing toasts before showing connection message
          toast.dismiss();
          toast.error("Please connect your wallet to continue!");
        }
        setConnected(accounts.length > 0);
      } catch (error) {
        toast.error("Failed to check wallet connection!");
        setConnected(false);
      }
    };

    checkConnection();
  }, []);

  const eventdropdownRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        eventdropdownRef.current &&
        !eventdropdownRef.current.contains(event.target)
      ) {
        setIsEventOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const [processSteps, setProcessSteps] = useState([
    { id: 1, text: "Updating Database", status: "pending" },
    { id: 2, text: "Validating Job", status: "pending" },
    { id: 3, text: "Calculating Fees", status: "pending" },
  ]);
  const [showProcessModal, setShowProcessModal] = useState(false);

  const resetProcessSteps = () => {
    setProcessSteps([
      { id: 1, text: "Updating Database", status: "pending" },
      { id: 2, text: "Validating Job", status: "pending" },
      { id: 3, text: "Calculating Fees", status: "pending" },
    ]);
  };

  const handleLinkJob = (jobType) => {
    setLinkedJobs((prevJobs) => {
      const existingJobs = prevJobs[jobType] || [];
      if (existingJobs.length < 3) {
        const newJobId = existingJobs.length + 1;

        // Ensure jobType exists in contractDetails
        setContractDetails((prevDetails) => ({
          ...prevDetails,
          [jobType]: {
            ...prevDetails[jobType], // Keep existing jobs
            [newJobId]: {
              // New linked job
              contractAddress: "",
              contractABI: "",
              functions: [],
              targetFunction: "",
              argumentType: "static",
              argsArray: [],
              ipfsCodeUrl: "",
            },
          },
        }));

        return {
          ...prevJobs,
          [jobType]: [...existingJobs, newJobId],
        };
      }
      return prevJobs;
    });
  };

  const handleDeleteLinkedJob = (e, jobType, jobId) => {
    e.preventDefault();
    setLinkedJobs((prevJobs) => {
      const updatedJobs = {
        ...prevJobs,
        [jobType]: prevJobs[jobType].filter((id) => id !== jobId),
      };

      // Re-index the remaining jobs
      if (updatedJobs[jobType]) {
        updatedJobs[jobType] = updatedJobs[jobType].map(
          (id, index) => index + 1
        ); // Re-index from 1
      }

      // If there are no linked jobs left for this jobType, remove the jobType entry
      if (updatedJobs[jobType]?.length === 0) {
        delete updatedJobs[jobType];
      }

      return updatedJobs;
    });

    setContractDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        [jobType]: { ...prevDetails[jobType] },
      };

      const jobIds = Object.keys(updatedDetails[jobType])
        .filter((key) => key !== "main")
        .sort((a, b) => parseInt(a) - parseInt(b));

      if (jobIds.length === 0) {
        return updatedDetails; // No linked jobs, nothing to do
      }

      // Find the last valid index
      const lastIndex = parseInt(jobIds[jobIds.length - 1]);

      // Swap details
      const temp = updatedDetails[jobType][jobId];
      updatedDetails[jobType][jobId] = updatedDetails[jobType][lastIndex];
      updatedDetails[jobType][lastIndex] = temp;

      // Now delete the last index
      delete updatedDetails[jobType][lastIndex];

      // If there are no linked jobs left for this jobType, remove the jobType entry
      if (
        Object.keys(updatedDetails[jobType]).length === 1 &&
        updatedDetails[jobType]["main"] !== undefined
      ) {
        //Only 'main' is left
        // delete updatedDetails[jobType];
      }

      return updatedDetails;
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
    estimateFee,
    estimatedFee,
    // setEstimatedFee,
    isLoading,
    setIsLoading,
    userBalance,
    isModalOpen,
    setIsModalOpen,
    handleSubmit,
  } = useJobCreation();

  const { stakeRegistryAddress, stakeRegistryImplAddress, stakeRegistryABI } =
    useStakeRegistry();

  const handleContractDetailChange = (jobType, jobKey, field, value) => {
    setContractDetails((prevDetails) => ({
      ...prevDetails,
      [jobType]: {
        ...prevDetails[jobType],
        [jobKey]: {
          ...prevDetails[jobType]?.[jobKey],
          [field]: value,
        },
      },
    }));
  };

  // Ensure jobType exists in contractDetails on jobType change
  useEffect(() => {
    setContractDetails((prevDetails) => ({
      ...prevDetails,
      [jobType]: prevDetails[jobType] || {
        main: {
          contractAddress: "",
          contractABI: "",
          functions: [],
          targetFunction: "",
          argumentType: "static",
          argsArray: [],
          ipfsCodeUrl: "",
        },
      },
    }));
  }, [jobType]);

  const eventContractInteraction = useContractInteraction("job-3");

  const handleFormSubmit = async (e, jobType) => {
    e.preventDefault();

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
    }
    if (jobType === 1) {
      if (
        (timeInterval.hours === 0 &&
          timeInterval.minutes === 0 &&
          timeInterval.seconds === 0) ||
        timeInterval.hours * 3600 +
        timeInterval.minutes * 60 +
        timeInterval.seconds <
        30
      ) {
        setErrorInterval(
          "Please set a valid time interval of at least 30 seconds before submitting."
        );
        setTimeout(() => {
          errorIntervalRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
        return;
      }
    }

    try {
      const allJobsDetails = [];
      const mainJobDetails = contractDetails[jobType]?.["main"];

      // Deploy proxy for main job
      const { proxyAddress: mainProxyAddress } = await deployNewProxy(
        mainJobDetails.contractAddress,
        address
      );

      // Calculate taskdefinitionid and argType based on job type and argument type
      const getTaskDefinitionId = (argumentType) => {
        return argumentType === "static"
          ? jobType === 1
            ? 1
            : jobType === 2
              ? 5
              : 3
          : jobType === 1
            ? 2
            : jobType === 2
              ? 6
              : 4;
      };

      const getArgType = (argumentType) => argumentType === "static" ? 0 : 1;

      // Add main job details if available
      if (mainJobDetails) {
        const taskdefinitionid = getTaskDefinitionId(mainJobDetails.argumentType);
        const argType = getArgType(mainJobDetails.argumentType);

        allJobsDetails.push({
          jobType: jobType,
          user_address: address,
          stake_amount: 0,
          token_amount: 0,
          task_definition_id: taskdefinitionid,
          priority: 0,
          security: 0,
          time_frame: timeframeInSeconds,
          time_interval: intervalInSeconds,
          recurring: recurring,
          trigger_chain_id: triggerChainId.toString(),
          trigger_contract_address: mainProxyAddress,
          trigger_event: "NULL",
          script_ipfs_url: mainJobDetails.ipfsCodeUrl || "",
          script_target_function: "trigger",
          target_chain_id: triggerChainId.toString(),
          target_contract_address: "NULL",
          target_function: mainJobDetails.targetFunction,
          arg_type: argType,
          arguments: mainJobDetails.argsArray,
          script_trigger_function: "action",
          hasABI: !!mainJobDetails.contractABI,
          contractABI: mainJobDetails.contractABI,
          abstraction_contract: mainProxyAddress,
        });
      }

      // Collect details for linked jobs
      if (linkedJobs[jobType]) {
        for (const jobId of linkedJobs[jobType]) {
          const linkedJobDetails = contractDetails[jobType]?.[jobId];

          if (linkedJobDetails) {
            const taskdefinitionid = getTaskDefinitionId(linkedJobDetails.argumentType);
            const argType = getArgType(linkedJobDetails.argumentType);

            allJobsDetails.push({
              jobType: jobType,
              user_address: address,
              stake_amount: 0,
              token_amount: 0,
              task_definition_id: taskdefinitionid,
              priority: 0,
              security: 0,
              time_frame: timeframeInSeconds,
              time_interval: intervalInSeconds,
              recurring: false,
              trigger_chain_id: triggerChainId.toString(),
              trigger_contract_address: mainProxyAddress,
              trigger_event: "NULL",
              script_ipfs_url: linkedJobDetails.ipfsCodeUrl || "",
              script_target_function: "trigger",
              target_chain_id: triggerChainId.toString(),
              target_contract_address: "NULL",
              target_function: linkedJobDetails.targetFunction,
              arg_type: argType,
              arguments: linkedJobDetails.argsArray,
              script_trigger_function: "action",
              hasABI: !!linkedJobDetails.contractABI,
              contractABI: linkedJobDetails.contractABI,
              abstraction_contract: mainProxyAddress,
            });
          }
        }
      }
      setIsLoading(true);
      console.log("Job Details", allJobsDetails);
      setJobDetails(allJobsDetails);

      const codeUrls = allJobsDetails.map((job) => job.script_ipfs_url);

      try {
        resetProcessSteps();
        setShowProcessModal(true);

        // Step 1: Update Database
        setProcessSteps((prev) =>
          prev.map((step) =>
            step.id === 1 ? { ...step, status: "pending" } : step
          )
        );

        // Wait for 1.5 seconds to simulate database update
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mark Database step as completed
        setProcessSteps((prev) =>
          prev.map((step) =>
            step.id === 1 ? { ...step, status: "completed" } : step
          )
        );

        // Wait for 500ms before starting next step
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 2: Validate Job
        setProcessSteps((prev) =>
          prev.map((step) =>
            step.id === 2 ? { ...step, status: "pending" } : step
          )
        );

        // Wait for 1.5 seconds to simulate validation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mark Validation step as completed
        setProcessSteps((prev) =>
          prev.map((step) =>
            step.id === 2 ? { ...step, status: "completed" } : step
          )
        );

        // Wait for 500ms before starting next step
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 3: Calculate Fees
        setProcessSteps((prev) =>
          prev.map((step) =>
            step.id === 3 ? { ...step, status: "pending" } : step
          )
        );

        // Ensure estimateFee is awaited properly
        await estimateFee(
          timeframeInSeconds,
          intervalInSeconds,
          codeUrls,
          processSteps,
          setProcessSteps
        );

        // Ensure UI updates and animation completes
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mark Fee Calculation step as completed only after actual calculation
        setProcessSteps((prev) =>
          prev.map((step) =>
            step.id === 3 ? { ...step, status: "completed" } : step
          )
        );

        // await new Promise((resolve) => setTimeout(resolve, 1000));
        if (processSteps.every((step) => step.status === "completed")) {
          setIsModalOpen(true);
          setShowProcessModal(false);
          toast.success("Job created successfully !");
        }
      } catch (error) {
        console.error("Error during fee estimation:", error);
        setProcessSteps((prev) =>
          prev.map((step) =>
            step.id === 3 ? { ...step, status: "error" } : step
          )
        );
        toast.error("Failed to estimate fee!");
      }
    } catch (error) {
      console.error("Error during job creation:", error);
      setProcessSteps((prev) =>
        prev.map((step) =>
          step.status === "pending" ? { ...step, status: "error" } : step
        )
      );
      toast.error("Failed to create job!");
    }
  };

  const handleJobTypeChange = (e, newJobType) => {
    e.preventDefault();
    setJobType(Number(newJobType));
  };

  return (
    <div>
      <Toaster
        position="center"
        className="mt-10"
        toastOptions={{
          style: {
            background: "#0a0a0a", // Dark background
            color: "#fff", // White text
            borderRadius: "8px",
            border: "1px gray solid",
          },
        }}
      />

      {/* <ProcessModal isOpen={showProcessModal} steps={processSteps} /> */}

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
                      onClick={(e) => {
                        if (!option.disabled) {
                          handleJobTypeChange(e, option.value);
                        }
                      }}
                      className={`${Number(option.value) === jobType
                          ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-white"
                          : "bg-white/5 border border-white/10 "
                        } text-nowrap relative flex flex-wrap flex-col items-center justify-center w-full md:w-[33%] gap-2 px-4 pb-4 pt-8 rounded-lg transition-all duration-300 text-xs xs:text-base`}
                    >
                      <div
                        className={`${Number(option.value) === jobType
                            ? "bg-white border border-white/10"
                            : ""
                          } absolute top-2 left-2 rounded-full w-3 h-3 border`}
                      ></div>
                      {Number(option.value) === jobType ? (
                        <img
                          src={option.gif}
                          alt={option.label}
                          className="w-auto h-8"
                        />
                      ) : (
                        <img
                          src={option.icon}
                          alt={option.label}
                          className="w-auto h-8"
                        />
                      )}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {jobType ? (
                <>
                  <div className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 py-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8 relative z-50">
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

                    {(jobType === 2 || jobType === 3) && (
                      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <label className="block text-sm sm:text-base font-medium text-gray-300">
                          Recurring
                        </label>
                        <div className="flex space-x-6 w-full md:w-[70%] xl:w-[80%]">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="recurring"
                              value="yes"
                              className="form-radio h-4 w-4 text-blue-500 accent-[#F8FF7C]"
                              checked={recurring === true}
                              onChange={() => setRecurring(true)}
                            />
                            <span className="ml-2 text-white">Yes</span>
                          </label>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="recurring"
                              value="no"
                              className="form-radio h-4 w-4 text-blue-500 accent-[#F8FF7C]"
                              checked={recurring === false}
                              onChange={() => setRecurring(false)}
                            />
                            <span className="ml-2 text-white">No</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {jobType === 3 && (
                      <>
                        <div className="relative flex flex-col items-start justify-between gap-6">
                          <label className="block text-sm sm:text-base font-medium text-gray-300 text-wrap overflow-hidden">
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
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                            required
                          />
                        </div>

                        {eventContractInteraction.contractAddress && (
                          <>
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
                                    <h4 className="text-red-400 mt-[2px]">✕</h4>
                                  </div>
                                )}
                              </div>
                            </div>
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
                                  <div
                                    ref={eventdropdownRef}
                                    className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg"
                                  >
                                    {eventContractInteraction.events.map(
                                      (func, index) => {
                                        const signature = `${func.name
                                          }(${func.inputs
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
                                  No writable events found. Make sure the
                                  contract is verified on Blockscout /
                                  Etherscan.
                                </h4>
                              )}
                          </>
                        )}
                      </>
                    )}

                    <ContractDetails
                      contractAddress={
                        contractDetails[jobType]?.["main"]?.contractAddress ||
                        ""
                      }
                      setContractAddress={(value) =>
                        handleContractDetailChange(
                          jobType,
                          "main",
                          "contractAddress",
                          value
                        )
                      }
                      contractABI={
                        contractDetails[jobType]?.["main"]?.contractABI || ""
                      }
                      setContractABI={(value) =>
                        handleContractDetailChange(
                          jobType,
                          "main",
                          "contractABI",
                          value
                        )
                      }
                      functions={
                        contractDetails[jobType]?.["main"]?.functions || []
                      }
                      setFunctions={(value) =>
                        handleContractDetailChange(
                          jobType,
                          "main",
                          "functions",
                          value
                        )
                      }
                      targetFunction={
                        contractDetails[jobType]?.["main"]?.targetFunction || ""
                      }
                      setTargetFunction={(value) =>
                        handleContractDetailChange(
                          jobType,
                          "main",
                          "targetFunction",
                          value
                        )
                      }
                      argumentType={
                        contractDetails[jobType]?.["main"]?.argumentType ||
                        "static"
                      }
                      setArgumentType={(value) =>
                        handleContractDetailChange(
                          jobType,
                          "main",
                          "argumentType",
                          value
                        )
                      }
                      argsArray={
                        contractDetails[jobType]?.["main"]?.argsArray || []
                      }
                      setArgArray={(value) =>
                        handleContractDetailChange(
                          jobType,
                          "main",
                          "argsArray",
                          value
                        )
                      }
                      ipfsCodeUrl={
                        contractDetails[jobType]?.["main"]?.ipfsCodeUrl || ""
                      }
                      setIpfsCodeUrl={(value) =>
                        handleContractDetailChange(
                          jobType,
                          "main",
                          "ipfsCodeUrl",
                          value
                        )
                      }
                    />

                    {jobType === 2 && (
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <label
                          htmlFor="ConditionScript"
                          className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
                        >
                          Condition Script
                        </label>

                        <input
                          id="ConditionScript"
                          value={conditionScript}
                          required
                          onChange={(e) => {
                            setConditionScript(e.target.value);
                          }}
                          className="text-xs xs:text-sm sm:text-base w-full md:w-[70%] xl:w-[80%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none "
                          placeholder="Enter your condition script"
                        />
                      </div>
                    )}
                  </div>

                  {linkedJobs[jobType]?.length > 0 && (
                    <div className="space-y-8">
                      {linkedJobs[jobType].map((jobId) => {
                        const jobKey = jobId; // The linked job ID
                        return (
                          <div
                            key={jobId}
                            className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 pt-0 pb-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8 overflow-hidden"
                          >
                            <div className="bg-[#303030] border border-white/10 flex justify-center items-center gap-3 mt-0 w-[110%] ml-[-30px]">
                              <p className="py-4">Linked Job {jobId}</p>
                              <DeleteConfirmationButton
                                jobType={jobType}
                                jobId={jobId}
                                handleDeleteLinkedJob={handleDeleteLinkedJob}
                              />
                            </div>

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

                            <ContractDetails
                              contractAddress={
                                contractDetails[jobType]?.[jobKey]
                                  ?.contractAddress || ""
                              }
                              setContractAddress={(value) =>
                                handleContractDetailChange(
                                  jobType,
                                  jobKey,
                                  "contractAddress",
                                  value
                                )
                              }
                              contractABI={
                                contractDetails[jobType]?.[jobKey]
                                  ?.contractABI || ""
                              }
                              setContractABI={(value) =>
                                handleContractDetailChange(
                                  jobType,
                                  jobKey,
                                  "contractABI",
                                  value
                                )
                              }
                              functions={
                                contractDetails[jobType]?.[jobKey]?.functions ||
                                []
                              }
                              setFunctions={(value) =>
                                handleContractDetailChange(
                                  jobType,
                                  jobKey,
                                  "functions",
                                  value
                                )
                              }
                              targetFunction={
                                contractDetails[jobType]?.[jobKey]
                                  ?.targetFunction || ""
                              }
                              setTargetFunction={(value) =>
                                handleContractDetailChange(
                                  jobType,
                                  jobKey,
                                  "targetFunction",
                                  value
                                )
                              }
                              argumentType={
                                contractDetails[jobType]?.[jobKey]
                                  ?.argumentType || "static"
                              }
                              setArgumentType={(value) =>
                                handleContractDetailChange(
                                  jobType,
                                  jobKey,
                                  "argumentType",
                                  value
                                )
                              }
                              argsArray={
                                contractDetails[jobType]?.[jobKey]?.argsArray ||
                                []
                              }
                              setArgArray={(value) =>
                                handleContractDetailChange(
                                  jobType,
                                  jobKey,
                                  "argsArray",
                                  value
                                )
                              }
                              ipfsCodeUrl={
                                contractDetails[jobType]?.[jobKey]
                                  ?.ipfsCodeUrl || ""
                              }
                              setIpfsCodeUrl={(value) =>
                                handleContractDetailChange(
                                  jobType,
                                  jobKey,
                                  "ipfsCodeUrl",
                                  value
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex gap-4 justify-center items-center relative z-30">
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
                          className={`${isLoading ? "cursor-not-allowed opacity-50 " : ""
                            }font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base`}
                        >
                          Link Job
                        </span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-[#141414] backdrop-blur-xl rounded-2xl px-6 py-10 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-8 flex items-center justify-center gap-2">
                  <span className="mt-1">
                    <WarningOutlined />
                  </span>
                  select trigger type to create new job
                </div>
              )}
            </div>
          </form>
        </div>
        {/* Estimated Fee Modal */}
        <EstimatedFeeModal
          isOpen={isLoading}
          showProcessing={showProcessModal}
          showFees={isModalOpen}
          steps={processSteps}
          onClose={() => {
            console.log("Closing fee modal");
            setIsModalOpen(false);
            setIsLoading(false);
            setProcessSteps(false);
            resetProcessSteps(); // Add this line
          }}
          estimatedFee={estimatedFee}
          onStake={() => {
            console.log("Initiating stake with params:", {
              stakeRegistryImplAddress,
              hasABI: !!stakeRegistryABI,
              jobDetails,
            });
            handleSubmit(stakeRegistryAddress, stakeRegistryABI, jobDetails);
          }}
          userBalance={userBalance}
        />
      </div>
    </div>
  );
}

export default CreateJobPage;
