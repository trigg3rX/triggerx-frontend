// usestakeregistery
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY =
  process.env.REACT_APP_ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY;

const TRIGGER_GAS_REGISTRY_ADDRESS = process.env.REACT_APP_TRIGGER_GAS_REGISTRY_ADDRESS

export function useStakeRegistry() {
  const [stakeRegistryAddress, setStakeRegistryAddress] = useState("");
  const [stakeRegistryImplAddress, setStakeRegistryImplAddress] = useState("");
  const [stakeRegistryABI, setStakeRegistryABI] = useState("");

  useEffect(() => {
    const fetchStakeRegistryABI = async () => {
      let currentImplAddress = stakeRegistryImplAddress;

      // Set the stake registry address directly for Optimism Sepolia
      setStakeRegistryAddress(TRIGGER_GAS_REGISTRY_ADDRESS);

      if (!currentImplAddress) {
        const url =
          "https://raw.githubusercontent.com/trigg3rX/triggerx-contracts/main/contracts/script/output/stake.opsepolia.json";
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();

          if (data && data.TriggerXStakeRegistry) {
            const implAddress = data.triggerXStakeRegistry.implementation;
            // console.log("Setting implementation address from GitHub:", implAddress);
            setStakeRegistryImplAddress(implAddress);
            currentImplAddress = implAddress;
          } else {
            console.warn("Stake registry implementation data not found in GitHub response, proceeding with ABI fetch if address is valid.");
          }
        } catch (error) {
          console.warn(
            "Error fetching initial stake registry implementation address from GitHub, attempting ABI fetch with hardcoded address if valid:",
            error.message
          );
          // Do not set ABI to null here, let the later ABI fetch logic handle it.
        }
      }

      // 2. If we have an implementation address (either fetched or from previous state), fetch its ABI
      // If implementation address is still not set, try to use the proxy address as implementation to fetch ABI if it's a valid address
      if (!currentImplAddress) {
        currentImplAddress = TRIGGER_GAS_REGISTRY_ADDRESS; // Use the hardcoded address for ABI fetch if no implementation address was found from GitHub
      }

      if (!currentImplAddress || !ethers.isAddress(currentImplAddress)) {
        console.error(
          "Stake Registry: No valid implementation or contract address to fetch ABI for.",
          currentImplAddress
        );
        setStakeRegistryABI(null);
        return;
      }

      let abiString = null;
      let abiSource = "";

      // 2a. Try Blockscout using fetch
      const blockscoutUrl = `https://optimism-sepolia.blockscout.com/api?module=contract&action=getabi&address=${currentImplAddress}`;
      try {
       
        const response = await fetch(blockscoutUrl);

        if (!response.ok) {
          console.warn(
            `Stake Registry: Blockscout HTTP status was not ok: ${response.status} ${response.statusText}`
          );
          // Don't throw here, let the JSON check handle API-level errors
        }

        const data = await response.json();
        if (
          data.status === "1" &&
          data.result &&
          typeof data.result === "string" &&
          data.result.startsWith("[")
        ) {
          abiString = data.result;
          abiSource = "Blockscout";
         
        } else {
          // Log API-level failure from Blockscout
          console.warn(
            "Stake Registry: Failed to fetch ABI from Blockscout API.",
            data.message || "Status not '1' or no result"
          );
        }
      } catch (error) {
        // Catches network errors or JSON parsing errors
        console.warn(
          "Stake Registry: Error during fetch/parse from Blockscout:",
          error.message
        );
      }

      // 2b. If Blockscout failed, try Etherscan using fetch
      if (!abiString) {
        if (!ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY) {
          console.warn(
            "Stake Registry: Etherscan API key not configured. Skipping Etherscan fallback for Stake Registry."
          );
        } else {
          const etherscanUrl = `https://api-sepolia-optimism.etherscan.io/api?module=contract&action=getabi&address=${currentImplAddress}&apikey=${ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY}`;
          try {
            // console.log(
            //   "Stake Registry: Attempting to fetch ABI from Etherscan (Optimism Sepolia) (using fetch)..."
            // );
            const response = await fetch(etherscanUrl);

            if (!response.ok) {
              // Etherscan also often returns 200 OK for API errors (like invalid key),
              // rely on the JSON status field. Check .ok for actual network/server errors.
              console.warn(
                `Stake Registry: Etherscan HTTP status was not ok: ${response.status} ${response.statusText}`
              );
            }

            const data = await response.json();

            if (
              data.status === "1" &&
              data.result &&
              typeof data.result === "string" &&
              data.result.startsWith("[")
            ) {
              abiString = data.result;
              abiSource = "Etherscan (Optimism Sepolia)";
              // console.log(
              //   "Stake Registry: ABI fetched successfully from Etherscan."
              // );
            } else {
              // Log API-level failure from Etherscan (could be invalid key, rate limit, not verified etc.)
              console.warn(
                "Stake Registry: Failed to fetch ABI from Etherscan API.",
                data.message || data.result || "Status not '1' or no result"
              );
            }
          } catch (error) {
            // Catches network errors or JSON parsing errors
            console.warn(
              "Stake Registry: Error during fetch/parse from Etherscan:",
              error.message
            );
          }
        }
      }

      // 3. Set the ABI if fetched
      if (abiString) {
        try {
          setStakeRegistryABI(JSON.parse(abiString));
          // console.log(
          //   `Stake Registry: ABI successfully parsed and set from ${abiSource}.`
          // );
        } catch (parseError) {
          console.error(
            `Stake Registry: Error parsing ABI JSON from ${abiSource}:`,
            parseError.message,
            "ABI String:",
            abiString.substring(0, 100) + "..."
          );
          setStakeRegistryABI(null);
        }
      } else {
        console.error(
          `Stake Registry: Failed to fetch ABI for ${currentImplAddress} from all sources.`
        );
        setStakeRegistryABI(null);
      }
    };

    fetchStakeRegistryABI();
  }, [stakeRegistryImplAddress]); // Effect runs when stakeRegistryImplAddress changes

  return {
    stakeRegistryAddress,
    stakeRegistryImplAddress,
    stakeRegistryABI,
  };
}

