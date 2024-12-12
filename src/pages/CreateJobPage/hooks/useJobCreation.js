import { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function useJobCreation() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState(0);
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [gasUnits, setGasUnits] = useState(0);
  const [argType, setArgType] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code_url, setCodeUrl] = useState('');
  const [scriptFunction, setScriptFunction] = useState('');

  const handleCodeUrlChange = (event) => {
    if(event && event.target){
      const url = event.target.value;
      setCodeUrl(url);
      console.log('Code URL changed to:', url);
    }
  };

  const estimateFee = async (contractAddress, contractABI, targetFunction, argsArray, timeframeInSeconds, intervalInSeconds) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const functionFragment = contract.interface.getFunction(targetFunction);

      const params = functionFragment.inputs.map((input, index) => {
        if (index < argsArray.length) {
          return argsArray[index];
        }
      });

      const gasEstimate = await contract[functionFragment.name].estimateGas(...params);
      const gasEstimateStr = gasEstimate.toString();
      setGasUnits(gasEstimateStr);
      console.log('Gas estimate:', gasEstimateStr);
      
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice;
      console.log('Gas price:', gasPrice.toString());
      
      const feeInWei = gasEstimate * gasPrice;
      const feeInEth = ethers.formatEther(feeInWei);
      console.log('Fee for one execution:', feeInEth, 'ETH');
      
      const executionCount = Math.ceil(timeframeInSeconds / intervalInSeconds);
      const overallFee = Number(feeInEth) * executionCount;
      console.log('Overall fee:', overallFee.toFixed(18), 'ETH');
      
      setEstimatedFee(overallFee.toFixed(18));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error estimating fee:', error);
      toast.error('Error estimating fee: ' + error.message);
    }
  };

  const handleSubmit = async (stakeRegistryAddress, stakeRegistryABI, contractAddress, targetFunction, argsArray, timeframeInSeconds, intervalInSeconds) => {
    if (!jobType || !contractAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this feature');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(stakeRegistryAddress, stakeRegistryABI, signer);

      let nextJobId;
      try {
        const latestIdResponse = await fetch('https://data.triggerx.network/api/jobs/latest-id', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Origin': 'https://triggerx.network'
          }
        });

        if (!latestIdResponse.ok) {
          throw new Error('Failed to fetch latest job ID');
        }

        const latestIdData = await latestIdResponse.json();
        nextJobId = latestIdData.latest_job_id + 1;
        console.log('Next job ID:', nextJobId);
      } catch (error) {
        console.error('Error fetching latest job ID:', error);
        nextJobId = 1;
      }

      const estimatedFeeInGwei = parseFloat(estimatedFee) * 1e9;
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainIdHex, 16).toString();

      const jobData = {
        job_id: nextJobId,
        jobType: jobType,
        user_address: signer.address,
        chain_id: chainIdDecimal,
        time_frame: timeframeInSeconds,
        time_interval: intervalInSeconds,
        contract_address: contractAddress,
        target_function: targetFunction,
        arg_type: argType,
        arguments: argsArray,
        status: true,
        job_cost_prediction: parseInt(gasUnits),
        script_function: scriptFunction,
        script_ipfs_url: code_url,
        stake_amount: estimatedFeeInGwei
      };
      console.log('Created job data:', jobData);

      console.log('Staking ETH amount:', estimatedFee);
      const tx = await contract.stake(
        ethers.parseEther(estimatedFee),
        { value: ethers.parseEther(estimatedFee) }
      );

      await tx.wait();
      console.log('Stake transaction confirmed: ', tx.hash);
      toast.success('Stake staked successfully!');

      const response = await fetch('https://data.triggerx.network/api/jobs', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://triggerx.network'
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create job');
      }
      console.log('Job created successfully');

      setIsModalOpen(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Error creating job: ' + error.message);
    }
  };

  const handleStake = async (estimatedFee) => {
    setIsModalOpen(false);
    await handleSubmit(jobType, estimatedFee);
  };

  const handleScriptFunctionChange = (event) => {
    if(event && event.target){
      const func = event.target.value;
      setScriptFunction(func);
      console.log('Script function changed to:', func);
    }
  };

  const handleJobTypeChange = (value) => {
    const numericType = parseInt(value);
    console.log('Setting job type:', numericType);
    setJobType(numericType);
  };

  return {
    jobType,
    estimatedFee,
    isModalOpen,
    estimatedFee,
    code_url,
    argType,
    setJobType: handleJobTypeChange,
    setIsModalOpen: (value) => {
      console.log('Setting modal open:', value);
      setIsModalOpen(value);
    },
    handleCodeUrlChange,
    estimateFee,
    handleSubmit,
    handleStake,
    scriptFunction,
    handleScriptFunctionChange,
  };
} 