import { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function useJobCreation() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState('');
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ethAmount, setEthAmount] = useState(0);
  const [code_url, setCodeUrl] = useState('');

  const handleCodeUrlChange = (event) => {
    if(event && event.target){
      const url = event.target.value;
      setCodeUrl(url);
    }
  };

  const formatVerySmallNumber = (num) => {
    if (num < 1e-6) {
      return num.toLocaleString('fullwide', {
        useGrouping: false,
        minimumFractionDigits: 0,
        maximumFractionDigits: 18
      });
    }
    return num.toString();
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
      const gasPrice = (await provider.getFeeData()).gasPrice;
      const feeInWei = gasEstimate * gasPrice;
      const feeInEth = ethers.formatEther(feeInWei);
      const overallFee = parseFloat(feeInEth) * Math.ceil(timeframeInSeconds / intervalInSeconds);
      const formattedFee = ethers.formatEther(ethers.parseEther(overallFee.toString()));

      setEstimatedFee(overallFee);
      setEthAmount(formattedFee);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error estimating fee:', error);
      toast.error('Error estimating fee: ' + error.message);
    }
  };

  const handleSubmit = async (stakeRegistryImplAddress, stakeRegistryABI, contractAddress, targetFunction, argsArray, timeframeInSeconds, intervalInSeconds) => {
    if (!jobType || !contractAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    let tempjobtype = jobType === "Time" ? 1 : 0;

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this feature');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(stakeRegistryImplAddress, stakeRegistryABI, signer);

      const formattedAmount = formatVerySmallNumber(ethAmount);

      let nextJobId;
      try {
        const latestIdResponse = await fetch('https://data.triggerx.network/api/jobs/latest-id', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!latestIdResponse.ok) {
          throw new Error('Failed to fetch latest job ID');
        }

        const latestIdData = await latestIdResponse.json();
        nextJobId = latestIdData.latest_id + 1;
      } catch (error) {
        console.error('Error fetching latest job ID:', error);
        nextJobId = 1;
      }

      const tx = await contract.stake(
        ethers.parseEther(formattedAmount),
        { value: ethers.parseEther(formattedAmount) }
      );

      await tx.wait();
      toast.success('Stake staked successfully!');

      const jobData = {
        job_id: nextJobId,
        jobType: tempjobtype,
        time_frame: timeframeInSeconds,
        time_interval: intervalInSeconds,
        contract_address: contractAddress,
        target_function: targetFunction,
        arg_type: 1,
        arguments: argsArray,
        status: true,
        job_cost_prediction: estimatedFee,
        user_id: 111,
        chain_id: 1,
        code_url: code_url
      };

      const response = await fetch('https://data.triggerx.network/api/jobs', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create job');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Error creating job: ' + error.message);
    }
  };

  return {
    jobType,
    estimatedFee,
    isModalOpen,
    ethAmount,
    code_url,
    setJobType,
    setIsModalOpen,
    handleCodeUrlChange,
    estimateFee,
    handleSubmit
  };
} 