import { useState, useEffect } from 'react';

export function useStakeRegistry() {
  const [stakeRegistryAddress, setStakeRegistryAddress] = useState('');
  const [stakeRegistryImplAddress, setStakeRegistryImplAddress] = useState('');
  const [stakeRegistryABI, setStakeRegistryABI] = useState('');

  useEffect(() => {
    const fetchStakeRegistryABI = async () => {
      const url = 'https://raw.githubusercontent.com/trigg3rX/triggerx-contracts/main/contracts/script/output/stake.opsepolia.json';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        if (data && data.triggerXStakeRegistry) {
          const proxyAddress = data.triggerXStakeRegistry.proxy;
          const implAddress = data.triggerXStakeRegistry.implementation;
          setStakeRegistryAddress(proxyAddress);
          setStakeRegistryImplAddress(implAddress);
        }

        const blockscoutUrl = `https://optimism-sepolia.blockscout.com/api?module=contract&action=getabi&address=${stakeRegistryImplAddress}`;
        
        const abiResponse = await fetch(blockscoutUrl);
        if (!abiResponse.ok) {
          throw new Error('Failed to fetch ABI from Blockscout');
        }
        
        const abiData = await abiResponse.json();
        if (abiData.status === '1' && abiData.result) {
          setStakeRegistryABI(JSON.parse(abiData.result));
        } else {
          throw new Error('Invalid ABI data received from Blockscout');
        }
      } catch (error) {
        console.error('Error fetching stake registry ABI:', error);
      }
    };

    fetchStakeRegistryABI();
  }, [stakeRegistryImplAddress]);

  return {
    stakeRegistryAddress,
    stakeRegistryImplAddress,
    stakeRegistryABI
  };
} 