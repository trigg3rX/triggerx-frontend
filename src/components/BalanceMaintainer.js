import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import BalanceMaintainerFactory from '../artifacts/BalanceMaintainerFactory.json';
import BalanceMaintainer from '../artifacts/BalanceMaintainer.json';
import axios from 'axios';

const FACTORY_ADDRESS = '0x734794fCB7f52e945DE37F07d414Cfb05fCd38D5';

const BalanceMaintainerExample = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contractBalance, setContractBalance] = useState("0");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSettingInitialBalance, setIsSettingInitialBalance] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize provider and signer
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          // Get network with error handling
          let network;
          try {
            network = await provider.getNetwork();
          } catch (error) {
            console.warn("Error getting network:", error);
            // Default to Optimism Sepolia if network fetch fails
            network = { chainId: 11155420 };
          }

          setProvider(provider);
          setSigner(signer);
          setAddress(address);
          setChainId(network.chainId);
          setIsInitialized(true);

          // Listen for account changes
          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length === 0) {
              setAddress("");
              setSigner(null);
              setIsDeployed(false);
              setContractAddress("");
            } else {
              try {
                const signer = await provider.getSigner();
                setSigner(signer);
                setAddress(accounts[0]);
                // Check for existing contract when account changes
                checkExistingContract(provider, accounts[0]);
              } catch (error) {
                console.error("Error handling account change:", error);
              }
            }
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', async (chainId) => {
            try {
              // Convert chainId from hex to decimal
              const newChainId = parseInt(chainId, 16);
              setChainId(newChainId);

              // Wait a bit for the network to stabilize
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Check for existing contract when chain changes
              if (address) {
                checkExistingContract(provider, address);
              }
            } catch (error) {
              console.error("Error handling chain change:", error);
            }
          });
        } catch (error) {
          console.error("Error initializing provider:", error);
          // Reset states if initialization fails
          setProvider(null);
          setSigner(null);
          setAddress("");
          setChainId(null);
          setIsInitialized(false);
        }
      } else {
        console.error("MetaMask not found");
        setIsInitialized(false);
      }
    };

    initProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Check for existing contract
  const checkExistingContract = async (provider, userAddress) => {
    if (!provider || !userAddress) return;

    try {
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        BalanceMaintainerFactory.abi,
        provider
      );

      const userContracts = await factoryContract.getUserContracts(userAddress);
      if (userContracts && userContracts.length > 0) {
        setContractAddress(userContracts[0]);
        setIsDeployed(true);
        fetchContractData(provider, userContracts[0]);
      } else {
        setIsDeployed(false);
        setContractAddress("");
      }
    } catch (error) {
      console.error("Error checking user contracts:", error);
      setIsDeployed(false);
      setContractAddress("");
    }
  };

  // Fetch contract data
  const fetchContractData = async (provider, contractAddr) => {
    if (!provider || !contractAddr) return;

    try {
      const contract = new ethers.Contract(
        contractAddr,
        BalanceMaintainer.abi,
        provider
      );

      // Get contract balance
      const balance = await contract.getContractBalance();
      setContractBalance(Number(ethers.formatEther(balance)).toFixed(4));

      // Get tracked addresses and their minimum balances
      const [addrs, minBalances] = await contract.getAllTrackedAddressesWithBalances();

      // Fetch actual balances for each address
      const balancesPromises = addrs.map(addr => provider.getBalance(addr));
      const actualBalances = await Promise.all(balancesPromises);

      setAddresses(addrs.map((addr, index) => ({
        key: index.toString(),
        address: addr,
        currentBalance: Number(ethers.formatEther(actualBalances[index])).toFixed(4),
        minimumBalance: Number(ethers.formatEther(minBalances[index])).toFixed(4)
      })));
    } catch (error) {
      console.error("Error fetching contract data:", error);
    }
  };

  // Add periodic balance refresh
  useEffect(() => {
    if (!provider || !contractAddress) return;

    const interval = setInterval(() => {
      fetchContractData(provider, contractAddress);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [provider, contractAddress]);

  // Set initial balance for owner
  const setInitialBalance = async (contractAddr) => {
    if (!signer || !address || !contractAddr) return;

    setIsSettingInitialBalance(true);
    try {
      const contract = new ethers.Contract(
        contractAddr,
        BalanceMaintainer.abi,
        signer
      );

      const tx = await contract.setMultipleAddressesWithBalance(
        [address],
        [ethers.parseEther('0.01')]
      );

      await tx.wait();
      await fetchContractData(provider, contractAddr);
    } catch (error) {
      console.error("Error setting initial balance:", error);
    } finally {
      setIsSettingInitialBalance(false);
    }
  };

  const handleDeploy = async () => {
    if (!signer || !address) return;
    setIsLoading(true);
    setError(null);

    try {
      // Get current network from provider
      const network = await signer.provider.getNetwork();
      const currentChainId = network.chainId;

      if (!currentChainId) {
        throw new Error("Unable to determine current network. Please ensure your wallet is connected.");
      }

      // Create factory contract instance
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        BalanceMaintainerFactory.abi,
        signer
      );

      // Verify contract is deployed and accessible
      try {
        const code = await signer.provider.getCode(FACTORY_ADDRESS);
        if (code === '0x') {
          throw new Error(`Factory contract not deployed at ${FACTORY_ADDRESS} on current network`);
        }
      } catch (err) {
        throw new Error(`Failed to verify factory contract: ${err.message}`);
      }

      // Get current balance to ensure sufficient funds
      const balance = await signer.provider.getBalance(address);
      const requiredBalance = ethers.parseEther('0.02');
      if (balance < requiredBalance) {
        throw new Error(`Insufficient balance. Required: ${ethers.formatEther(requiredBalance)} ETH, Current: ${ethers.formatEther(balance)} ETH`);
      }

      // Attempt deployment
      const tx = await factoryContract.createBalanceMaintainer({
        value: ethers.parseEther('0.02')
      });

      const receipt = await tx.wait();

      // Get the deployed contract address from the event
      const event = receipt.logs.find(log => {
        try {
          const parsedLog = factoryContract.interface.parseLog(log);
          return parsedLog && parsedLog.name === 'BalanceMaintainerDeployed';
        } catch (e) {
          return false;
        }
      });

      if (event) {
        const parsedLog = factoryContract.interface.parseLog(event);
        const deployedAddress = parsedLog.args.balanceMaintainer;
        setContractAddress(deployedAddress);
        setIsDeployed(true);

        // Verify contract
        await verifyContract(currentChainId, deployedAddress);

        // Set initial balance for owner
        await setInitialBalance(deployedAddress);
      } else {
        throw new Error("No deployment event found in transaction receipt");
      }
    } catch (err) {
      console.error("Deployment error:", err);
      setError(err.message || "Failed to deploy contract. Please check your network connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyContract = async (chainId, deployedAddress) => {
    try {
      const apiKey = chainId === 11155111 ? process.env.REACT_APP_ETHERSCAN_API_KEY : process.env.REACT_APP_POLYGONSCAN_API_KEY;
      if (!apiKey) {
        console.error(`No API key found for chain ${chainId}`);
        return;
      }

      const verificationUrl = chainId === 11155111
        ? 'https://api-sepolia.etherscan.io/api'
        : 'https://api.polygonscan.com/api';

      console.log('Verifying contract...', {
        chainId,
        hasApiKey: !!apiKey,
        verificationUrl,
        deployedAddress
      });

      // Read both contract source files
      const factorySource = await fetch('/contracts/BalanceMaintainerFactory.sol').then(res => res.text());
      const maintainerSource = await fetch('/contracts/BalanceMaintainer.sol').then(res => res.text());

      // Encode constructor arguments using ethers v6
      const abiCoder = new ethers.AbiCoder();
      const constructorArgs = abiCoder.encode(['address'], [signer.address]).slice(2);

      const verificationData = {
        apikey: apiKey,
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: deployedAddress,
        sourceCode: JSON.stringify({
          language: "Solidity",
          sources: {
            "BalanceMaintainerFactory.sol": {
              content: factorySource
            },
            "BalanceMaintainer.sol": {
              content: maintainerSource
            }
          },
          settings: {
            optimizer: {
              enabled: false,
              runs: 200
            },
            evmVersion: "paris",
            libraries: {},
            outputSelection: {
              "*": {
                "*": [
                  "evm.bytecode.object",
                  "evm.bytecode.sourceMap",
                  "evm.deployedBytecode.object",
                  "evm.deployedBytecode.sourceMap",
                  "abi"
                ]
              }
            }
          }
        }),
        codeformat: 'solidity-standard-json-input',
        contractname: 'BalanceMaintainerFactory',
        compilerversion: 'v0.8.20+commit.a1b79de6',
        optimizationUsed: 0,
        runs: 200,
        constructorArguments: constructorArgs
      };

      const response = await axios.post(verificationUrl, verificationData);
      console.log('Verification response:', response.data);

      if (response.data.status === '1') {
        console.log('Contract verified successfully!');
        // You can add a success notification here
      } else {
        console.error('Contract verification failed:', response.data);
        // You can add an error notification here
      }
    } catch (error) {
      console.error('Error verifying contract:', error);
      // You can add an error notification here
    }
  };

  const handleAddAddress = async () => {
    if (!signer || !newAddress || !newBalance) return;

    try {
      const contract = new ethers.Contract(
        contractAddress,
        BalanceMaintainer.abi,
        signer
      );

      const tx = await contract.setMultipleAddressesWithBalance(
        [newAddress],
        [ethers.parseEther(newBalance)]
      );

      await tx.wait();
      await fetchContractData(provider, contractAddress);
      setNewAddress("");
      setNewBalance("");
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  // Check for existing contract when component mounts or when initialized
  useEffect(() => {
    if (isInitialized && provider && address) {
      checkExistingContract(provider, address);
    }
  }, [isInitialized, provider, address]);

  return (
    <div className="min-h-[90vh] md:mt-[20rem] mt-[10rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4">
        Deploy Balance Maintainer
      </h1>
      <div className="bg-[#1A1B1E] rounded-lg max-w-[1600px] mx-auto w-[95%] sm:w-[85%] px-3 sm:px-5 py-6 mt-4 my-8 sm:my-12">
        {/* Contract Info Section */}
        <div className="bg-[#2A2A2A] p-4 rounded-lg mb-6">
          <h2 className="text-xl text-white mb-3">Contract Information</h2>
          <div className="text-[#A2A2A2] space-y-2">
            {!isDeployed ? (
              <>
                <p>Status: Not Deployed</p>
                {error && <p className="text-red-500">Error: {error}</p>}
              </>
            ) : (
              <>
                <p>Status: {isVerifying ? 'Verifying...' : 'Deployed Successfully'}</p>
                <p>Owner: {address}</p>
                <p>Balance: {contractBalance} ETH</p>
                <p className="text-green-400">
                  Contract Address:{' '}
                  <a
                    href={`${chainId === 11155420n
                      ? 'https://sepolia-optimism.etherscan.io/address/'
                      : 'https://sepolia.basescan.org/address/'}${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {contractAddress}
                  </a>
                </p>
                {isSettingInitialBalance && <p className="text-yellow-500">Adding initial Address in the balance maintain list...</p>}
              </>
            )}
          </div>
        </div>

        <div className="bg-[#2A2A2A] p-4 rounded-lg mb-6">
          <h2 className="text-xl text-white mb-3">Add Addresses</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="bg-[#1A1B1E] text-white px-4 py-2 rounded-lg flex-1"
              disabled={!isDeployed || isSettingInitialBalance}
            />
            <input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="Minimum balance (ETH)"
              className="bg-[#1A1B1E] text-white px-4 py-2 rounded-lg w-48"
              step="0.1"
              min="0"
              disabled={!isDeployed || isSettingInitialBalance}
            />
            <button
              onClick={handleAddAddress}
              disabled={!isDeployed || isSettingInitialBalance}
              className={`bg-[#4CAF50] text-white px-6 py-2 rounded-lg hover:bg-[#45a049] transition-colors whitespace-nowrap ${(!isDeployed || isSettingInitialBalance) && 'opacity-50 cursor-not-allowed'}`}
            >
              Add Address
            </button>
          </div>
        </div>

        {/* Addresses Table */}
        <div className="bg-[#2A2A2A] p-4 rounded-lg mb-6 min-h-[40vh]">
          <h2 className="text-xl text-white mb-3">Configured Addresses</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1B1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-white rounded-tl-lg">Address</th>
                  <th className="px-6 py-3 text-left text-white">Current Balance</th>
                  <th className="px-6 py-3 text-left text-white rounded-tr-lg">Min Balance (ETH)</th>
                </tr>
              </thead>
              <tbody>
                {!isDeployed ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-[#A2A2A2] min-h-[40vh]">
                      Please deploy the contract first to configure addresses
                    </td>
                  </tr>
                ) : (
                  addresses.map((item) => (
                    <tr key={item.key} className="border-t border-[#1A1B1E]">
                      <td className="px-6 py-3 text-[#A2A2A2]">{item.address}</td>
                      <td className="px-6 py-3">
                        <span className="px-4 py-1 bg-[#4CAF50] text-white rounded">
                          {item.currentBalance} ETH
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-4 py-1 bg-[#F8FF7C] text-black rounded">
                          {item.minimumBalance} ETH
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deploy Button */}
        <div className="flex justify-center">
          {!isDeployed ? (
            <>
              {console.log('Button State:', {
                isDeployed,
                isLoading,
                hasSigner: !!signer,
                isVerifying,
                isInitialized,
                canDeploy: !isLoading && !!signer && !isVerifying && isInitialized
              })}
              <button
                onClick={handleDeploy}
                disabled={isLoading || !signer || isVerifying || !isInitialized}
                className={`bg-[#C07AF6] text-white px-8 py-3 rounded-lg hover:bg-[#9B4EDB] transition-colors text-lg ${(isLoading || !signer || isVerifying || !isInitialized) && 'opacity-50 cursor-not-allowed'}`}
              >
                {isLoading ? 'Deploying...' : isVerifying ? 'Verifying...' : !isInitialized ? 'Initializing...' : 'Deploy Contract'}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/', {
                state: {
                  jobType: 1, // Time-based trigger
                  contractAddress: contractAddress,
                  abi: JSON.stringify([{
                    "inputs": [],
                    "name": "maintainBalances",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                  }]),
                  timeframe: { years: 0, months: 0, days: 1 },
                  timeInterval: { hours: 0, minutes: 1, seconds: 0 }
                }
              })}
              className="bg-[#C07AF6] text-white px-8 py-3 rounded-lg hover:bg-[#9B4EDB] transition-colors text-lg"
            >
              Create Job
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceMaintainerExample;

