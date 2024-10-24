import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal'; // Make sure to install react-modal
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreateJobPage() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState('');
  const [timeframe, setTimeframe] = useState({ years: 0, months: 0, days: 0 });
  const [timeframeInSeconds, settimeframeInSeconds] = useState(0);
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState('');
  const [targetFunction, setTargetFunction] = useState('');
  const [timeInterval, setTimeInterval] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [intervalInSeconds, setintervalInSeconds] = useState(0);
  const [argType, setArgType] = useState('None');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trxAmount, setTrxAmount] = useState(0);
  const [argumentsInBytes, setargumentsInBytes] = useState([]);
  const [userarguments, setArguments] = useState(''); // New state for arguments input
  const [argsArray, setargArray] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionInputs, setFunctionInputs] = useState([]);

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

  function extractFunctions(abi) {
    try {
      // Convert string to array if needed
      let abiArray;
      if (typeof abi === 'string') {
        try {
          abiArray = JSON.parse(abi);
        } catch (e) {
          throw new Error('Invalid ABI string format');
        }
      } else if (Array.isArray(abi)) {
        abiArray = abi;
      } else if (typeof abi === 'object') {
        // If abi is already parsed but not an array
        abiArray = [abi];
      } else {
        throw new Error('ABI must be an array, object, or valid JSON string');
      }
      // console.log(abi);

      // Ensure we have an array to work with
      if (!Array.isArray(abiArray)) {
        throw new Error('Processed ABI is not an array');
      }

      // Filter and map the functions
      const functions = abiArray
        .filter(item => item && item.type === 'function')
        .map(func => ({
          name: func.name || 'unnamed',
          inputs: func.inputs || [],
          outputs: func.outputs || [],
          stateMutability: func.stateMutability || 'nonpayable',
          payable: func.payable || false,
          constant: func.constant || false
        }));
      // console.log(functions);

      return functions;
    } catch (error) {
      console.error('Error processing ABI:', error);
      return []; // Return empty array instead of throwing error
    }
  }

  const handleContractAddressChange = async (e) => {
    const address = e.target.value;
    setContractAddress(address);

    if (address.length === 34) {
      try {
        const tronWeb = window.tronWeb;
        if (!tronWeb) {
          console.error('TronWeb not found. Please make sure TronLink is installed and connected to Nile testnet.');
          return;
        }

        const contract = await tronWeb.contract().at(address);
        const abi = JSON.stringify(contract.abi);

        if (abi) {

          const writableFunctions = extractFunctions(abi).filter(func =>
            func.stateMutability === 'nonpayable' || func.stateMutability === 'payable'
          );
          console.log(writableFunctions);
          setFunctions(writableFunctions);

          setContractABI(abi);
          console.log('ABI fetched successfully');
        } else {
          console.error('Error fetching ABI: ABI not found');
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
    setTimeframe(prev => {
      const updatedTimeframe = { ...prev, [field]: parseInt(value) || 0 };
      const updatedTimeframeInSeconds = (updatedTimeframe.years * 31536000) + (updatedTimeframe.months * 2592000) + (updatedTimeframe.days * 86400);
      settimeframeInSeconds(updatedTimeframeInSeconds);
      return updatedTimeframe;
    });
  };

  const handleTimeIntervalChange = (field, value) => {
    setTimeInterval(prev => {
      const updatedTimeInterval = { ...prev, [field]: parseInt(value) || 0 };
      const updatedIntervalInSeconds = (updatedTimeInterval.hours * 3600) + (updatedTimeInterval.minutes * 60) + updatedTimeInterval.seconds;
      setintervalInSeconds(updatedIntervalInSeconds);
      return updatedTimeInterval;
    });
  };

  const handleFunctionChange = (e) => {
    const selectedValue = e.target.value;
    setTargetFunction(selectedValue);

    // Find the selected function object
    const func = functions.find(f => `${f.name}(${f.inputs.map(input => input.type).join(',')})` === selectedValue);
    setSelectedFunction(func);

    if (func) {
      // Initialize inputs array with empty strings
      console.log('goooo', func);
      setFunctionInputs(func.inputs.map(() => ''));
      setargArray(func.inputs.map(() => '')); // Initialize argsArray with empty strings

    } else {
      setFunctionInputs([]);
      setargArray([]); // Clear argsArray if no function is selected
    }
  };

  const handleArgumentsChange = (e) => {
    const input = e.target.value;
    const tronWeb = window.tronWeb;

    setArguments(input);

    // Convert the input string to an array and then to bytes
    const argsArray = input.split(',').map(arg => arg.trim());
    setargArray(argsArray);
    console.log(argsArray);

    const bytesArray = argsArray.map(arg => {
      const hexValue = tronWeb.toHex(arg); // Convert to hex
      return hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`; // Ensure even-length
    }); // Convert to bytes


    // const bytesArray = argsArray.map(arg => tronWeb.toHex(arg)); // Convert to bytes
    setargumentsInBytes(bytesArray);
    console.log(bytesArray);
  };

  const estimateFee = async () => {
    try {
      const tronWeb = window.tronWeb;

      const functionSelector = targetFunction; // Use the target function from the form
      const options = {}; // Add any necessary options here

      // Parse the target function to get argument types
      const argTypes = functionSelector.match(/\(([^)]+)\)/)[1].split(',').map(type => type.trim());

      // Create parameters based on argTypes and argsArray
      const parameters = argTypes.map((type, index) => ({
        type: type,
        value: argsArray[index] ? (argsArray[index]) : 0 // Convert to integer or default to 0
      }));
      console.log('paraaaaaa', parameters);

      console.log('You have to stake this amount of TRX');
      const fee = await tronWeb.transactionBuilder.estimateEnergy(
        tronWeb.address.toHex(contractAddress),
        functionSelector,
        options,
        parameters,
      );
      ////
      const tempfee = parseInt(fee.energy_required, 10);
      console.log(tempfee);
      const overallfee = Math.ceil((tempfee * Math.floor((timeframeInSeconds / intervalInSeconds))) * 0.00021);

      console.log('hureeeeeeeee', overallfee);

      setEstimatedFee(overallfee);
      setTrxAmount(overallfee); // Set the TRX amount to stake
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error estimating fee:', error);
      toast.error('Error estimating fee: ' + error.message);
    }
  };

  const handlestake = async () => {
    await handleSubmit(trxAmount); // Call handleSubmit with the trxAmount
    setIsModalOpen(false); // Close the modal after stakeing
  };

  const handleSubmit = async (trxAmount) => {
    // e.preventDefault();
    try {
      const tronWeb = window.tronWeb;
      if (!tronWeb) {
        throw new Error('TronWeb not found. Please make sure TronLink is installed and connected to Nile testnet.');
      }

      // Replace with the actual address of your deployed JobCreator contract
      const jobCreatorContractAddress = 'TEsKaf2n8aF6pta7wyG5gwukzR4NoHre59';
      const jobCreatorContract = await tronWeb.contract().at(jobCreatorContractAddress);

      // Call the createJob function on the contract
      console.log('creating job');
      // const result = await jobCreatorContract.addTaskId(1,3).send();
      console.log('task added');
      // const trxAmount=1000;
      const result1 = await jobCreatorContract.createJob(
        jobType,
        timeframeInSeconds,
        contractAddress,
        targetFunction.match(/(\w+)\(/)[1],
        intervalInSeconds,
        argType === 'none' ? 0 : argType === 'static' ? 1 : argType === 'dynamic' ? 2 : 0,// argType,
        argumentsInBytes,//arguments in bytes
        apiEndpoint,
      ).send({
        feeLimit: 100000000, // Adjust based on your gas limits
        callValue: trxAmount * 1000000 // The TRX value to stake
      });

      console.log('Job created successfully:', result1);
      toast.success('Job created successfully!');

      navigate('/dashboard');
      // You can add further logic here, such as showing a success message or redirecting the user
    } catch (error) {
      console.error('Error creating job:', error);
      // Handle the error, e.g., show an error message to the user
      toast.error('Error creating job: ' + error.message);
    }
  };

  const handleInputChange = (index, value) => {
    const tronWeb = window.tronWeb;
    const newInputs = [...functionInputs];
    newInputs[index] = value;
    setFunctionInputs(newInputs);

    // Update argsArray whenever an input changes
    setargArray(newInputs);
    console.log(argsArray);

    const bytesArray = argsArray.map(arg => {
      const hexValue = tronWeb.toHex(arg); // Convert to hex
      return hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`;
    });
    setargumentsInBytes(bytesArray);
    console.log(bytesArray);
  };

  useEffect(() => {
    // Update argumentsInBytes when functionInputs change

    const bytesArray = functionInputs.map(arg => {
      const tronWeb = window.tronWeb;
      if (arg === '') return '0x'; // Return '0x' for empty inputs
      try {
        const hexValue = tronWeb.toHex(arg);
        return hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`;
      } catch (error) {
        console.error('Error converting input to hex:', error);
        return '0x'; // Return '0x' if conversion fails
      }
    });
    setargumentsInBytes(bytesArray);
  }, [functionInputs]);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white pt-12 pb-20 pl-10 pr-10">
      <div className="fixed inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

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
                  <option value="" disabled>Select Job Type</option>
                  <option value="Time">Time</option>
                  <option value="Condition" disabled>Condition</option>
                  <option value="Event" disabled>Event</option>
                </select>
              </div>

              {/* Timeframe Section with Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Timeframe</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
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
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
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
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
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

              <div className="space-y-6">
                <div>
                  <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-300 mb-2">Contract Address</label>
                  <input
                    type="text"
                    id="contractAddress"
                    value={contractAddress}
                    onChange={handleContractAddressChange}
                    placeholder="Your tron contract address on nile"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contractABI" className="block text-sm font-medium text-gray-300 mb-2">Contract ABI</label>
                  <textarea
                    id="contractABI"
                    value={contractABI}
                    onChange={(e) => setContractABI(e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="targetFunction" className="block text-sm font-medium text-gray-300 mb-2">Target Function</label>
                  <select
                    id="targetFunction"
                    value={targetFunction}
                    onChange={handleFunctionChange}
                    className="w-full bg-[#1A1F2C] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                    required
                  >
                    <option value="" className="bg-[#1A1F2C] text-white">Select a function</option>
                    {functions.map((func, index) => {
                      const signature = `${func.name}(${func.inputs.map(input => input.type).join(',')})`;
                      return (
                        <option key={index} value={signature} className="bg-[#1A1F2C] text-white">
                          {signature}
                        </option>
                      );
                    })}
                  </select>
                  {functions.length === 0 && contractAddress && (
                    <p className="mt-2 text-sm text-yellow-400">
                      No writable functions found. Make sure the contract is verified on Etherscan.
                    </p>
                  )}
                </div>
              </div>

              {/* Time Interval Section with Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Interval</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
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
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
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
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
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
                  {/* </div> */}
                </div>
              </div>

              {selectedFunction && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Function Arguments</label>
                  {selectedFunction.inputs.map((input, index) => (
                    <div key={index} className="mb-2">
                      <label className="block text-xs text-gray-400 mb-1">{input.name || `Argument ${index + 1}`} ({input.type})</label>
                      <input
                        type="text"
                        value={functionInputs[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
                        placeholder={`Enter ${input.type}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
                Create Job
              </button>
            </form>
          </div>
        </div>
      </div >
      {/* Modal for Fee Estimation */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Estimate Fee"
        // appElement={document.getElementById('root')}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0A0F1C] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Estimated Fee
        </h2>
        <p className="text-gray-300 mb-6">The estimated fee for creating this job is: {estimatedFee} ETH</p>
        <div className="flex gap-4">
          <button onClick={handlestake} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            Stake
          </button>
          <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CreateJobPage;
