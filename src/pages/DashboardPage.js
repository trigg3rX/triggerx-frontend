import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import new_logo from '../images/new_logo.png';

function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [connected, setConnected] = useState(false);
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

  const provider = new ethers.BrowserProvider(window.ethereum);

  const getJobCreatorContract = async () => {
    const signer = await provider.getSigner();
    const jobCreatorContractAddress = '0x98a170b9b24aD4f42B6B3630A54517fd7Ff3Ac6d';
    const jobCreatorABI = [
      // Contract ABI...
    ];
    return new ethers.Contract(jobCreatorContractAddress, jobCreatorABI, signer);
  };

  const fetchJobDetails = async () => {
    try {
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

        console.log(userAddress, 'address');

        // Fetch job details from the ScyllaDB API
        const response = await fetch(`https://data.triggerx.network/api/jobs/user/${userAddress}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details from the database');
        }

        const jobsData = await response.json();
        console.log('Fetched jobs data:', jobsData);

      const tempJobs = jobsData.map((jobDetail) => ({
        id: jobDetail.job_id,        // job_id
        type: mapJobType(jobDetail.jobType), // Map job_type ID to label
        status: jobDetail.status ? 'true' : 'false' // Convert boolean to string
      }));

        console.log('All formatted jobs:', tempJobs);
        setJobDetails(tempJobs);
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to fetch job details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

  // Helper function to map job type ID to label
  const mapJobType = (jobTypeId) => {
    // Convert jobTypeId to string to handle both string and number types
    const typeId = String(jobTypeId);
    
    switch (typeId) {
      case '1':
        return 'Time-based';
      case '2':
        return 'Event-based';
      case '3':
        return 'Condition-based';
      default:
        return 'Unknown';
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
        console.log('Please connect to MetaMask.');
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

  useEffect(() => {
    const checkConnection = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setConnected(accounts.length > 0);
    };

    checkConnection();

    const handleAccountsChanged = (accounts) => {
      setConnected(accounts.length > 0);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const handleUpdateJob = (id) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, status: job.status === 'Active' ? 'Paused' : 'Active' } : job
    ));
  };

  const handleDeleteJob = async (jobId) => {
    try {
      // Delete the job from the database
      const response = await fetch(`https://data.triggerx.network/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job from the database');
      }

      toast.success('Job deleted successfully');

      // Fetch the updated job details
      await fetchJobDetails();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job: ' + error.message);
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

      const timeframeInSeconds = (selectedJob.timeframe.years * 31536000) +
        (selectedJob.timeframe.months * 2592000) +
        (selectedJob.timeframe.days * 86400);

      const intervalInSeconds = (selectedJob.timeInterval.hours * 3600) +
        (selectedJob.timeInterval.minutes * 60) +
        selectedJob.timeInterval.seconds;

      const argType = selectedJob.argType === 'None' ? 0 :
        selectedJob.argType === 'Static' ? 1 :
          selectedJob.argType === 'Dynamic' ? 2 : 0;

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

      console.log('Job updated successfully:', result);
      toast.success('Job updated successfully');

      // Refresh job details after update
      await fetchJobDetails();
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

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20" />
        <div className="container mx-auto px-6 py-6 relative">
          <div className="flex justify-center ml-100">
            <div className="flex items-center mb-4 mt-14">
              <div ref={logoRef} className="w-16 h-16 mr-4">
                <img src={new_logo} alt="Logo" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TriggerX Dashboard
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <div className="text-center py-8 text-gray-400">
                  No active jobs found. Create your first job to get started.
                </div>
              )}
            </div>
          </div>

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

      {isModalVisible && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#0A0F1C] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
    </div>
  );
}

export default DashboardPage;