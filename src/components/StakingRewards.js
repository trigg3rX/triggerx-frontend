import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import ERC20ABI from "../artifacts/ERC20.json";
import { useAccount, useBalance } from "wagmi";
import TransactionModal from "./Stake-Reward/TransactionModal";
import ClaimModal from "./Stake-Reward/ClaimModal";
import StakingRewardsABI from "../artifacts/StakingReword.json";
import { Copy, Check } from "lucide-react";

// Contract addresses and Static Data
const TOKEN_ADDRESS = process.env.REACT_APP_STAKER_TOKEN_ADDRESS;
const STAKE_REWARD_CONTRACT_ADDRESS =
  process.env.REACT_APP_STAKING_REWARD_CONTRACT_ADDRESS;
const ETHClaimAmount = "0.03";
const THRESHOLD = "10";
const jobConfig = {
  jobType: "Event Based (2)",
  argType: "static",
  targetContractAddress: "0xfF97e83B212fC5d536B0bB26d7d8a266C93FF861",
  targetFunction: "distributeNFTRewards",
  triggerContractAddress: "0xfF97e83B212fC5d536B0bB26d7d8a266C93FF861",
  triggerEvent: "ThresholdReached(uint256,uint256)",
  abi: {
    inputs: [],
    name: "distributeNFTRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
};

const StakingReward = () => {
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address,
    watch: true,
    enabled: !!address,
  });
  const { data: tokenBalanceData, refetch: refetchTokenBalance } = useBalance({
    address,
    token: TOKEN_ADDRESS,
    watch: true,
    enabled: !!address,
  });

  const [showModal, setShowModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showTokenClaimModal, setShowTokenClaimModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState({
    amount: "0.00",
    networkFee: "$0.00",
    speed: "0 sec",
    token: "",
    contractAddress: "",
    contractMethod: "",
  });
  const [hasSufficientBalance, setHasSufficientBalance] = useState(false);
  const [hasSufficientTokenBalance, setHasSufficientTokenBalance] =
    useState(false);

  const [userBalance, setUserBalance] = useState("0");

  const [tokenBalance, setTokenBalance] = useState("0");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [nextThreshold, setNextThreshold] = useState("0");

  const [isClaimingToken, setIsClaimingToken] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const [stakingContract, setStakingContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);

  const [hasNFT, setHasNFT] = useState(false);

  const [copiedAddresses, setCopiedAddresses] = useState({});
  const [isAbiExpanded, setIsAbiExpanded] = useState(false);

  // To update balances of ETH and Staker Token(STK)
  useEffect(() => {
    if (balanceData && tokenBalanceData) {
      const balance = balanceData.value;
      const tokenBalance = tokenBalanceData.value;

      const requiredBalance = ethers.parseEther("0.02");
      const requiredTokenBalance = ethers.parseEther("1");

      const formattedBalance = Number(ethers.formatEther(balance)).toFixed(4);
      const formattedTokenBalance = Number(
        ethers.formatEther(tokenBalance)
      ).toFixed(2);

      setUserBalance(formattedBalance);
      setTokenBalance(formattedTokenBalance);

      setHasSufficientBalance(balance >= requiredBalance);
      setHasSufficientTokenBalance(tokenBalance >= requiredTokenBalance);
    }
  }, [balanceData, tokenBalanceData]);

  // Initialize contracts of Staker Token and Staking Rewards
  useEffect(() => {
    if (signer && address) {
      try {
        const stakingContract = new ethers.Contract(
          STAKE_REWARD_CONTRACT_ADDRESS,
          StakingRewardsABI.abi,
          signer
        );

        const tokenContract = new ethers.Contract(
          TOKEN_ADDRESS,
          ERC20ABI.abi,
          signer
        );

        setStakingContract(stakingContract);
        setTokenContract(tokenContract);

        // Fetch initial staking data
        fetchStakingData(stakingContract, address);
      } catch (error) {
        console.error("Error initializing contracts:", error);
      }
    }
  }, [signer, address]);

  // To periodically refresh staking data
  useEffect(() => {
    if (!stakingContract || !address) return;

    const interval = setInterval(() => {
      fetchStakingData(stakingContract, address);
    }, 30000);

    return () => clearInterval(interval);
  }, [stakingContract, address]);

  // To handle the provider, signer and wallet connection
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          let network;
          try {
            network = await provider.getNetwork();
          } catch (error) {
            console.warn("Error getting network:", error);
            network = { chainId: 11155420 };
          }

          setProvider(provider);
          setSigner(signer);
          setChainId(network.chainId);
          setIsInitialized(true);

          window.ethereum.on("chainChanged", async (chainId) => {
            try {
              const newChainId = parseInt(chainId, 16);
              setChainId(newChainId);

              await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
              console.error("Error handling chain change:", error);
            }
          });
        } catch (error) {
          console.error("Error initializing provider:", error);
          setProvider(null);
          setSigner(null);
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
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  // Fetch total staked amount and user staked amount with NFT reward
  const fetchStakingData = async (contract, userAddress) => {
    if (!contract || !userAddress) return;

    try {
      // Get user staked amount
      const userStaked = await contract.getStakedAmount(userAddress);
      setStakedAmount(ethers.formatEther(userStaked));

      // Get total staked amount
      const total = await contract.getTotalStaked();
      setTotalStaked(ethers.formatEther(total));

      // Check if user has NFT reward
      const hasReceivedNFT = await contract.hasReceivedNFT(userAddress);
      setHasNFT(hasReceivedNFT);

      const modulusThreshold = ethers.formatEther(total) % THRESHOLD;
      const nextThreshold = THRESHOLD - modulusThreshold;
      setNextThreshold(nextThreshold);
    } catch (error) {
      console.error("Error fetching staking data:", error);
    }
  };

  // Manually refresh staking data while staking or unstaking
  const refreshStakingData = async () => {
    if (stakingContract && address) {
      await fetchStakingData(stakingContract, address);
    }
  };

  // Function to claim stake token
  const handleTokenClaim = async () => {
    // Check if signer and address are available with chainID
    if (!signer || !address || chainId !== 11155420n) {
      toast.error("Please connect to Optimism Sepolia network");
      return;
    }

    setIsClaimingToken(true);

    try {
      const tx = await tokenContract.mint(address, ethers.parseEther("1.0"));

      // Wait for transaction to be mined
      await tx.wait();

      // Refresh token balance
      await refetchTokenBalance();
      toast.success("Token claimed successfully!");
    } catch (error) {
      console.error("Token claim error:", error);

      if (
        error.message?.includes("rejected") ||
        error.message?.includes("denied")
      ) {
        toast.error("Transaction was rejected");
      } else {
        toast.error(error.message || "Failed to claim token");
      }
    } finally {
      setShowTokenClaimModal(false);
      setIsClaimingToken(false);
    }
  };

  // Show Modal to mint Token
  const showStakeTokenClaimModal = () => {
    setModalType("claimToken");
    setModalData({
      amount: "1.0",
      networkFee: "~0.005 $",
      speed: "2 sec",
      token: "STK",
      contractAddress:
        TOKEN_ADDRESS.substring(0, 7) +
        "..." +
        TOKEN_ADDRESS.substring(TOKEN_ADDRESS.length - 5),
      contractMethod: "mint()",
    });
    setShowTokenClaimModal(true);
  };

  // Handle Confirm for Mint Token in Modal
  const handleConfirm = async () => {
    setShowTokenClaimModal(false);
    if (modalType === "claimToken") {
      handleTokenClaim();
    }
  };

  const handleClaim = () => {
    setShowClaimModal(true);
  };

  const confirmClaim = async () => {
    try {
      if (!address) {
        toast.error("Wallet not connected. Please connect your wallet first.");
        throw new Error("Wallet not connected");
      }

      let networkName = "op_sepolia";
      if (chainId === 84532n) {
        networkName = "base_sepolia";
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/claim-fund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: address,
            network: networkName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to claim ETH");
      }

      const data = await response.json();
      console.log("Claim successful:", data);

      // Refresh balance in the background
      refetchBalance();

      // Return true immediately to close the modal
      return true;
    } catch (error) {
      console.error("Claim error:", error);
      if (
        error.message?.includes("rejected") ||
        error.message?.includes("denied")
      ) {
        toast.error("Transaction was rejected");
      } else {
        toast.error(error.message || "Failed to claim ETH");
      }
      throw error;
    }
  };

  const approveTokens = async (amount) => {
    if (!signer || !address) return false;

    try {
      setIsApproving(true);
      // Create token contract instance
      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        ERC20ABI.abi,
        signer
      );

      const approvalAmount = ethers.parseEther(amount);
      // Check current allowance
      const allowance = await tokenContract.allowance(
        address,
        STAKE_REWARD_CONTRACT_ADDRESS
      );

      if (allowance < approvalAmount) {
        // Approve for a large amount to avoid frequent approvals
        const tx = await tokenContract.approve(
          STAKE_REWARD_CONTRACT_ADDRESS,
          ethers.parseEther("1000000")
        );
        await tx.wait();
        toast.success("Token approval successful!");
        return true;
      }
      return true;
    } catch (error) {
      console.error("Token approval error:", error);
      if (
        error.message?.includes("rejected") ||
        error.message?.includes("denied")
      ) {
        toast.error("Approval rejected by user");
      } else {
        toast.error("Failed to approve tokens: " + error.message);
      }
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  // Handle staking tokens
  const handleStake = async () => {
    if (!signer || !address) {
      toast.error("Wallet not connected");
      setIsStaking(false);
      return;
    }

    if (!stakeAmount || isNaN(stakeAmount) || parseFloat(stakeAmount) <= 0) {
      toast.error("Please enter a valid amount to stake");
      setIsStaking(false);
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(tokenBalance)) {
      toast.error(`You can only stake up to ${tokenBalance} tokens`);
      setIsStaking(false);
      return;
    }

    if (chainId !== 11155420n) {
      toast.error("Please switch to Optimism Sepolia network");
      setIsStaking(false);
      return;
    }

    setIsStaking(true);
    try {
      const stakingContract = new ethers.Contract(
        STAKE_REWARD_CONTRACT_ADDRESS,
        StakingRewardsABI.abi,
        signer
      );

      // First approve token transfer
      const approved = await approveTokens(stakeAmount);
      if (!approved) {
        setIsStaking(false);
        return;
      }

      // Execute stake transaction
      const amount = ethers.parseEther(stakeAmount);

      const tx = await stakingContract.stake(amount);
      await tx.wait();

      // Update UI
      setStakeAmount("");

      // Refresh data
      await refetchTokenBalance();
      await refreshStakingData();
    } catch (error) {
      let errorMessage = "Failed to stake tokens";
      if (error.reason) {
        errorMessage = `Failed to stake: ${error.reason}`;
      } else if (
        error.message.includes("rejected") ||
        error.message.includes("denied")
      ) {
        errorMessage = "Transaction rejected by user";
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "Insufficient gas funds";
      }
      toast.error(errorMessage);
    } finally {
      setIsStaking(false);
    }
  };

  // Handle unstaking tokens
  const handleUnstake = async () => {
    if (!signer || !address) {
      toast.error("Wallet not connected");
      setIsUnstaking(false);
      return;
    }

    if (
      !unstakeAmount ||
      isNaN(unstakeAmount) ||
      parseFloat(unstakeAmount) <= 0
    ) {
      toast.error("Please enter a valid amount to unstake");
      setIsUnstaking(false);
      return;
    }

    if (parseFloat(unstakeAmount) > parseFloat(stakedAmount)) {
      toast.error(`You can only unstake up to ${stakedAmount} tokens`);
      setIsUnstaking(false);
      return;
    }

    if (chainId !== 11155420n) {
      toast.error("Please switch to Optimism Sepolia network");
      setIsUnstaking(false);
      return;
    }

    setIsUnstaking(true);
    try {
      const stakingContract = new ethers.Contract(
        STAKE_REWARD_CONTRACT_ADDRESS,
        StakingRewardsABI.abi,
        signer
      );

      const amount = ethers.parseEther(unstakeAmount);

      const tx = await stakingContract.unstake(amount);
      await tx.wait();

      setUnstakeAmount("");
      await refetchTokenBalance();
      await refreshStakingData();
    } catch (error) {
      let errorMessage = "Failed to unstake tokens";
      if (error.reason) {
        errorMessage = `Failed to unstake: ${error.reason}`;
      } else if (
        error.message.includes("rejected") ||
        error.message.includes("denied")
      ) {
        errorMessage = "Transaction rejected by user";
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "Insufficient gas funds";
      }
      toast.error(errorMessage);
    } finally {
      setIsUnstaking(false);
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

  // Function to copy address
  const copyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddresses((prev) => ({ ...prev, [address]: true }));
      setTimeout(() => {
        setCopiedAddresses((prev) => ({ ...prev, [address]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  // Toggle ABI expansion
  const toggleAbiExpansion = () => {
    setIsAbiExpanded(!isAbiExpanded);
  };

  return (
    <div className=" ">
      <Toaster
        position="center"
        className="mt-10"
        toastOptions={{
          style: {
            background: "#0a0a0a",
            color: "#fff",
            borderRadius: "8px",
            border: "1px gray solid",
          },
        }}
      />
      <div className="max-w-[1600px] mx-auto  px-3 sm:px-5 py-6 ">
        {/* Static Content */}
        <div className=" mb-6">
          <h2 className="text-xl text-white mb-4">Staking Reward Template</h2>
          <p className="text-[#A2A2A2] mb-4">
            Stake ERC20 tokens and earn rewards based on your participation.
            Once the staking threshold is reached, you'll automatically receive
            Reward NFTs and points. No manual setup required—the job will be
            auto-created for you.
          </p>

          <div className="space-y-4">
            <h3 className="text-white text-lg mb-2">Setup Flow</h3>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">1. Claim Tokens</h4>
                <p className="text-[#A2A2A2]">
                  Click "Claim Token" to receive predefined ERC20 tokens
                  directly into your wallet.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  2. Stake or Unstake
                </h4>
                <p className="text-[#A2A2A2]">
                  After claiming, choose whether to stake or unstake your tokens
                  based on your strategy.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  3. Staking Process
                </h4>
                <ul className="list-disc list-inside text-[#A2A2A2] space-y-1 ml-2">
                  <li>Enter your desired staking amount</li>
                  <li>Tokens will be locked in the contract</li>
                  <li>Your stake will be recorded and tracked</li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  4. Unstaking Options
                </h4>
                <ul className="list-disc list-inside text-[#A2A2A2] space-y-1 ml-2">
                  <li>View your current staked balance</li>
                  <li>Enter amount to unstake (if you have staked tokens)</li>
                  <li>
                    Receive notification if no tokens are currently staked
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  5. Automated Job Creation
                </h4>
                <p className="text-[#A2A2A2]">
                  A job is automatically created and visible on your dashboard
                  based on your staking status.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  6. Reward System
                </h4>
                <ul className="list-disc list-inside text-[#A2A2A2] space-y-1 ml-2">
                  <li>
                    Receive exclusive Reward NFTs upon reaching staking
                    threshold
                  </li>
                  <li>
                    Earn points as an NFT holder for future platform features
                  </li>
                  <li>Automatic reward distribution through smart contracts</li>
                </ul>
              </div>
            </div>

            <p className="text-[#A2A2A2] mt-6 italic">
              The entire process is automated through smart contracts - no
              manual intervention required after setup.
            </p>
          </div>
        </div>

        {/* Conditional Content */}
        <div className=" rounded-lg mb-6">
          <h2 className="text-xl text-white mb-3">
            Staking Reward Information
          </h2>
          <div className="text-[#A2A2A2] space-y-2">
            {!isConnected ? (
              <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
                <p className="text-white text-center">
                  Please connect your wallet to claim token and experiment with
                  staking and unstaking.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-4">
                  {!hasSufficientBalance ? (
                    <button
                      onClick={handleClaim}
                      className="bg-[#F8FF7C] text-black px-8 py-3 rounded-lg transition-colors text-lg hover:bg-[#E1E85A]"
                    >
                      💰 Claim ETH
                    </button>
                  ) : hasSufficientBalance &&
                    !hasSufficientTokenBalance &&
                    chainId === 11155420n ? (
                    <button
                      onClick={showStakeTokenClaimModal}
                      className="bg-[#F8FF7C] text-black px-8 py-3 rounded-lg transition-colors text-lg hover:bg-[#E1E85A]"
                    >
                      {isClaimingToken ? "Claiming..." : "🪙 Claim Token"}
                    </button>
                  ) : null}
                </div>

                {hasSufficientBalance && chainId !== 11155420n && (
                  <p className="mt-4 text-yellow-400">
                    Please switch to Optimism Sepolia network to claim tokens.
                  </p>
                )}

                {hasSufficientBalance &&
                  !hasSufficientTokenBalance &&
                  chainId === 11155420n && (
                    <p className="mt-4 text-[#77E8A3]">
                      You need to claim tokens before staking them.
                    </p>
                  )}

                {hasSufficientBalance &&
                  hasSufficientTokenBalance &&
                  chainId === 11155420n && (
                    <p className="mt-4 text-[#77E8A3]">
                      You have enough tokens to experiment.
                    </p>
                  )}
              </>
            )}
          </div>
        </div>

        <TransactionModal
          isOpen={showModal || showTokenClaimModal}
          onClose={() => {
            setShowModal(false);
            setShowTokenClaimModal(false);
          }}
          onConfirm={handleConfirm}
          modalType={modalType}
          modalData={modalData}
        />

        <ClaimModal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          onConfirm={confirmClaim}
          address={address}
          claimAmount={ETHClaimAmount}
          networkName={getNetworkName()}
        />

        {isConnected && stakingContract && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
              <h3 className="text-white text-lg mb-2">Your Staked Amount</h3>
              <p className="text-[#F8FF7C] text-2xl font-semibold">
                {parseFloat(stakedAmount).toFixed(2)} Tokens
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
              <h3 className="text-white text-lg mb-2">Total Staked</h3>
              <p className="text-[#77E8A3] text-2xl font-semibold">
                {parseFloat(totalStaked).toFixed(2)} Tokens
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
              <h3 className="text-white text-lg mb-2">NFT Reward</h3>
              <p className="text-2xl font-semibold">
                {hasNFT ? (
                  <span className="text-[#77E8A3]">Received ✓</span>
                ) : (
                  <span className="text-[#A2A2A2]">Not Yet</span>
                )}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
              <h3 className="text-white text-lg mb-2">
                Threshold for NFT Reward
              </h3>
              <p className="text-[#77E8A3]  text-2xl font-semibold">
                {THRESHOLD} STK
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-lg">
              <h3 className="text-white text-lg mb-2">
                Next Threshold for Reward Distribution
              </h3>
              <p className="text-[#77E8A3] text-2xl font-semibold">
                {parseFloat(nextThreshold).toFixed(2)} Tokens
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 p-5 rounded-lg my-6">
          <h2 className="text-xl text-white mb-3">Stake/Unstake Tokens</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Amount to stake"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-4 w-full"
                  step="0.1"
                  min="0"
                  disabled={
                    !isInitialized || isStaking || !hasSufficientTokenBalance
                  }
                />
                <button
                  onClick={handleStake}
                  disabled={
                    !isInitialized ||
                    isStaking ||
                    !stakeAmount ||
                    !hasSufficientTokenBalance
                  }
                  className={`bg-[#FFFFFF] text-black px-6 py-4 rounded-lg transition-colors whitespace-nowrap ${
                    !isInitialized ||
                    isStaking ||
                    !stakeAmount ||
                    !hasSufficientTokenBalance
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#E1E1E1]"
                  }`}
                >
                  {isApproving
                    ? "Approving..."
                    : isStaking
                      ? "Staking..."
                      : "Stake"}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="Amount to unstake"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-4 w-full"
                  step="0.1"
                  min="0"
                  max={stakedAmount}
                  disabled={
                    !isInitialized ||
                    isUnstaking ||
                    parseFloat(stakedAmount) <= 0
                  }
                />
                <button
                  onClick={handleUnstake}
                  disabled={
                    !isInitialized ||
                    isUnstaking ||
                    !unstakeAmount ||
                    parseFloat(stakedAmount) <= 0 ||
                    parseFloat(unstakeAmount) > parseFloat(stakedAmount)
                  }
                  className={`bg-[#FFFFFF] text-black px-6 py-4 rounded-lg transition-colors whitespace-nowrap ${
                    !isInitialized ||
                    isUnstaking ||
                    !unstakeAmount ||
                    parseFloat(stakedAmount) <= 0 ||
                    parseFloat(unstakeAmount) > parseFloat(stakedAmount)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#E1E1E1]"
                  }`}
                >
                  {isUnstaking ? "Unstaking..." : "Unstake"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Configuration Table */}
        <div className="p-4 rounded-lg mb-6 min-h-[40vh]">
          <h2 className="text-xl text-white mb-3">Job Configuration</h2>
          <div className="overflow-x-auto w-full">
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full min-w-full border-collapse">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-2 sm:px-4 md:px-6 py-5 text-left text-white w-3/5">
                      Parameter
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-5 text-left text-white w-2/5">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isConnected ? (
                    [
                      {
                        key: "jobType",
                        parameter: "Job Type",
                        value: jobConfig.jobType,
                      },
                      {
                        key: "argType",
                        parameter: "Arg Type",
                        value: jobConfig.argType,
                      },
                      {
                        key: "targetContractAddress",
                        parameter: "Target Contract Address",
                        value: jobConfig.targetContractAddress,
                      },
                      {
                        key: "targetFunction",
                        parameter: "Target Function",
                        value: jobConfig.targetFunction,
                      },
                      {
                        key: "triggerContractAddress",
                        parameter: "Trigger Contract Address",
                        value: jobConfig.triggerContractAddress,
                      },
                      {
                        key: "triggerEvent",
                        parameter: "Trigger Event",
                        value: jobConfig.triggerEvent,
                      },
                      {
                        key: "abi",
                        parameter: "ABI",
                        value: JSON.stringify(jobConfig.abi),
                      },
                    ].map((item) => (
                      <tr key={item.key} className="bg-[#1A1A1A]">
                        <td className="px-2 sm:px-4 md:px-6 py-5 text-[#A2A2A2] w-3/5 font-bold">
                          {item.parameter}
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-5 text-[#A2A2A2] w-2/5">
                          <div className="flex items-center gap-2">
                            {item.parameter === "ABI" ? (
                              <div className="w-full">
                                <button
                                  onClick={toggleAbiExpansion}
                                  className="flex items-center gap-2 hover:bg-white/10 rounded transition-colors w-full text-left"
                                >
                                  <span className="block truncate underline">
                                    {!isAbiExpanded
                                      ? "Expand ABI"
                                      : "Collapse ABI"}
                                  </span>
                                </button>
                                {isAbiExpanded && (
                                  <pre className="mt-2 p-2 bg-white/5 rounded-lg text-sm overflow-auto">
                                    {JSON.stringify(jobConfig.abi, null, 2)}
                                  </pre>
                                )}
                              </div>
                            ) : (
                              <>
                                <span className="block truncate">
                                  {item.parameter.includes("Address") &&
                                  item.value
                                    ? `${item.value.slice(0, 4)}...${item.value.slice(-15)}`
                                    : item.value}
                                </span>
                                {item.parameter.includes("Address") &&
                                  item.value && (
                                    <button
                                      onClick={() => copyAddress(item.value)}
                                      className="p-1 hover:bg-white/10 rounded transition-colors"
                                      title="Copy address"
                                    >
                                      {copiedAddresses[item.value] ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4 text-gray-400" />
                                      )}
                                    </button>
                                  )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-2 sm:px-4 md:px-6 py-4 text-center text-[#A2A2A2] h-[40vh]"
                      >
                        Please connect your wallet to view job configuration
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingReward;
