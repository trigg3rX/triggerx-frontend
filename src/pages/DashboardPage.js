import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [jobs, setJobs] = useState([]);


  // const jobs = [];
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const logoRef = useRef(null);


  useEffect(() => {
    // fetchJobDetails();

    const logo = logoRef.current;
    if (logo) {
      logo.style.transform = 'rotateY(0deg)';
      logo.style.transition = 'transform 1s ease-in-out';

      const rotatelogo = () => {
        logo.style.transform = 'rotateY(360deg)';
        setTimeout(() => {
          logo.style.transform = 'rotateY(0deg)';
        }, 1000);
      };

      const interval = setInterval(rotatelogo, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const getJobCreatorContract = async () => {
    const signer = await provider.getSigner();

    const jobCreatorContractAddress = '0x98a170b9b24aD4f42B6B3630A54517fd7Ff3Ac6d'; // Update this
    const jobCreatorABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint32", "name": "jobId", "type": "uint32" }, { "indexed": true, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "stakeAmount", "type": "uint256" }], "name": "JobCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint32", "name": "jobId", "type": "uint32" }, { "indexed": true, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "stakeRefunded", "type": "uint256" }], "name": "JobDeleted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint32", "name": "jobId", "type": "uint32" }], "name": "JobUpdated", "type": "event" }, { "inputs": [{ "internalType": "uint32", "name": "jobId", "type": "uint32" }, { "internalType": "uint32", "name": "taskId", "type": "uint32" }], "name": "addTaskId", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "jobType", "type": "string" }, { "internalType": "uint32", "name": "timeframe", "type": "uint32" }, { "internalType": "address", "name": "contractAddress", "type": "address" }, { "internalType": "string", "name": "targetFunction", "type": "string" }, { "internalType": "uint256", "name": "timeInterval", "type": "uint256" }, { "internalType": "enum TriggerXJobManager.ArgType", "name": "argType", "type": "uint8" }, { "internalType": "bytes[]", "name": "arguments", "type": "bytes[]" }, { "internalType": "string", "name": "apiEndpoint", "type": "string" }], "name": "createJob", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "jobId", "type": "uint32" }, { "internalType": "uint256", "name": "stakeConsumed", "type": "uint256" }], "name": "deleteJob", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "jobId", "type": "uint32" }, { "internalType": "uint256", "name": "argIndex", "type": "uint256" }], "name": "getJobArgument", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "jobId", "type": "uint32" }], "name": "getJobArgumentCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "name": "jobs", "outputs": [{ "internalType": "uint32", "name": "jobId", "type": "uint32" }, { "internalType": "string", "name": "jobType", "type": "string" }, { "internalType": "string", "name": "status", "type": "string" }, { "internalType": "uint32", "name": "timeframe", "type": "uint32" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }, { "internalType": "address", "name": "contractAddress", "type": "address" }, { "internalType": "string", "name": "targetFunction", "type": "string" }, { "internalType": "uint256", "name": "timeInterval", "type": "uint256" }, { "internalType": "enum TriggerXJobManager.ArgType", "name": "argType", "type": "uint8" }, { "internalType": "string", "name": "apiEndpoint", "type": "string" }, { "internalType": "address", "name": "jobCreator", "type": "address" }, { "internalType": "uint256", "name": "stakeAmount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "jobId", "type": "uint32" }, { "internalType": "string", "name": "jobType", "type": "string" }, { "internalType": "uint32", "name": "timeframe", "type": "uint32" }, { "internalType": "address", "name": "contractAddress", "type": "address" }, { "internalType": "string", "name": "targetFunction", "type": "string" }, { "internalType": "uint256", "name": "timeInterval", "type": "uint256" }, { "internalType": "enum TriggerXJobManager.ArgType", "name": "argType", "type": "uint8" }, { "internalType": "bytes[]", "name": "arguments", "type": "bytes[]" }, { "internalType": "string", "name": "apiEndpoint", "type": "string" }, { "internalType": "uint256", "name": "stakeAmount", "type": "uint256" }], "name": "updateJob", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "userJobs", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userJobsCount", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userTotalStake", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]; // Add your contract ABI here
    const jobCreatorContract = new ethers.Contract(jobCreatorContractAddress, jobCreatorABI, signer);
    return jobCreatorContract;
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobCreatorContract = await getJobCreatorContract();

        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        console.log(userAddress, 'addresss');

        const userJobsCount = await jobCreatorContract.userJobsCount(userAddress);
        console.log('Number of jobs:', userJobsCount.toString());

        const tempJobs = [];
        for (let i = 0; i < userJobsCount; i++) {
          const jobId = await jobCreatorContract.userJobs(userAddress, i);
          console.log(`Job ID ${i}:`, jobId.toString());

          const jobDetail = await jobCreatorContract.jobs(jobId);
          console.log(`Job Detail ${i}:`, jobDetail);

          const formattedJob = {
            id: jobId.toString(),
            type: jobDetail.type || jobDetail[1],
            status: jobDetail.status || jobDetail[2],
            timeframe: (jobDetail.timeframe || jobDetail[3]),
            gasLimit: (jobDetail.gasLimit || jobDetail[4]),
            contractAddress: jobDetail.contractAddress || jobDetail[5],
            targetFunction: jobDetail.targetFunction || jobDetail[6],
            interval: (jobDetail.interval || jobDetail[7]).toString(),
            argType: jobDetail.argType || jobDetail[8],
            apiEndpoint: jobDetail.apiEndpoint || jobDetail[9],
            owner: jobDetail.owner || jobDetail[10],
            credit: (jobDetail.credit || jobDetail[11])
          };

          console.log(`Formatted Job ${i}:`, formattedJob);
          tempJobs.push(formattedJob);
        }

        console.log('All formatted jobs:', tempJobs);
        setJobDetails(tempJobs);
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to fetch job details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();

    // Event listener for account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        fetchJobDetails(); // Call fetchJobDetails when the account changes
      } else {
        console.log('Please connect to MetaMask.');
      }
    };

    // Listen for account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Cleanup function to remove the event listener
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [window.ethereum]);





  const handleUpdateJob = (id) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, status: job.status === 'Active' ? 'Paused' : 'Active' } : job
    ));
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const jobCreatorContract = await getJobCreatorContract();
      await jobCreatorContract.deleteJob(jobId, 0.000000000000001);
      toast.success('Job deleted successfully');
      // Refresh job list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
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
    const jobCreatorContract = await getJobCreatorContract();

    try {
      // Convert timeframe and timeInterval to seconds
      const timeframeInSeconds = (selectedJob.timeframe.years * 31536000) + (selectedJob.timeframe.months * 2592000) + (selectedJob.timeframe.days * 86400);
      const intervalInSeconds = (selectedJob.timeInterval.hours * 3600) + (selectedJob.timeInterval.minutes * 60) + selectedJob.timeInterval.seconds;

      // Call the updateJob function on the contract
      const result = await jobCreatorContract.updateJob(
        selectedJob.id,
        selectedJob.type,
        timeframeInSeconds,
        selectedJob.contractAddress,
        selectedJob.targetFunction,
        intervalInSeconds,
        selectedJob.argType === 'None' ? 0 : selectedJob.argType === 'Static' ? 1 : selectedJob.argType === 'Dynamic' ? 2 : 0,
        [], // arguments (you might need to adjust this based on your contract)
        selectedJob.apiEndpoint
      );

      console.log('Job updated successfully:', result);
      toast.success('Job updated successfully');

      // Update the local state
      setJobs(jobs.map(job => job.id === selectedJob.id ? selectedJob : job));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Error updating job: ' + error.message);
    }
  };

  const handleChangeJobField = (field, value) => {
    setSelectedJob({ ...selectedJob, [field]: value });
  };

  const handleChangeTimeframe = (subfield, value) => {
    setSelectedJob({
      ...selectedJob,
      timeframe: { ...selectedJob.timeframe, [subfield]: parseInt(value) || 0 }
    });
  };

  const handleChangeTimeInterval = (subfield, value) => {
    setSelectedJob({
      ...selectedJob,
      timeInterval: { ...selectedJob.timeInterval, [subfield]: parseInt(value) || 0 }
    });
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col justify-center items-center">
        <div className="bg-white/10 p-8 rounded-lg backdrop-blur-xl border border-white/10 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Wallet Not Connected</h2>
          <p className="text-gray-300 text-center mb-6">
            Please connect your wallet to access the dashboard.
          </p>
          <div className="flex justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] text-white flex justify-center items-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">

      <div className="fixed inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      {/* Header Section with gradient overlay */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20" />
        <div className="container mx-auto px-6 py-8 relative">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div ref={logoRef} className="w-16 h-16 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
                      <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#A78BFA", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path d="M20,80 L80,20 M20,20 L80,80" stroke="url(#grad1)" strokeWidth="20" strokeLinecap="round" />
                  <path d="M30,70 L70,30 M30,30 L70,70" stroke="white" strokeWidth="10" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trigg3rX Dashboard
              </h1>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/create-job" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    Create Job
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Jobs Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Active Jobs
              </h2>
              {jobDetails.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-gray-300">ID</th>
                        <th className="px-4 py-3 text-left text-gray-300">Type</th>
                        <th className="px-4 py-3 text-left text-gray-300">Status</th>
                        <th className="px-4 py-3 text-left text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobDetails.map((job) => (
                        <tr key={job.id} className="border-b border-white/5">
                          <td className="px-4 py-3">{job.id}</td>
                          <td className="px-4 py-3">{job.type}</td>
                          <td className="px-4 py-3">
                            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 space-x-2">
                            <button
                              onClick={() => handleUpdateJob(job.id)}
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
                <div className="text-center py-8 text-gray-400">
                  No active jobs found. Create your first job to get started.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <Link
                  to="/create-job"
                  className="block w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center"
                >
                  Create New Job
                </Link>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Statistics
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center">
                  <span>Total Jobs</span>
                  <span className="font-semibold">{jobDetails.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Jobs</span>
                  <span className="font-semibold">
                    {jobDetails.filter(job => job.status === 'Active').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - keeping the existing modal code but updating its styles */}
      {isModalVisible && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#0A0F1C] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Update Job
            </h2>
            <form onSubmit={handleJobEdit} className="space-y-6">
              {/* Form fields here */}
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
    </div>
  );
};

export default DashboardPage;