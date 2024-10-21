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
    <div className="min-h-screen bg-[#0A0F1C] text-white pt-32 pb-20">
      {/* Single gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        {/* Rest of the component structure remains the same */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Create Automation Job
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Set up your automated blockchain tasks with precise conditions and parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Panels */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                About Keeper Network
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Keeper Network is an innovative decentralized network of nodes that automate smart contract executions and maintenance tasks on various blockchain networks. It ensures that critical operations are performed reliably and on time.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose Trigg3rX?
              </h3>
              <ul className="space-y-3 text-gray-300">
                {["Advanced cross-chain automation", "Seamless integration with Ethereum network", "User-friendly interface", "Reliable and secure execution", "Customizable parameters"].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <form onSubmit={(e) => { e.preventDefault(); estimateFee(); }} className="space-y-6">
                {/* Job Type */}
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                  <select
                    id="jobType"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-[#1A1F2C] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                    required
                  >
                    {/* <option value="" disabled>Select Job Type</option> */}
                    <option value="Time">Time</option>
                    <option value="Condition" disabled>Condition</option>
                    <option value="Event" disabled>Event</option>
                  </select>
                </div>

                {/* Timeframe Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timeframe</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Years', 'Months', 'Days'].map((unit) => (
                      <div key={unit}>
                        <label className="block text-xs text-gray-400 mb-1">{unit}</label>
                        <input
                          type="number"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                          placeholder={unit}
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contract Details */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-300 mb-2">Contract Address</label>
                    <input
                      type="text"
                      id="contractAddress"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contractABI" className="block text-sm font-medium text-gray-300 mb-2">Contract ABI</label>
                    <textarea
                      id="contractABI"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="targetFunction" className="block text-sm font-medium text-gray-300 mb-2">Target Function</label>
                    <input
                      type="text"
                      id="targetFunction"
                      placeholder="getTask(uint256,uint256)"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Time Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Interval</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Hours', 'Minutes', 'Seconds'].map((unit) => (
                      <div key={unit}>
                        <label className="block text-xs text-gray-400 mb-1">{unit}</label>
                        <input
                          type="number"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                          placeholder={unit}
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arguments Section */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="argType" className="block text-sm font-medium text-gray-300 mb-2">Argument Type</label>
                    <select
                      id="argType"
                      value={argType}
                      onChange={(e) => {
                        setArgType(e.target.value);
                        if (e.target.value !== 'Dynamic') {
                          setArguments('');
                          setApiEndpoint('');
                        }
                      }}
                      className="w-full bg-[#1A1F2C] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                    >
                      <option value="None">None</option>
                      <option value="Static">Static</option>
                      <option value="Dynamic">Dynamic</option>
                    </select>
                  </div>

                  {/* Conditional Fields Based on Argument Type */}
                  {argType === 'Static' && (
                    <div>
                      <label htmlFor="arguments" className="block text-sm font-medium text-gray-300 mb-2">
                        Arguments (comma-separated)
                      </label>
                      <input
                        type="text"
                        id="arguments"
                        value={userArguments}
                        onChange={(e) => setArguments(e.target.value)}
                        className="w-full bg-[#1A1F2C] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                        placeholder="Enter arguments separated by commas"
                      />
                    </div>
                  )}

                  {argType === 'Dynamic' && (
                    <div>
                      <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-300 mb-2">
                        API Endpoint
                      </label>
                      <input
                        type="text"
                        id="apiEndpoint"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="w-full bg-[#1A1F2C] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                        placeholder="Enter API endpoint URL"
                      />
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Create Job
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal styling to match theme */}
      <Modal
        isOpen={false}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0A0F1C] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Estimated Fee
        </h2>
        <p className="text-gray-300 mb-6">The estimated fee for creating this job is: 0 ETH</p>
        <div className="flex gap-4">
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            Stake
          </button>
          <button className="flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
  
}


export default CreateJobPage;
