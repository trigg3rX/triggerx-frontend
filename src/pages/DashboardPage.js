import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useStakeRegistry } from "./CreateJobPage/hooks/useStakeRegistry";

function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [connected, setConnected] = useState(false);
  const logoRef = useRef(null);
  const [tgBalance, setTgBalance] = useState("0");
  const [stakeModalVisible, setStakeModalVisible] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");

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

    fetchTGBalance();
  }, []);

  const provider = new ethers.BrowserProvider(window.ethereum);

  const getJobCreatorContract = async () => {
    const signer = await provider.getSigner();
    const jobCreatorContractAddress =
      "0x98a170b9b24aD4f42B6B3630A54517fd7Ff3Ac6d";
    const jobCreatorABI = [
      // Contract ABI...
    ];
    return new ethers.Contract(
      jobCreatorContractAddress,
      jobCreatorABI,
      signer
    );
  };

  const fetchJobDetails = async () => {
    try {
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      console.log(userAddress, "address");

      // Fetch job details from the ScyllaDB API
      const response = await fetch(
        `https://data.triggerx.network/api/jobs/user/${userAddress}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job details from the database");
      }

      const jobsData = await response.json();
      console.log("Fetched jobs data:", jobsData);

      const tempJobs = jobsData.map((jobDetail) => ({
        id: jobDetail.job_id, // job_id
        type: mapJobType(jobDetail.jobType), // Map job_type ID to label
        status: jobDetail.status ? "true" : "false", // Convert boolean to string
      }));

      console.log("All formatted jobs:", tempJobs);
      setJobDetails(tempJobs);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to fetch job details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map job type ID to label
  const mapJobType = (jobTypeId) => {
    // Convert jobTypeId to string to handle both string and number types
    const typeId = String(jobTypeId);

    switch (typeId) {
      case "1":
        return "Time-based";
      case "2":
        return "Event-based";
      case "3":
        return "Condition-based";
      default:
        return "Unknown";
    }
  };

  // useEffect to fetch job details on component mount
  useEffect(() => {
    fetchJobDetails();
  }, [window.ethereum]);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      fetchJobDetails();
    } else {
      console.log("Please connect to MetaMask.");
    }
  };

  window.ethereum.on("accountsChanged", handleAccountsChanged);

  useEffect(() => {
    const checkConnection = async () => {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setConnected(accounts.length > 0);
    };

    checkConnection();

    const handleAccountsChanged = (accounts) => {
      setConnected(accounts.length > 0);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const handleUpdateJob = (id) => {
    setJobs(
      jobs.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "Active" ? "Paused" : "Active" }
          : job
      )
    );
  };

  const handleDeleteJob = async (jobId) => {
    try {
      // Delete the job from the database
      const response = await fetch(
        `https://data.triggerx.network/api/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job from the database");
      }

      toast.success("Job deleted successfully");

      // Fetch the updated job details
      await fetchJobDetails();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job: " + error.message);
    }
  };

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
  };

  const handleJobEdit = async (e) => {
    e.preventDefault();

    try {
      const jobCreatorContract = await getJobCreatorContract();

      const timeframeInSeconds =
        selectedJob.timeframe.years * 31536000 +
        selectedJob.timeframe.months * 2592000 +
        selectedJob.timeframe.days * 86400;

      const intervalInSeconds =
        selectedJob.timeInterval.hours * 3600 +
        selectedJob.timeInterval.minutes * 60 +
        selectedJob.timeInterval.seconds;

      const argType =
        selectedJob.argType === "None"
          ? 0
          : selectedJob.argType === "Static"
          ? 1
          : selectedJob.argType === "Dynamic"
          ? 2
          : 0;

      const result = await jobCreatorContract.updateJob(
        selectedJob.id,
        selectedJob.type,
        timeframeInSeconds,
        selectedJob.contractAddress,
        selectedJob.targetFunction,
        intervalInSeconds,
        argType,
        [],
        selectedJob.apiEndpoint
      );

      console.log("Job updated successfully:", result);
      toast.success("Job updated successfully");

      // Refresh job details after update
      await fetchJobDetails();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Error updating job: " + error.message);
    }
  };

  const handleChangeJobField = (field, value) => {
    setSelectedJob({ ...selectedJob, [field]: value });
  };

  const handleChangeTimeframe = (subfield, value) => {
    setSelectedJob({
      ...selectedJob,
      timeframe: { ...selectedJob.timeframe, [subfield]: parseInt(value) || 0 },
    });
  };

  const handleChangeTimeInterval = (subfield, value) => {
    setSelectedJob({
      ...selectedJob,
      timeInterval: {
        ...selectedJob.timeInterval,
        [subfield]: parseInt(value) || 0,
      },
    });
  };

  const { stakeRegistryAddress, stakeRegistryImplAddress, stakeRegistryABI } =
    useStakeRegistry();

  const fetchTGBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const stakeRegistryContract = new ethers.Contract(
        stakeRegistryAddress,
        ["function getStake(address) view returns (uint256, uint256)"], // Assuming getStake returns (TG balance, other value)
        provider
      );

      const [_, tgBalance] = await stakeRegistryContract.getStake(userAddress);
      // console.log('Raw TG Balance:', tgBalance.toString());
      setTgBalance(ethers.formatEther(tgBalance));
    } catch (error) {
      console.error("Error fetching TG balance:", error);
      toast.error("Failed to fetch TG balance");
    }
  };

  useEffect(() => {
    const checkConnectionAndBalance = async () => {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setConnected(accounts.length > 0);
      if (accounts.length > 0) {
        fetchTGBalance();
      }
    };
    checkConnectionAndBalance();
  }, []);

  // const handleStake = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const signer = await provider.getSigner();
  //     const stakingContract = new ethers.Contract(
  //       stakeRegistryAddress,
  //       ['function stake() payable'],
  //       signer
  //     );

  //     const tx = await stakingContract.stake({
  //       value: ethers.parseEther(stakeAmount)
  //     });
  //     await tx.wait();

  //     toast.success('Staking successful!');
  //     fetchTGBalance();
  //     setStakeModalVisible(false);
  //   } catch (error) {
  //     console.error('Error staking:', error);
  //     toast.error('Staking failed: ' + error.message);
  //   }
  // };
  const handleStake = async (e) => {
    e.preventDefault();
    try {
      // Input validation
      if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
        toast.error("Please enter a valid stake amount");
        return;
      }

      const signer = await provider.getSigner();

      // First, verify the contract exists at the address
      const code = await provider.getCode(stakeRegistryAddress);
      if (code === "0x" || code === "") {
        throw new Error("No contract found at the specified address");
      }

      // Create contract instance with full ABI interface
      const stakingContract = new ethers.Contract(
        stakeRegistryAddress,
        [
          // Include full function signature
          "function stake() external payable",
          // You might also need these depending on your contract
          "function withdraw() external",
          "function getStakeBalance() external view returns (uint256)",
        ],
        signer
      );

      // Estimate gas before sending transaction
      const gasEstimate = await stakingContract.stake.estimateGas({
        value: ethers.parseEther(stakeAmount.toString()),
      });

      // Add 20% buffer to gas estimate
      const gasLimit = Math.floor(gasEstimate * 1.2);

      // Send transaction with explicit gas limit
      const tx = await stakingContract.stake({
        value: ethers.parseEther(stakeAmount.toString()),
        gasLimit: gasLimit,
      });

      // Wait for transaction with status updates
      toast.info("Transaction submitted. Waiting for confirmation...");
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success("Staking successful!");
        await fetchTGBalance();
        setStakeModalVisible(false);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error staking:", error);

      // More user-friendly error messages
      if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds for staking");
      } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        toast.error("Unable to estimate gas. The transaction might fail.");
      } else if (error.message.includes("user rejected")) {
        toast.error("Transaction rejected by user");
      } else {
        toast.error(`Staking failed: ${error.message}`);
      }
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen  text-white flex flex-col justify-center items-center">
        <div className="bg-white/10 p-8 rounded-lg backdrop-blur-xl border border-white/10 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Wallet Not Connected
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Please connect your wallet to access the dashboard.
          </p>
          <div className="flex justify-center">
            <Link to="/" className="px-6 py-3 bg-white rounded-lg ">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen  flex justify-center items-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="fixed inset-0  pointer-events-none" />
      <div className="fixed  pointer-events-none" />

      {/* <div className="relative">
        <div className="absolute inset-0 " />
        <div className="container mx-auto px-6 py-6 relative">
          <div className="flex justify-center ml-100">
            <div className="flex items-center mb-4 mt-14">
              <div>
                <img src={logo} alt="Logo" />
              </div>
              <h1 className="text-4xl font-bold bg-clip-text text-white">
                Dashboard
              </h1>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-6 py-8 lg:my-30 md:my-30 my-20 sm:my-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
                Active Jobs
              </h2>
              {jobDetails.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-[#A2A2A2]">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-[#A2A2A2]">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-[#A2A2A2]">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-[#A2A2A2]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobDetails.map((job) => (
                        <tr key={job.id} className="border-b border-white/5">
                          <td className="px-4 py-3 text-white">{job.id}</td>
                          <td className="px-4 py-3 text-white">{job.type}</td>
                          <td className="px-4 py-3 text-white">
                            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-white">
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 space-x-2 text-white">
                            <button
                              onClick={() => handleOpenModal(job)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-all duration-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <h4 className="text-center py-8 text-[#A2A2A2]">
                  No active jobs found. Create your first job to get started.
                </h4>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
                Your Balance
              </h3>
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <p className="text-[#A2A2A2] text-md mb-2 font-bold tracking-wider">
                  Total TG Balance
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
                  {tgBalance} TG
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => setStakeModalVisible(true)}
                  className="block w-full px-8 py-4 bg-white rounded-lg text-lg font-semibold text-center text-black"
                >
                  Stake ETH
                </button>

                <Link
                  to="/create-job"
                  className="block w-full px-8 py-4 bg-white rounded-lg text-lg font-semibold text-center text-black"
                >
                  Create New Job
                </Link>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
                Statistics
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center">
                  <p className="text-[#A2A2A2] text-md mb-2 font-bold tracking-wider">
                    Total Jobs
                  </p>
                  <p className="font-semibold text-white">
                    {jobDetails.length}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#A2A2A2] text-md mb-2 font-bold tracking-wider">
                    Active Jobs
                  </p>
                  <p className="font-semibold">
                    {jobDetails.filter((job) => job.status === "Active").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalVisible && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className=" p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
              Update Job
            </h2>
            <form onSubmit={handleJobEdit} className="space-y-6">
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalVisible(false)}
                  className="flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {stakeModalVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
              Stake ETH
            </h2>
            <form onSubmit={handleStake} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#3C3C3C] rounded-lg focus:outline-none  text-white"
                  placeholder="Enter ETH amount"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-white rounded-lg text-black font-semibold"
                >
                  Stake
                </button>
                <button
                  type="button"
                  onClick={() => setStakeModalVisible(false)}
                  className="flex-1 px-6 py-3 bg-white/10 rounded-lg  hover:bg-white/20 "
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
