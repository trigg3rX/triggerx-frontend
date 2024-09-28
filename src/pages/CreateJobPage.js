import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function CreateJobPage() {
  const [jobType, setJobType] = useState('');
  const [timeframe, setTimeframe] = useState({ years: 0, months: 0, days: 0 });
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState('');
  const [targetFunction, setTargetFunction] = useState('');
  const [timeInterval, setTimeInterval] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [argType, setArgType] = useState('None');
  const [apiEndpoint, setApiEndpoint] = useState('');

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

  const handleContractAddressChange = async (e) => {
    const address = e.target.value;
    setContractAddress(address);

    if (address.length === 42) {  // Ethereum address length
      try {
        const response = await axios.get(`https://api-holesky.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=TQZ41F9SYE4QXFAZG6K6Z2G8NYHS356FGY`);
        
        if (response.data.status === '1') {
          setContractABI(response.data.result);
        } else {
          console.error('Error fetching ABI:', response.data.message);
          setContractABI('');
        }
      } catch (error) {
        console.error('Error fetching ABI:', error);
        setContractABI('');
      }
    } else {
      setContractABI('');
    }
  };

  const handleTimeframeChange = (field, value) => {
    setTimeframe(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const handleTimeIntervalChange = (field, value) => {
    setTimeInterval(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle job creation logic here
    console.log({ jobType, timeframe, contractAddress, contractABI, targetFunction, timeInterval, argType, apiEndpoint });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div ref={logoRef} className="w-16 h-16 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" className="w-full h-full">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#3498db", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#2980b9", stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <path d="M20,80 L80,20 M20,20 L80,80" stroke="url(#grad1)" strokeWidth="20" strokeLinecap="round" />
                <path d="M30,70 L70,30 M30,30 L70,70" stroke="white" strokeWidth="10" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold">Trigg3rX</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="/dashboard" className="hover:text-secondary transition-colors">Dashboard</a></li>
            </ul>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">About Keeper Network</h3>
              <p className="mb-4">
                Keeper Network is an innovative decentralized network of nodes that automate smart contract executions and maintenance tasks on various blockchain networks. It ensures that critical operations are performed reliably and on time.
              </p>
              <p>
                By leveraging Keeper Network through Trigg3rX, you can automate your TRON smart contracts with ease and efficiency.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Why Choose Trigg3rX?</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Advanced cross-chain automation</li>
                <li>Seamless integration with TRON network</li>
                <li>User-friendly interface for job creation</li>
                <li>Reliable and secure execution of tasks</li>
                <li>Customizable job parameters</li>
              </ul>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Create a New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="jobType" className="block mb-1">Job Type</label>
                <input
                  type="text"
                  id="jobType"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-gray-800"
                  required
                />
              </div>

              {/* Timeframe Section with Labels */}
              <div>
                <label className="block mb-1">Timeframe</label>
                <div className="flex space-x-2">
                  <div className="w-1/3">
                    <label className="block text-sm">Years</label>
                    <input
                      type="number"
                      value={timeframe.years}
                      onChange={(e) => handleTimeframeChange('years', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-gray-800"
                      placeholder="Years"
                      min="0"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm">Months</label>
                    <input
                      type="number"
                      value={timeframe.months}
                      onChange={(e) => handleTimeframeChange('months', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-gray-800"
                      placeholder="Months"
                      min="0"
                      max="11"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm">Days</label>
                    <input
                      type="number"
                      value={timeframe.days}
                      onChange={(e) => handleTimeframeChange('days', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-gray-800"
                      placeholder="Days"
                      min="0"
                      max="30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="contractAddress" className="block mb-1">Contract Address</label>
                <input
                  type="text"
                  id="contractAddress"
                  value={contractAddress}
                  onChange={handleContractAddressChange}
                  className="w-full px-3 py-2 border rounded-md text-gray-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="contractABI" className="block mb-1">Contract ABI</label>
                <textarea
                  id="contractABI"
                  value={contractABI}
                  onChange={(e) => setContractABI(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-gray-800"
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="targetFunction" className="block mb-1">Target Function</label>
                <input
                  type="text"
                  id="targetFunction"
                  value={targetFunction}
                  onChange={(e) => setTargetFunction(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-gray-800"
                  required
                />
              </div>

              {/* Time Interval Section with Labels */}
              <div>
                <label className="block mb-1">Time Interval</label>
                <div className="flex space-x-2">
                  <div className="w-1/3">
                    <label className="block text-sm">Hours</label>
                    <input
                      type="number"
                      value={timeInterval.hours}
                      onChange={(e) => handleTimeIntervalChange('hours', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-gray-800"
                      placeholder="Hours"
                      min="0"
                      max="23"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm">Minutes</label>
                    <input
                      type="number"
                      value={timeInterval.minutes}
                      onChange={(e) => handleTimeIntervalChange('minutes', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-gray-800"
                      placeholder="Minutes"
                      min="0"
                      max="59"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm">Seconds</label>
                    <input
                      type="number"
                      value={timeInterval.seconds}
                      onChange={(e) => handleTimeIntervalChange('seconds', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-gray-800"
                      placeholder="Seconds"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="argType" className="block mb-1">Argument Type</label>
                <select
                  id="argType"
                  value={argType}
                  onChange={(e) => setArgType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-gray-800"
                >
                  <option value="None">None</option>
                  <option value="Static">Static</option>
                  <option value="Dynamic">Dynamic</option>
                </select>
              </div>
              {argType === 'Dynamic' && (
                <div>
                  <label htmlFor="apiEndpoint" className="block mb-1">API Endpoint</label>
                  <input
                    type="text"
                    id="apiEndpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-gray-800"
                  />
                </div>
              )}
              <button type="submit" className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-opacity-80 transition-colors">
                Create Job
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateJobPage;
