import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

export function useContractInteraction() {
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState('');
  const [functions, setFunctions] = useState([]);
  const [targetFunction, setTargetFunction] = useState('');
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionInputs, setFunctionInputs] = useState([]);
  const [argumentsInBytes, setArgumentsInBytes] = useState([]);
  const [argsArray, setArgArray] = useState([]);

  function extractFunctions(abi) {
    try {
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
        abiArray = [abi];
      } else {
        throw new Error('ABI must be an array, object, or valid JSON string');
      }

      if (!Array.isArray(abiArray)) {
        throw new Error('Processed ABI is not an array');
      }

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

      return functions;
    } catch (error) {
      console.error('Error processing ABI:', error);
      return [];
    }
  }

  const handleContractAddressChange = async (e) => {
    const address = e.target.value;
    setContractAddress(address);

    if (ethers.isAddress(address)) {
      const url = `https://optimism-sepolia.blockscout.com/api?module=contract&action=getabi&address=${address}`;
      try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.status === '1') {
          const writableFunctions = extractFunctions(data.result).filter(func =>
            func.stateMutability === 'nonpayable' || func.stateMutability === 'payable'
          );
          setFunctions(writableFunctions);
          setContractABI(data.result);
        } else {
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

  const handleFunctionChange = (e) => {
    const selectedValue = e.target.value;
    setTargetFunction(selectedValue);

    const func = functions.find(f => `${f.name}(${f.inputs.map(input => input.type).join(',')})` === selectedValue);
    setSelectedFunction(func);

    if (func) {
      setFunctionInputs(func.inputs.map(() => ''));
      setArgArray(func.inputs.map(() => ''));
    } else {
      setFunctionInputs([]);
      setArgArray([]);
    }
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...functionInputs];
    newInputs[index] = value;
    setFunctionInputs(newInputs);
    setArgArray(newInputs);

    if (newInputs.every(input => input !== '')) {
      const bytesArray = newInputs.map(arg => {
        const hexValue = ethers.toBeHex(arg);
        return hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`;
      });
      setArgumentsInBytes(bytesArray);
    } else {
      setArgumentsInBytes([]);
    }
  };

  useEffect(() => {
    const bytesArray = functionInputs.map(arg => {
      if (arg === '') return '0x';
      try {
        const hexValue = ethers.toBeHex(arg);
        return hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`;
      } catch (error) {
        console.error('Error converting input to hex:', error);
        return '0x';
      }
    });
    setArgumentsInBytes(bytesArray);
  }, [functionInputs]);

  return {
    contractAddress,
    contractABI,
    functions,
    targetFunction,
    selectedFunction,
    functionInputs,
    argumentsInBytes,
    argsArray,
    handleContractAddressChange,
    handleFunctionChange,
    handleInputChange
  };
} 