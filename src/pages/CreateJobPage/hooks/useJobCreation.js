// usejobcreation
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useStakeRegistry } from "./useStakeRegistry";

export function useJobCreation() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState();
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [argType, setArgType] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scriptFunction, setScriptFunction] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [estimatedFeeInGwei, setEstimatedFeeInGwei] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJobCreated, setIsJobCreated] = useState(false);

  const [codeUrls, setCodeUrls] = useState([]);

  const handleCodeUrlChange = (event, jobType, jobId = null) => {
    if (event?.target) {
      const url = event.target.value;
      setCodeUrls((prev) => {
        // If jobType already exists as an array, make a copy; otherwise, initialize it as an empty array.
        const urls = prev[jobType] ? [...prev[jobType]] : [];
        // If jobId is provided, update that index; otherwise, update index 0 for the main job.
        if (jobId !== null) {
          urls[jobId] = url;
        } else {
          urls[0] = url;
        }
        return { ...prev, [jobType]: urls };
      });

      // console.log(
      //   `Code URL for ${jobType} ${jobId !== null ? "linked job " + jobId : "main job"
      //   } changed to:`,
      //   url
      // );
    }
  };

  const estimateFee = async (
    timeframeInSeconds,
    intervalInSeconds,
    codeUrls,
    recurring
  ) => {
    // console.log("argType", argType);
    try {
      let executionCount;
      if (jobType === 1) {
        executionCount = Math.ceil(timeframeInSeconds / intervalInSeconds);
      } else {
        executionCount = recurring ? 10 : 1;
      }
      console.log("Execution count:", executionCount);
      let totalFeeTG = 0;

      // user TG balance
      if (argType === 1) {
        // console.log("argType", argType);
        if (codeUrls) {
          // console.log("codeUrls", codeUrls);
          try {
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(
              `${API_BASE_URL}/api/fees?ipfs_url=${encodeURIComponent(
                codeUrls
              )}`,
              {
                method: "GET",
              }
            );
            // console.log("response", response);

            if (!response.ok) {
              throw new Error("Failed to get fees");
            }

            const data = await response.json(); // Parse the response body
            // console.log("Response data:", data); // Log the response data

            // Check if the response contains an error
            if (data.error) {
              throw new Error(data.error); // Handle the error from the response
            }

            totalFeeTG = Number(data.total_fee) * executionCount;

            // Calculate stake amount in ETH and convert to Gwei
            const stakeAmountEth = totalFeeTG * 0.001;

            // console.log("Total TG fee required:", totalFeeTG.toFixed(18), "TG");

            const stakeAmountGwei = ethers.parseUnits(
              (stakeAmountEth * 1e9).toFixed(0),
              "gwei"
            );
            const estimatedFeeInGwei = stakeAmountGwei;
            // console.log("Stake amount in Gwei:", estimatedFeeInGwei);

            setEstimatedFeeInGwei(estimatedFeeInGwei);
          } catch (error) {
            console.error("Error getting task fees:", error);
            toast.warning(
              "Failed to get task fees. Using base fee estimation."
            );
          }
        }
      } else {
        totalFeeTG = 0.1 * executionCount;
      }

      setEstimatedFee(totalFeeTG);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error estimating fee:", error);
      toast.error("Error estimating fee: " + error.message);
    }
  };

  const { stakeRegistryAddress, stakeRegistryImplAddress, stakeRegistryABI } =
    useStakeRegistry();

  const fetchTGBalance = useCallback(async () => {
    if (typeof window.ethereum == "undefined") return;

    if (!stakeRegistryAddress || !ethers.isAddress(stakeRegistryAddress)) {
      return;
    }

    try {
      // Check if ethereum provider exists
      if (!window.ethereum) {
        console.warn("No Ethereum provider found. Please install MetaMask.");
        return;
      }

      // Use this to only check for existing connections without prompting:
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const stakeRegistryContract = new ethers.Contract(
          stakeRegistryAddress,
          ["function getStake(address) view returns (uint256, uint256)"],
          provider
        );

        // console.log("stakeRegistryContract", stakeRegistryContract);

        const [_, tgBalance] =
          await stakeRegistryContract.getStake(userAddress);
        // console.log("Raw TG Balance:", tgBalance.toString());
        setUserBalance(ethers.formatEther(tgBalance));
      }
    } catch (error) {
      console.error("Error fetching TG balance:", error);
      // Don't show toast for wallet connection errors as they can be expected
      if (!error.message.includes("eth_requestAccounts")) {
        toast.error("Failed to fetch TG balance");
      }
    }
  }, [stakeRegistryAddress, setUserBalance]);

  useEffect(() => {
    if (stakeRegistryAddress && ethers.isAddress(stakeRegistryAddress)) {
      fetchTGBalance();
    }
    const handleAccountsChanged = (accounts) => {
      if (
        accounts.length > 0 &&
        stakeRegistryAddress &&
        ethers.isAddress(stakeRegistryAddress)
      ) {
        fetchTGBalance();
      } else if (accounts.length === 0) {
        // Handle user disconnecting
        setUserBalance("0"); // Or whatever your default state is
      }
    };

    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [stakeRegistryAddress, fetchTGBalance, setUserBalance]);

  const handleSubmit = async (
    stakeRegistryAddress,
    stakeRegistryABI,
    jobdetails
  ) => {
    setIsSubmitting(true);
    if (!jobType) {
      toast.error("Please fill in all required fields");
      return;
    }
    //stake the ETH for TG
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask to use this feature");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const updatedJobDetails = jobdetails.map((job) => ({
        ...job,
        job_cost_prediction: estimatedFee,
      }));
      console.log("updated", updatedJobDetails);

      // Check if user needs to stake
      if (userBalance < estimatedFee) {
        const requiredEth = (0.001 * estimatedFee).toFixed(18);
        const contract = new ethers.Contract(
          stakeRegistryAddress,
          stakeRegistryABI,
          signer
        );

        // console.log("Staking ETH amount:", requiredEth);

        const tx = await contract.stake(
          ethers.parseEther(requiredEth.toString()),
          { value: ethers.parseEther(requiredEth.toString()) }
        );

        await tx.wait();
        // console.log("Stake transaction confirmed: ", tx.hash);
        toast.success("ETH staked successfully!");

        // Fetch updated TG balance after staking
        await fetchTGBalance();
      }

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "POST",
        mode: "cors",

        body: JSON.stringify(updatedJobDetails),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create job");
      }

      setIsJobCreated(true);
      toast.success("Job created successfully!");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Error creating job: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDashboardClick = () => {
    setIsModalOpen(false);
    navigate("/dashboard");
  };

  const handleStake = async (estimatedFee) => {
    setIsModalOpen(false);
    setIsLoading(false);
    await handleSubmit(jobType, estimatedFee);
  };

  const handleScriptFunctionChange = (event) => {
    if (event && event.target) {
      const func = event.target.value;
      setScriptFunction(func);
      // console.log("Script function changed to:", func);
    }
  };

  const handleJobTypeChange = (value) => {
    const numericType = parseInt(value);
    // console.log("Setting job type:", numericType);
    setJobType(numericType);
  };

  return {
    jobType,
    setJobType: handleJobTypeChange,
    estimatedFee,
    setEstimatedFee,
    isLoading,
    setIsLoading,
    isModalOpen,
    argType,
    setIsModalOpen: (value) => {
      // console.log("Setting modal open:", value);
      setIsModalOpen(value);
    },
    setArgType,
    estimateFee,
    handleSubmit,
    handleStake,
    isSubmitting,
    scriptFunction,
    handleScriptFunctionChange,
    userBalance,
    setUserBalance,
    isJobCreated,
    handleDashboardClick,
  };
}
