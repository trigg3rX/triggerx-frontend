import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

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
      await jobCreatorContract.deleteJob(jobId,0.000000000000001);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white flex justify-center items-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div ref={logoRef} className="w-16 h-16 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" className="w-full h-full">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
                    <stop offset="0%" style={{ stopColor: "#3498db", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#2980b9", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M20,80 L80,20 M20,20 L80,80" stroke="url(#grad1)" strokeWidth="20" strokeLinecap="round" />
                <path d="M30,70 L70,30 M30,30 L70,70" stroke="white" strokeWidth="10" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold">Trigg3rX Dashboard</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="/create-job" className="hover:text-secondary transition-colors">Create Job</a></li>
            </ul>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Your Jobs</h2>
              {jobDetails.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white border-opacity-20">
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Interval (sec)</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobDetails.map((job, index) => (
                        <tr key={`${job.id}-${index}`} className="border-b border-white border-opacity-10">
                          <td className="px-4 py-2">{job.id}</td>
                          <td className="px-4 py-2">{job.type}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${job.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                              }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">{job.interval}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleUpdateJob(job.id)}
                              className="mr-2 text-sm bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded transition-colors"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors"
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
                <p>No jobs found.</p>
              )}
            </div>
          </div>
          <div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <ul className="space-y-2">
                <li>
                  <a href="/create-job" className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                    Create New Job
                  </a>
                </li>
                <li>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
                    View Analytics
                  </button>
                </li>
                <li>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors">
                    Manage Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isModalVisible && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-2xl w-full m-4">
            <h2 className="text-xl font-bold mb-4">Update Job</h2>
            <form onSubmit={handleJobEdit} className="space-y-4">
              <div>
                <label htmlFor="jobType" className="block mb-1">Job Type</label>
                <input
                  type="text"
                  id="jobType"
                  value={selectedJob.type}
                  onChange={(e) => handleChangeJobField('type', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="jobStatus" className="block mb-1">Status</label>
                <select
                  id="jobStatus"
                  value={selectedJob.status}
                  onChange={(e) => handleChangeJobField('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Timeframe</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={selectedJob.timeframe.years}
                    onChange={(e) => handleChangeTimeframe('years', e.target.value)}
                    className="w-1/3 px-3 py-2 border rounded-md"
                    placeholder="Years"
                    min="0"
                  />
                  <input
                    type="number"
                    value={selectedJob.timeframe.months}
                    onChange={(e) => handleChangeTimeframe('months', e.target.value)}
                    className="w-1/3 px-3 py-2 border rounded-md"
                    placeholder="Months"
                    min="0"
                    max="11"
                  />
                  <input
                    type="number"
                    value={selectedJob.timeframe.days}
                    onChange={(e) => handleChangeTimeframe('days', e.target.value)}
                    className="w-1/3 px-3 py-2 border rounded-md"
                    placeholder="Days"
                    min="0"
                    max="30"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contractAddress" className="block mb-1">Contract Address</label>
                <input
                  type="text"
                  id="contractAddress"
                  value={selectedJob.contractAddress}
                  onChange={(e) => handleChangeJobField('contractAddress', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="contractABI" className="block mb-1">Contract ABI</label>
                <textarea
                  id="contractABI"
                  value={selectedJob.contractABI}
                  onChange={(e) => handleChangeJobField('contractABI', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="targetFunction" className="block mb-1">Target Function</label>
                <input
                  type="text"
                  id="targetFunction"
                  value={selectedJob.targetFunction}
                  onChange={(e) => handleChangeJobField('targetFunction', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Time Interval</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={selectedJob.timeInterval.hours}
                    onChange={(e) => handleChangeTimeInterval('hours', e.target.value)}
                    className="w-1/3 px-3 py-2 border rounded-md"
                    placeholder="Hours"
                    min="0"
                    max="23"
                  />
                  <input
                    type="number"
                    value={selectedJob.timeInterval.minutes}
                    onChange={(e) => handleChangeTimeInterval('minutes', e.target.value)}
                    className="w-1/3 px-3 py-2 border rounded-md"
                    placeholder="Minutes"
                    min="0"
                    max="59"
                  />
                  <input
                    type="number"
                    value={selectedJob.timeInterval.seconds}
                    onChange={(e) => handleChangeTimeInterval('seconds', e.target.value)}
                    className="w-1/3 px-3 py-2 border rounded-md"
                    placeholder="Seconds"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="argType" className="block mb-1">Argument Type</label>
                <select
                  id="argType"
                  value={selectedJob.argType}
                  onChange={(e) => handleChangeJobField('argType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="None">None</option>
                  <option value="Static">Static</option>
                  <option value="Dynamic">Dynamic</option>
                </select>
              </div>
              {selectedJob.argType === 'Dynamic' && (
                <div>
                  <label htmlFor="apiEndpoint" className="block mb-1">API Endpoint</label>
                  <input
                    type="text"
                    id="apiEndpoint"
                    value={selectedJob.apiEndpoint}
                    onChange={(e) => handleChangeJobField('apiEndpoint', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
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