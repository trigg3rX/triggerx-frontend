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

  const handleArgumentsChange = (e) => {
    const input = e.target.value;
    const tronWeb = window.tronWeb;

    setArguments(input);

    // Convert the input string to an array and then to bytes
    const argsArray = input.split(',').map(arg => arg.trim());
    setargArray(argsArray);

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
      const overallfee = Math.ceil((tempfee*Math.floor((timeframeInSeconds / intervalInSeconds)))*0.00021);

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
        callValue: trxAmount*1000000 // The TRX value to stake
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
            <form onSubmit={(e) => { e.preventDefault(); estimateFee(); }} className="space-y-4">
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
                      setargumentsInBytes([]); // Clear bytes array
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
                    value={userarguments}
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
        <p>The estimated fee for creating this job is: {estimatedFee} TRX</p>
        <button onClick={handlestake} className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
          stake
        </button>
        <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
          Cancel
        </button>
      </Modal>
    </div>
  );
}

export default CreateJobPage;
