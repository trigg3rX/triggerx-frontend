import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useStakeRegistry } from "./useStakeRegistry";

export function useJobCreation() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState();
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [gasUnits, setGasUnits] = useState(0);
  const [argType, setArgType] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scriptFunction, setScriptFunction] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [estimatedFeeInGwei, setEstimatedFeeInGwei] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


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

      console.log(
        `Code URL for ${jobType} ${jobId !== null ? "linked job " + jobId : "main job"
        } changed to:`,
        url
      );
    }
  };

  useEffect(() => {
    fetchTGBalance();
  }, []);

  const estimateFee = async (
    timeframeInSeconds,
    intervalInSeconds,
    codeUrls,

  ) => {
    console.log("argType", argType);
    try {
      // const provider = new ethers.BrowserProvider(window.ethereum);
      // const contract = new ethers.Contract(contractAddress, contractABI, provider);
      // const functionFragment = contract.interface.getFunction(targetFunction);

      // const params = functionFragment.inputs.map((input, index) => {
      //   if (index < argsArray.length) {
      //     return argsArray[index];
      //   }
      // });

      // const gasEstimate = await contract[functionFragment.name].estimateGas(...params);
      // const gasEstimateStr = gasEstimate.toString();
      // setGasUnits(gasEstimateStr);
      // console.log('Gas estimate:', gasEstimateStr);

      // const feeData = await provider.getFeeData();
      // const gasPrice = feeData.gasPrice;
      // console.log('Gas price:', gasPrice.toString());

      // const feeInWei = gasEstimate * gasPrice;
      // const feeInEth = ethers.formatEther(feeInWei);
      // console.log('Fee for one execution:', feeInEth, 'ETH');

      const executionCount = Math.ceil(timeframeInSeconds / intervalInSeconds);

      // const overallFee = Number(feeInEth) * executionCount;
      // console.log('Overall fee:', overallFee.toFixed(18), 'ETH');

      let totalFeeTG = 0;
      // user TG balance
      if (argType === 1) {
        console.log("argType", argType);
        if (codeUrls) {
          console.log("codeUrls", codeUrls);
          try {
            const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(
              `${API_BASE_URL}/api/fees?ipfs_url=${encodeURIComponent(
                codeUrls
              )}`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("response", response);

            if (!response.ok) {
              throw new Error("Failed to get fees");
            }

            const data = await response.json(); // Parse the response body
            console.log("Response data:", data); // Log the response data

            // Check if the response contains an error
            if (data.error) {
              throw new Error(data.error); // Handle the error from the response
            }

            totalFeeTG = Number(data.total_fee) * executionCount;

            // Calculate stake amount in ETH and convert to Gwei
            const stakeAmountEth = totalFeeTG * 0.001;

            console.log("Total TG fee required:", totalFeeTG.toFixed(18), "TG");

            const stakeAmountGwei = ethers.parseUnits(
              (stakeAmountEth * 1e9).toFixed(0),
              "gwei"
            );
            const estimatedFeeInGwei = stakeAmountGwei;
            console.log("Stake amount in Gwei:", estimatedFeeInGwei);

            setEstimatedFeeInGwei(estimatedFeeInGwei);
          } catch (error) {
            console.error("Error getting task fees:", error);
            toast.warning("Failed to get task fees. Using base fee estimation.");
          }
        }
      }
      else {
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

  const fetchTGBalance = async () => {
    try {
      // Check if ethereum provider exists
      if (!window.ethereum) {
        console.warn("No Ethereum provider found. Please install MetaMask.");
        return;
      }

      // Use this to only check for existing connections without prompting:
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const stakeRegistryContract = new ethers.Contract(
          stakeRegistryAddress,
          ["function getStake(address) view returns (uint256, uint256)"],
          provider
        );

        const [_, tgBalance] = await stakeRegistryContract.getStake(userAddress);
        console.log("Raw TG Balance:", tgBalance.toString());
        setUserBalance(ethers.formatEther(tgBalance));
      }
    } catch (error) {
      console.error("Error fetching TG balance:", error);
      // Don't show toast for wallet connection errors as they can be expected
      if (!error.message.includes("eth_requestAccounts")) {
        toast.error("Failed to fetch TG balance");
      }
    }
  };


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

        console.log("Staking ETH amount:", requiredEth);

        const tx = await contract.stake(
          ethers.parseEther(requiredEth.toString()),
          { value: ethers.parseEther(requiredEth.toString()) }
        );

        await tx.wait();
        console.log("Stake transaction confirmed: ", tx.hash);
        toast.success("ETH staked successfully!");
      }

      // Continue with job creation
      // let nextJobId;
      // try {
      //   const latestIdResponse = await fetch(
      //     "${API_BASE_URL}/api/jobs/latest-id",
      //     {
      //       method: "GET",
      //       mode: "cors",
      //       headers: {
      //         Accept: "application/json",
      //         Origin: "https://triggerx.network",
      //       },
      //     }
      //   );

      //   if (!latestIdResponse.ok) {
      //     throw new Error("Failed to fetch latest job ID");
      //   }

      //   const latestIdData = await latestIdResponse.json();
      //   nextJobId = latestIdData.latest_job_id + 1;
      //   console.log("Next job ID:", nextJobId);
      // } catch (error) {
      //   console.error("Error fetching latest job ID:", error);
      //   nextJobId = 1;
      // }

      // const chainIdHex = await window.ethereum.request({
      //   method: "eth_chainId",
      // });
      // const chainIdDecimal = parseInt(chainIdHex, 16).toString();

      // const jobData = {
      //   job_id: nextJobId,
      //   jobType: jobType,
      //   user_address: signer.address,
      //   chain_id: chainIdDecimal,
      //   time_frame: timeframeInSeconds,
      //   time_interval: intervalInSeconds,
      //   contract_address: contractAddress,
      //   target_function: targetFunction,
      //   arg_type: argType,
      //   arguments: argsArray,
      //   status: true,
      //   job_cost_prediction: parseInt(gasUnits),
      //   script_function: scriptFunction,
      //   script_ipfs_url: codeUrls[jobType],
      //   stake_amount: Number(estimatedFeeInGwei.toString()),
      //   user_balance: 0.0,
      //   required_tg: estimatedFee,
      // };

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://triggerx.network",
        },
        body: JSON.stringify(updatedJobDetails),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create job");
      }

      console.log("Job created successfully");
      setIsModalOpen(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Error creating job: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
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
      console.log("Script function changed to:", func);
    }
  };

  const handleJobTypeChange = (value) => {
    const numericType = parseInt(value);
    console.log("Setting job type:", numericType);
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
      console.log("Setting modal open:", value);
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
  };
}
