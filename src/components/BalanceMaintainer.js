import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Modal from "react-modal";
import toast from 'react-hot-toast';
import { Toaster } from "react-hot-toast";
import confetti from 'canvas-confetti';
import TriggerXTemplateFactory from '../artifacts/TriggerXTemplateFactory.json';
import { Tooltip } from "antd";
import BalanceMaintainer from '../artifacts/BalanceMaintainer.json';

const BALANCEMAINTAINER_IMPLEMENTATION = "0xAc7d9b390B070ab35298e716a11933721480472D";
const FACTORY_ADDRESS = process.env.REACT_APP_TRIGGERXTEMPLATEFACTORY_ADDRESS;

// transaction modal

const TransactionModal = ({ isOpen, onClose, onConfirm, modalType, modalData }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Estimate Fee"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md z-[10000]"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
    >
      <h2 className="text-2xl font-bold mb-6">Transaction request</h2>

      <div className="space-y-6">
        <div className="bg-[#1E1E1E] p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>Interacting with</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm truncate max-w-[180px]">{modalData.contractAddress}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E1E] p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span>Amount</span>
            <span className="text-white font-medium">{modalData.amount} ETH</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span>Network fee</span>
            <span className="text-gray-300">{modalData.networkFee}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Speed</span>
            <div className="flex items-center">
              <div className="text-orange-400 mr-2">
                <span className="mr-1">🦊</span>
                <span>Market</span>
              </div>
              <span>~{modalData.speed}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E1E] p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span> Method</span>
            <span className="text-gray-300">{modalData.contractMethod}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-5">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-white text-black `}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

