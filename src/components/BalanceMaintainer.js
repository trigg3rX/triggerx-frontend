import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Modal from "react-modal";
import toast from 'react-hot-toast';
import { Toaster } from "react-hot-toast";
import BalanceMaintainerFactory from '../artifacts/BalanceMaintainerFactory.json';
import BalanceMaintainer from '../artifacts/BalanceMaintainer.json';

const FACTORY_ADDRESS = '0x734794fCB7f52e945DE37F07d414Cfb05fCd38D5';

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

const BalanceMaintainerExample = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "deploy" or "addAddress"
  const [modalData, setModalData] = useState({
    amount: "0.00",
    networkFee: "$0.00",
    speed: "0 sec",
    contractAddress: "",
    contractMethod: ""
  });

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

  const showDeployModal = () => {
    setModalType("deploy");
    setModalData({
      amount: "0.02",
      networkFee: "$0.01",
      speed: "2 sec",
      contractAddress: FACTORY_ADDRESS.substring(0, 7) + "..." + FACTORY_ADDRESS.substring(FACTORY_ADDRESS.length - 5),
      contractMethod: "createBalanceMaintainer()"
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

  const handleConfirm = () => {
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
        toast.success("Contract deployed successfully!");

        // Set initial balance for owner
        await setInitialBalance(deployedAddress);
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
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4">
        Deploy Balance Maintainer
      </h1>
      <div className="bg-[#141414] rounded-lg max-w-[1600px] mx-auto w-[95%] sm:w-[85%] px-3 sm:px-5 py-6 mt-4 my-8 sm:my-12">
        {/* Contract Info Section */}
        <div className="p-4 rounded-lg mb-6">
          <h2 className="text-xl text-white mb-3">Contract Information</h2>
          <div className="text-[#A2A2A2] space-y-2">
            {!isDeployed ? (
              <>
                <p className="pb-2">Status: Not Deployed   </p>
                {console.log('Button State:', {
                  isDeployed,
                  isLoading,
                  hasSigner: !!signer,
                  isInitialized,
                  canDeploy: !isLoading && !!signer && !isInitialized
                })}

                <button
                  onClick={showDeployModal}
                  disabled={isLoading || !signer || !isInitialized}
                  className={`bg-[#C07AF6] text-white px-8 py-3 rounded-lg  transition-colors text-lg ${(isLoading || !signer || !isInitialized) && 'opacity-50 cursor-not-allowed'}`}
                >
                  {isLoading && modalType === "deploy" ? 'Deploying...' : '   🛠️ Deploy Contract'}
                </button>

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

        <div className="bg-[#303030] p-4 rounded-lg mb-6">
          <h2 className="text-xl text-white mb-3">Add Addresses</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter wallet address"
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
                        <span className="px-2 sm:px-4 py-1 bg-[#F8FF7C] text-black rounded whitespace-nowrap">
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
                  timeInterval: { hours: 1, minutes: 0, seconds: 0 }
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

