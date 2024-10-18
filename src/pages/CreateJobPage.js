import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import axios from 'axios';
import { InfuraProvider } from "ethers"

function CreateJobPage() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState('');
  const [timeframe, setTimeframe] = useState({ years: 0, months: 0, days: 0 });
  const [timeframeInSeconds, setTimeframeInSeconds] = useState(0);
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState('');
  const [targetFunction, setTargetFunction] = useState('');
  const [timeInterval, setTimeInterval] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [intervalInSeconds, setIntervalInSeconds] = useState(0);
  const [argType, setArgType] = useState('None');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ethAmount, setEthAmount] = useState(0);
  const [argumentsInBytes, setArgumentsInBytes] = useState([]);
  const [userArguments, setArguments] = useState('');
  const [argsArray, setArgArray] = useState([]);

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

  const ETHERSCAN_API_KEY = 'U5X9SJAFNJY7FS3TZWMWTVYJZ7Q1K6QJKM';

  const handleContractAddressChange = async (e) => {
    const address = e.target.value;
    setContractAddress(address);

    if (ethers.isAddress(address)) {
      const url = `https://api-sepolia-optimism.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
      try {
        const response = await axios.get(url);
        const data = response.data;
        console.log(data);
        if (data.status === '1') {
          console.log('ABI fetched successfully');
          setContractABI(data.result); // ABI is returned as a JSON string
        } else {
          console.error(`Failed to fetch ABI: ${data.message}`);
          if (data.message === 'NOTOK') {
            console.error(`Contract address ${contractAddress} might not be verified on Etherscan or there is another issue.`);
          }
          throw new Error(`Failed to fetch ABI: ${data.message}`);
        }
      } catch (error) {
        console.error('Error fetching ABI:', error.message);
        throw error;
      }
    } else {
      setContractABI('');
    }
  };

  const handleTimeframeChange = (field, value) => {
    setTimeframe(prev => {
      const updatedTimeframe = { ...prev, [field]: parseInt(value) || 0 };
      const updatedTimeframeInSeconds = (updatedTimeframe.years * 31536000) + (updatedTimeframe.months * 2592000) + (updatedTimeframe.days * 86400);
      setTimeframeInSeconds(updatedTimeframeInSeconds);
      return updatedTimeframe;
    });
  };

  const handleTimeIntervalChange = (field, value) => {
    setTimeInterval(prev => {
      const updatedTimeInterval = { ...prev, [field]: parseInt(value) || 0 };
      const updatedIntervalInSeconds = (updatedTimeInterval.hours * 3600) + (updatedTimeInterval.minutes * 60) + updatedTimeInterval.seconds;
      setIntervalInSeconds(updatedIntervalInSeconds);
      return updatedTimeInterval;
    });
  };

  const handleArgumentsChange = (e) => {
    const input = e.target.value;
    setArguments(input);

    const argsArray = input.split(',').map(arg => arg.trim());
    setArgArray(argsArray);
    console.log(argsArray);

    const bytesArray = argsArray.map(arg => {
      const hexValue = ethers.toBeHex(arg); // Convert to hex
      return hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`;
    });
    setArgumentsInBytes(bytesArray);
    console.log(bytesArray);
  };


  const estimateFee = async () => {
    try {
      // Ensure we have a provider connected to OP Sepolia
      // const provider = new ethers.providers.JsonRpcProvider('https://opt-sepolia.g.alchemy.com/v2/9eCzjtGExJJ6c_WwQ01h6Hgmj8bjAdrc');
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const functionFragment = contract.interface.getFunction(targetFunction);
      console.log("function fragmenttttttttttttt", functionFragment)

      const params = functionFragment.inputs.map((input, index) => {
        if (index < argsArray.length) {
          return argsArray[index];
        }
        // Add default values here if needed
      });

      console.log('paraaaaaa', params);
      // Now try to estimate gas
      const gasEstimate = await contract[functionFragment.name].estimateGas(...params);
      console.log('Gas estimation:', gasEstimate.toString());

      // Get the current gas price
      const gasPrice = (await provider.getFeeData()).gasPrice;
      console.log('gas price', gasPrice);

      // Calculate the fee in wei
      const feeInWei = gasEstimate*gasPrice;

      // Convert wei to ETH
      const feeInEth = ethers.formatEther(feeInWei);

      // Calculate the overall fee based on your time frame and interval
      const overallFee = parseFloat(feeInEth) * Math.ceil(timeframeInSeconds / intervalInSeconds);

      const formattedFee = ethers.formatEther(ethers.parseEther(overallFee.toString()));

      console.log('Estimated fee in ETH:', overallFee);
      console.log('Estimated fee in ETH:', typeof overallFee);

      setEstimatedFee(overallFee);
      setEthAmount(formattedFee); // Set the ETH amount to stake
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error estimating fee:', error);
      toast.error('Error estimating fee: ' + error.message);
    }
  };

  const handleStake = async () => {
    await handleSubmit(ethAmount);
    setIsModalOpen(false);
  };

  const formatVerySmallNumber = (num) => {
    if (num < 1e-6) {
      // For very small numbers, ensure we get proper decimal representation
      return num.toLocaleString('fullwide', {
        useGrouping: false,
        minimumFractionDigits: 0,
        maximumFractionDigits: 18
      });
    }
    return num.toString();
  };
  

  const handleSubmit = async (ethAmount) => {
    try {

      const formatEthAmount = (amount) => {
        // Convert from scientific notation to a fixed decimal string
        const decimalStr = Number(amount).toFixed(18);
        // Remove trailing zeros after decimal point
        return decimalStr.replace(/\.?0+$/, "");
      };

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Replace with the actual address of your deployed JobCreator contract on OP Sepolia
      const jobCreatorContractAddress = '0x98a170b9b24aD4f42B6B3630A54517fd7Ff3Ac6d'; // Update this
      const jobCreatorABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"jobId","type":"uint32"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"}],"name":"JobCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"jobId","type":"uint32"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"stakeRefunded","type":"uint256"}],"name":"JobDeleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"jobId","type":"uint32"}],"name":"JobUpdated","type":"event"},{"inputs":[{"internalType":"uint32","name":"jobId","type":"uint32"},{"internalType":"uint32","name":"taskId","type":"uint32"}],"name":"addTaskId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"jobType","type":"string"},{"internalType":"uint32","name":"timeframe","type":"uint32"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"string","name":"targetFunction","type":"string"},{"internalType":"uint256","name":"timeInterval","type":"uint256"},{"internalType":"enum TriggerXJobManager.ArgType","name":"argType","type":"uint8"},{"internalType":"bytes[]","name":"arguments","type":"bytes[]"},{"internalType":"string","name":"apiEndpoint","type":"string"}],"name":"createJob","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint32","name":"jobId","type":"uint32"},{"internalType":"uint256","name":"stakeConsumed","type":"uint256"}],"name":"deleteJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"jobId","type":"uint32"},{"internalType":"uint256","name":"argIndex","type":"uint256"}],"name":"getJobArgument","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"jobId","type":"uint32"}],"name":"getJobArgumentCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"","type":"uint32"}],"name":"jobs","outputs":[{"internalType":"uint32","name":"jobId","type":"uint32"},{"internalType":"string","name":"jobType","type":"string"},{"internalType":"string","name":"status","type":"string"},{"internalType":"uint32","name":"timeframe","type":"uint32"},{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"string","name":"targetFunction","type":"string"},{"internalType":"uint256","name":"timeInterval","type":"uint256"},{"internalType":"enum TriggerXJobManager.ArgType","name":"argType","type":"uint8"},{"internalType":"string","name":"apiEndpoint","type":"string"},{"internalType":"address","name":"jobCreator","type":"address"},{"internalType":"uint256","name":"stakeAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"jobId","type":"uint32"},{"internalType":"string","name":"jobType","type":"string"},{"internalType":"uint32","name":"timeframe","type":"uint32"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"string","name":"targetFunction","type":"string"},{"internalType":"uint256","name":"timeInterval","type":"uint256"},{"internalType":"enum TriggerXJobManager.ArgType","name":"argType","type":"uint8"},{"internalType":"bytes[]","name":"arguments","type":"bytes[]"},{"internalType":"string","name":"apiEndpoint","type":"string"},{"internalType":"uint256","name":"stakeAmount","type":"uint256"}],"name":"updateJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userJobs","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userJobsCount","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userTotalStake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Add your contract ABI here
      const jobCreatorContract = new ethers.Contract(jobCreatorContractAddress, jobCreatorABI, signer);

      console.log('Creating job');

      const formattedAmount = formatVerySmallNumber(ethAmount);;
      console.log('Formatted amount:', formattedAmount);

      const tx = await jobCreatorContract.createJob(
        jobType,
        timeframeInSeconds,
        contractAddress,
        targetFunction.match(/(\w+)\(/)[1],
        intervalInSeconds,
        argType === 'None' ? 0 : argType === 'Static' ? 1 : argType === 'Dynamic' ? 2 : 0,
        argumentsInBytes,
        apiEndpoint,
        {
          value: ethers.parseEther(formattedAmount)
          // value: ethers.formatEther(ethers.parseEther(ethAmount.toString()))
        }
      );

      await tx.wait();
      console.log('Job created successfully:', tx.hash);
      toast.success('Job created successfully!');

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Error creating job: ' + error.message);
    }
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
                    <stop offset="0%" style={{ stopColor: "#3498db", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#2980b9", stopOpacity: 1 }} />
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
                By leveraging Keeper Network through Trigg3rX, you can automate your Ethereum smart contracts with ease and efficiency.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Why Choose Trigg3rX?</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Advanced cross-chain automation</li>
                <li>Seamless integration with Ethereum network</li>
                <li>User-friendly interface for job creation</li>
                <li>Reliable and secure execution of tasks</li>
                <li>Customizable job parameters</li>
              </ul>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Create a New Job</h2>
            <form onSubmit={(e) => { e.preventDefault(); estimateFee();}} className="space-y-4">
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
                <label htmlFor="targetFunction" className="block mb-1">Target Function signature</label>
                <input
                  type="text"
                  placeholder='getTask(uint256,uint256)'
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
                  onChange={(e) => {
                    setArgType(e.target.value);
                    if (e.target.value !== 'Dynamic') {
                      setArguments(''); // Clear arguments if not dynamic
                      setArgumentsInBytes([]); // Clear bytes array
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md text-gray-800"
                >
                  <option value="None">None</option>
                  <option value="Static">Static</option>
                  <option value="Dynamic">Dynamic</option>
                </select>
              </div>
              {argType === 'Static' && (
                <div>
                  <label htmlFor="arguments" className="block mb-1">Arguments (comma-separated)</label>
                  <input
                    type="text"
                    id="arguments"
                    value={userArguments}
                    onChange={handleArgumentsChange}
                    className="w-full px-3 py-2 border rounded-md text-gray-800"
                    placeholder="Enter arguments separated by commas"
                  />
                </div>
              )}
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
      {/* Modal for Fee Estimation */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Estimate Fee" appElement={document.getElementById('root')}>
        <h2 className="text-xl font-bold">Estimated Fee</h2>
        <p>The estimated fee for creating this job is: {estimatedFee} ETH</p>
        <button onClick={handleStake} className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
          Stake
        </button>
        <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
          Cancel
        </button>
      </Modal>
    </div>
  );
}

export default CreateJobPage;