// Add ClaimModal component with internal confetti
const ClaimModal = ({ isOpen, onClose, onConfirm, address, claimAmount, networkName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const confettiCanvasRef = React.useRef(null);

  // Function to play confetti inside modal
  const playModalConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const myConfetti = confetti.create(canvas, { resize: true });

    // Create a 3-second animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      // Release confetti from random positions
      myConfetti({
        particleCount: 30,
        spread: 100,
        origin: { y: 0.6, x: Math.random() },
        colors: ['#FFD700', '#FFA500', '#F8FF7C'],
        shapes: ['circle'],
        scalar: 1.2
      });
    }, 250);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsLoading(false);
      setIsSuccess(true);
      playModalConfetti();

      // Close modal with a delay after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 4000);
    } catch (error) {
      setIsLoading(false);
      console.error("Claim error in modal:", error);
    }
  };

  // Function to truncate address
  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 7)}...${addr.substring(addr.length - 15)}`;
  };

  // Function to copy address and update icon
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(address)
      .then(() => {
        toast.success("Address copied to clipboard!");
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Failed to copy address"));
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={!isLoading ? onClose : undefined}
      contentLabel="Claim ETH"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md z-[10000] overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
    >
      {/* Confetti canvas overlay */}
      <canvas
        ref={confettiCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center h-full py-8 z-20 relative">
          <div className="text-3xl font-bold mb-6 text-white">
            Woohoo!
          </div>
          <div className="text-xl text-[#F8FF7C] font-bold mb-6">
            You claimed successfully!
          </div>
          <div className="text-lg mb-6">
            <span className="text-green-400 font-bold">{claimAmount} ETH</span> has been added to your wallet
          </div>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg bg-white text-black font-semibold transition-all duration-300 hover:bg-gray-100 mt-4"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 z-20 relative">Claim ETH</h2>

          <div className="space-y-6 z-20 relative">
            <div className="bg-[#1E1E1E] p-4 rounded-lg">
              <div className="mb-4">
                <span className="text-gray-400">Network</span>
                <div className="mt-1 text-white font-medium">{networkName}</div>
              </div>

              <div className="mb-4">
                <span className="text-gray-400">Your Address</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-white font-medium">{truncateAddress(address)}</span>
                  <button
                    onClick={copyAddressToClipboard}
                    className="text-white bg-[#303030] hover:bg-[#404040] p-1 rounded-md"
                    title="Copy address"
                  >
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-gray-400">Claim Amount</span>
                <div className="mt-1 text-[#F8FF7C] font-bold text-xl">
                  {claimAmount} ETH
                </div>
              </div>
            </div>


          </div>

          <div className="mt-8 flex justify-between gap-5">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-white text-black ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Claiming...
                </span>
              ) : (
                'Claim'
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

const BalanceMaintainerExample = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "deploy" or "addAddress"
  const [modalData, setModalData] = useState({
    amount: "0.00",
    networkFee: "$0.00",
    speed: "0 sec",
    contractAddress: "",
    contractMethod: ""
  });
  const [hasSufficientBalance, setHasSufficientBalance] = useState(true);
  const [userBalance, setUserBalance] = useState("0");
  const [claimAmount, setClaimAmount] = useState("0.05");

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
      // Create factory contract instance
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        TriggerXTemplateFactory.abi,
        provider
      );

      // Get proxy address for the user and implementation
      const proxyAddress = await factoryContract.getProxyAddress(
        userAddress,
        BALANCEMAINTAINER_IMPLEMENTATION
      );

      // Check if proxy exists and is not zero address
      if (proxyAddress && proxyAddress !== ethers.ZeroAddress) {
        // Verify the proxy contract exists
        const proxyCode = await provider.getCode(proxyAddress);
        if (proxyCode !== '0x') {
          setContractAddress(proxyAddress);
          setIsDeployed(true);
          await fetchContractData(provider, proxyAddress);
          return;
        }
      }

      // If we get here, no valid proxy exists
      setIsDeployed(false);
      setContractAddress("");
    } catch (error) {
      console.error("Error checking existing contract:", error);
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
      console.log("balance of contract", await contract.getContractBalance());
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

  const showDeployModal = () => {
    setModalType("deploy");
    setModalData({
      amount: "0.02",
      networkFee: "$0.01",
      speed: "2 sec",
      contractAddress: FACTORY_ADDRESS.substring(0, 7) + "..." + FACTORY_ADDRESS.substring(FACTORY_ADDRESS.length - 5),
      contractMethod: "createProxy()"
    });
    setShowModal(true);
  };

  const showAddAddressModal = () => {
    if (!newAddress || !newBalance) return;

    setModalType("addAddress");
    setModalData({
      amount: newBalance,
      networkFee: "$0.01",
      speed: "2 sec",
      contractAddress: contractAddress.substring(0, 7) + "..." + contractAddress.substring(contractAddress.length - 5),
      contractMethod: "setMultipleAddressesWithBalance()"
    });
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);

    if (modalType === "deploy") {
      handleDeploy();
    } else if (modalType === "addAddress") {
      handleAddAddress();
    }
  };

  const handleDeploy = async () => {
    if (!signer || !address) return;
    setIsLoading(true);

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
        TriggerXTemplateFactory.abi,
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

      // Deploy proxy through factory
      const tx = await factoryContract.createProxy(BALANCEMAINTAINER_IMPLEMENTATION, {
        value: ethers.parseEther('0.02')
      });

      const receipt = await tx.wait();

      // Get the deployed proxy address from the event
      const event = receipt.logs.find(log => {
        try {
          const parsedLog = factoryContract.interface.parseLog(log);
          return parsedLog && parsedLog.name === 'ProxyDeployed';
        } catch (e) {
          return false;
        }
      });

      if (event) {
        const parsedLog = factoryContract.interface.parseLog(event);
        const proxyAddress = parsedLog.args.proxy;
        setContractAddress(proxyAddress);
        setIsDeployed(true);
        toast.success("Contract deployed successfully!");

        // Set initial balance for owner
        await setInitialBalance(proxyAddress);
      } else {
        throw new Error("No deployment event found in transaction receipt");
      }
    } catch (err) {
      console.error("Deployment error:", err);

      // Check for user rejection
      if (err.code === 'ACTION_REJECTED' ||
        err.code === 4001 ||
        err.message?.includes("rejected") ||
        err.message?.includes("denied") ||
        err.message?.includes("user rejected")) {
        toast.error("Transaction rejected by user");
      } else {
        toast.error("Deployment failed: " + (err.message || "Unknown error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!signer || !newAddress || !newBalance) return;

    setIsLoading(true);

    try {
      const contract = new ethers.Contract(
        contractAddress,
        BalanceMaintainer.abi,
        signer
      );
      console.log("tryying to add address...");
      console.log("contract", contract);


      const tx = await contract.setMultipleAddressesWithBalance(
        [newAddress],
        [ethers.parseEther(newBalance)]
      );

      await tx.wait();
      await fetchContractData(provider, contractAddress);
      setNewAddress("");
      setNewBalance("");
      toast.success("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error);

      // Check for user rejection
      if (error.code === 'ACTION_REJECTED' ||
        error.code === 4001 ||
        error.message?.includes("rejected") ||
        error.message?.includes("denied") ||
        error.message?.includes("user rejected")) {
        toast.error("Transaction rejected by user");
      } else {
        toast.error("Failed to add address: " + (error.message || "Unknown error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing contract when component mounts or when initialized
  useEffect(() => {
    if (isInitialized && provider && address) {
      checkExistingContract(provider, address);
    }
  }, [isInitialized, provider, address]);

  // Add function to check balance sufficiency
  const checkBalanceSufficiency = async () => {
    if (!provider || !address) return;

    try {
      const balance = await provider.getBalance(address);
      const requiredBalance = ethers.parseEther('0.02');
      const formattedBalance = ethers.formatEther(balance);

      setUserBalance(Number(formattedBalance).toFixed(4));
      setHasSufficientBalance(balance >= requiredBalance);
    } catch (error) {
      console.error("Error checking balance:", error);
      setHasSufficientBalance(false);
    }
  };

  // Call checkBalanceSufficiency when provider or address changes
  useEffect(() => {
    if (provider && address) {
      checkBalanceSufficiency();

      // Set up periodic balance check
      const interval = setInterval(checkBalanceSufficiency, 15000); // Check every 15 seconds
      return () => clearInterval(interval);
    }
  }, [provider, address]);

  // Create a function to trigger confetti
  const triggerConfetti = () => {
    // Create coin-like confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Gold coins
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#F8FF7C'],
        shapes: ['circle'],
        scalar: randomInRange(0.8, 1.2)
      }));
    }, 250);
  };

  // Modified handleClaim function
  const handleClaim = () => {
    setShowClaimModal(true);
  };

  // Modified confirmClaim function
  const confirmClaim = async () => {
    try {
      // Check if wallet is connected
      if (!address) {
        toast.error('Wallet not connected. Please connect your wallet first.');
        throw new Error('Wallet not connected');
      }
      let networkName = "op_sepolia"; // Default
      if (chainId === 84532n) {
        networkName = "base_sepolia";
      }
      // Call the backend API to send ETH to the user's wallet
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/claim-fund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: address,
            network: networkName
          }),
        }
      );


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim ETH');
      }

      const data = await response.json();
      console.log('Claim successful:', data);

      // Update balance after claiming
      setTimeout(() => {
        if (provider && address) {
          checkBalanceSufficiency();
        }
      }, 2000);

      return true; // indicate success to the modal
    } catch (error) {
      console.error('Claim error:', error);

      // Check if it's a user rejection from the API
      if (error.message?.includes("rejected") ||
        error.message?.includes("denied")) {
        toast.error('Transaction was rejected');
      } else {
        toast.error(error.message || 'Failed to claim ETH');
      }

      throw error; // propagate error to modal
    }
  };

  // Get network name for display
  const getNetworkName = () => {
    if (chainId === 11155420n) {
      return "Optimism Sepolia";
    } else if (chainId === 84532n) {
      return "Base Sepolia";
    } else {
      return "Test Network";
    }
  };

  return (
    <div className="min-h-[90vh] md:mt-[20rem] mt-[10rem]">
      <Toaster
        position="center"
        className="mt-10"
        toastOptions={{
          style: {
            background: "#0a0a0a", // Dark background
            color: "#fff", // White text
            borderRadius: "8px",
            border: "1px gray solid",
          },
        }}
      />
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4 mb-6 ">
        Deploy Balance Maintainer
      </h1>
      <h4 className="text-sm sm:text-base lg:text-lg text-[#A2A2A2] leading-relaxed text-center">
        Set up your automated blockchain tasks with precise conditions and
        parameters.
      </h4>
      <div className="bg-[#141414] rounded-lg max-w-[1600px] mx-auto w-[95%] sm:w-[85%] px-3 sm:px-5 py-6 mt-4 my-8 sm:my-12">
        {/* Contract Info Section */}
        <div className="p-4 rounded-lg mb-6">
          <h2 className="text-xl text-white mb-3">Contract Information</h2>
          <div className="text-[#A2A2A2] space-y-2">
            {!isDeployed ? (
              <>
                <p className="pb-2">Status: Not Deployed</p>

                {console.log('Button State:', {
                  isDeployed,
                  isLoading,
                  hasSigner: !!signer,
                  isInitialized,
                  canDeploy: !isLoading && !!signer && !isInitialized
                })}

                <div className="flex flex-wrap gap-4">
                  <Tooltip color="#2A2A2A"
                    title={
                      !hasSufficientBalance ? " Insufficient ETH balance" :
                        ""}
                    open={(!hasSufficientBalance) ? undefined : false}
                  >
                    <button
                      onClick={showDeployModal}
                      className="bg-[#C07AF6] text-white px-8 py-3 rounded-lg transition-colors text-lg"
                    >
                      {isLoading && modalType === "deploy" ? 'Deploying...' : '🛠️ Deploy Contract'}
                    </button>
                  </Tooltip>


                  <Tooltip
                    color="#2A2A2A"
                    title={hasSufficientBalance ? " Sufficient ETH balance" : ""}
                    open={hasSufficientBalance ? undefined : false}
                  >
                    <button
                      onClick={handleClaim}
                      className="bg-[#F8FF7C] text-black px-8 py-3 rounded-lg transition-colors text-lg hover:bg-[#E1E85A]"
                    >
                      💰 Claim ETH
                    </button>
                  </Tooltip>

                </div>
              </>
            ) : (
              <>
                <p className="text-white">Status : <span className="text-[#A2A2A2] font-semibold pl-2"> {isInitialized ? 'Deployed Successfully' : 'Deploying...'}</span></p>
                <p className="text-white">Owner : <span className="text-[#A2A2A2] font-semibold pl-2">{address}</span></p>
                <p className="text-white">Balance : <span className="text-[#A2A2A2] font-semibold pl-2">{contractBalance}  ETH</span> </p>
                <p className="text-white">
                  Contract Address :{' '}
                  <a
                    href={`${chainId === 11155420n
                      ? 'https://sepolia-optimism.etherscan.io/address/'
                      : 'https://sepolia.basescan.org/address/'}${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#77E8A3] underline pl-2"
                  >
                    {contractAddress}
                  </a>
                </p>
                {isSettingInitialBalance && <p className="text-yellow-500">Adding initial Address in the balance maintain list...</p>}
              </>
            )}
          </div>
        </div>
        <TransactionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          modalType={modalType}
          modalData={modalData}
        />

        {/* Claim Modal */}
        <ClaimModal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          onConfirm={confirmClaim}
          address={address}
          claimAmount={claimAmount}
          networkName={getNetworkName()}
        />

        <div className="bg-[#303030] p-4 rounded-lg mb-6">
          <h2 className="text-xl text-white mb-3">Add Addresses</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter wallet address where you maintain your funds"
              className={`bg-[#1A1B1E] text-white px-4 py-4 rounded-lg flex-1 ${(!isDeployed) && ' cursor-not-allowed'}`}
              disabled={!isDeployed || isSettingInitialBalance || isLoading}
            />
            <input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              placeholder="Minimum balance (ETH)"
              className={`bg-[#1A1B1E] text-white px-4 py-4 rounded-lg w-48 ${(!isDeployed) && ' cursor-not-allowed'}`}
              step="0.1"
              min="0"
              disabled={!isDeployed || isSettingInitialBalance || isLoading}
            />
            <button
              onClick={showAddAddressModal}
              disabled={!isDeployed || isSettingInitialBalance || isLoading || !newAddress || !newBalance}
              className={`bg-[#FFFFFF] text-black px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${(!isDeployed || isSettingInitialBalance || isLoading || !newAddress || !newBalance) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading && modalType === "addAddress" ? 'Adding...' : 'Add Address'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Addresses Table */}
        <div className=" p-4 rounded-lg mb-6 min-h-[40vh]">
          <h2 className="text-xl text-white mb-3">Configured Addresses</h2>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-full border-separate border-spacing-y-2 md:border-spacing-y-4">
              <thead className="bg-[#303030]">
                <tr>
                  <th className="px-2 sm:px-4 md:px-6 py-5 text-left text-white rounded-tl-lg rounded-bl-lg w-3/5">Address</th>
                  <th className="px-2 sm:px-4 md:px-6 py-5 text-left text-white w-1/5">Current Balance</th>
                  <th className="px-2 sm:px-4 md:px-6 py-5 text-left text-white rounded-tr-lg rounded-br-lg w-1/5">Min Balance (ETH)</th>
                </tr>
              </thead>
              <tbody>
                {!isDeployed ? (
                  <tr>
                    <td colSpan="3" className="px-2 sm:px-4 md:px-6 py-4 text-center text-[#A2A2A2] h-[40vh]">
                      Please deploy the contract first to configure addresses
                    </td>
                  </tr>
                ) : (
                  addresses.map((item) => (
                    <tr key={item.key} className=" bg-[#1A1A1A]">
                      <td className="px-2 sm:px-4 md:px-6 py-5 text-[#A2A2A2] w-3/5 truncate rounded-tl-lg rounded-bl-lg">
                        <span className="block truncate">{item.address}</span>
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-3 w-1/5">
                        <span className="px-2 sm:px-4 py-2 bg-[#4CAF50] text-white rounded whitespace-nowrap text-sm">
                          {item.currentBalance} ETH
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-3 w-1/5 rounded-tr-lg rounded-br-lg">
                        <span className="px-2 sm:px-4 py-2 bg-[#C07AF6] text-white rounded whitespace-nowrap text-sm">
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
          {isDeployed && (
            <button onClick={() => navigate('/', {
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
                timeInterval: { hours: 1, minutes: 0, seconds: 0 }
              }
            })} className="relative bg-[#F8FF7C] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform ">
              <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
              <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
              <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs lg:text-sm xl:text-base">
                Create Job            </span>
            </button>

          )}

        </div>
      </div>
    </div>
  );
};

export default BalanceMaintainerExample;