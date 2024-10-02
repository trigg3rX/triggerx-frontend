import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function DashboardPage() {
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      type: 'Daily transfer', 
      status: 'Active', 
      lastRun: '2024-09-26', 
      nextRun: '2024-09-27',
      timeframe: { years: 0, months: 0, days: 1 },
      contractAddress: '0x1234567890123456789012345678901234567890',
      contractABI: '{"example": "ABI"}',
      targetFunction: 'transfer',
      timeInterval: { hours: 24, minutes: 0, seconds: 0 },
      argType: 'Static',
      apiEndpoint: ''
    },
    { id: 2, type: 'Weekly swap', status: 'Paused', lastRun: '2024-09-20', nextRun: 'N/A' },
    { id: 3, type: 'Monthly report', status: 'Active', lastRun: '2024-08-31', nextRun: '2024-09-30' },
  ]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(1000);
  const [chartData, setChartData] = useState([]);

  const logoRef = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
    // Simulating fetching chart data
    const generateChartData = () => {
      const data = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          balance: Math.floor(Math.random() * 500) + 750,
        });
      }
      setChartData(data);
    };

    generateChartData();
  }, []);

  const handleUpdateJob = (id) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status: job.status === 'Active' ? 'Paused' : 'Active' } : job
    ));
  };

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const handleClaimFaucet = () => {
    setTokenBalance(prevBalance => {
      const newBalance = prevBalance + 100;
      setChartData([...chartData, { date: new Date().toISOString().split('T')[0], balance: newBalance }]);
      return newBalance;
    });
  };

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
  };

  const handleJobEdit = (e) => {
    e.preventDefault();
    setJobs(jobs.map(job => (job.id === selectedJob.id ? selectedJob : job)));
    handleCloseModal();
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div ref={logoRef} className="w-16 h-16 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" className="w-full h-full">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
                    <stop offset="0%" style={{stopColor:"#3498db", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#2980b9", stopOpacity:1}} />
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
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Token Balance History</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff22', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Your Jobs</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-20">
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Last Run</th>
                      <th className="px-4 py-2 text-left">Next Run</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id} className="border-b border-white border-opacity-10">
                        <td className="px-4 py-2">{job.type}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${job.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{job.lastRun}</td>
                        <td className="px-4 py-2">{job.nextRun}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleUpdateJob(job.id)}
                            className="mr-2 text-sm bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded transition-colors"
                          >
                            {job.status === 'Active' ? 'Pause' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="mr-2 text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleOpenModal(job)}
                            className="text-sm bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded transition-colors"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Token Balance</h2>
              <p className="text-4xl font-bold mb-4">{tokenBalance} TRX</p>
              <button
                onClick={handleClaimFaucet}
                className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors w-full"
              >
                Claim Faucet
              </button>
            </div>
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