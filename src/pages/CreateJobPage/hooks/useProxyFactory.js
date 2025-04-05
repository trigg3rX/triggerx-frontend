import { useAccount, useChainId, useConfig, usePublicClient } from "wagmi";
import ProxyFactory from "../../../artifacts/ProxyFactory.json";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";

export function useProxyFactory() {
  const chainId = useChainId();
  const config = useConfig();
  const chain = config.chains.find(c => c.id === chainId);
  const publicClient = usePublicClient();
  const { address: userAddress } = useAccount();

  const generateSalt = async (targetAddress) => {
    try {
      if (!publicClient) throw new Error("Public client not available");
      if (!targetAddress) throw new Error("Target address is required");
      if (!userAddress) throw new Error("User address is required");
      
      // Get the current nonce for the user's address
      const nonce = await publicClient.getTransactionCount({
        address: userAddress
      });
      
      // Create a deterministic salt by combining target address, user address, and nonce
      const saltString = `${targetAddress.toLowerCase()}-${userAddress.toLowerCase()}-${nonce}`;
      console.log("Generating salt with:", saltString);
      
      // Convert to bytes and hash
      const saltBytes = ethers.toUtf8Bytes(saltString);
      const salt = ethers.keccak256(saltBytes);
      console.log("Generated salt:", salt);
      
      return salt;
    } catch (error) {
      console.error("Error in generateSalt:", error);
      throw error;
    }
  };

  const deployNewProxy = async (target, userAddress) => {
    try {
      if (!target) throw new Error("Target address is required");
      if (!userAddress) throw new Error("User address is required");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(
        ProxyFactory.contractAddress,
        ProxyFactory.abi,
        signer
      );

      const salt = await generateSalt(target);
      
      // Get the proxy address before deployment
      const proxyAddress = await factoryContract.getProxyAddress(target, salt);
      console.log("Calculated proxy address:", proxyAddress);
      
      // Deploy proxy
      const tx = await factoryContract.deployProxy(target, salt);
      console.log("Deployment transaction:", tx);
      await tx.wait();

      return {
        hash: tx.hash,
        salt,
        proxyAddress
      };
    } catch (error) {
      console.error("Error in deployNewProxy:", error);
      toast.error("Failed to deploy proxy: " + error.message);
      throw error;
    }
  };

  return {
    deployNewProxy
  };
}