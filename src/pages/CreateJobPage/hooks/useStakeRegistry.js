// usestakeregistery
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY =
  process.env.REACT_APP_ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY;

export function useStakeRegistry() {
  const [stakeRegistryAddress, setStakeRegistryAddress] = useState("");
  const [stakeRegistryImplAddress, setStakeRegistryImplAddress] = useState("");
  const [stakeRegistryABI, setStakeRegistryABI] = useState("");

  useEffect(() => {
    const fetchStakeRegistryABI = async () => {
      let currentImplAddress = stakeRegistryImplAddress;

      if (!currentImplAddress) {
        const url =
          "https://raw.githubusercontent.com/trigg3rX/triggerx-contracts/main/contracts/script/output/stake.opsepolia.json";
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();

          if (data && data.triggerXStakeRegistry) {
            const proxyAddress = data.triggerXStakeRegistry.proxy;
            const implAddress = data.triggerXStakeRegistry.implementation;
            // console.log("Setting proxy address:", proxyAddress);
            // console.log("Setting implementation address:", implAddress);
            setStakeRegistryAddress(proxyAddress);
            setStakeRegistryImplAddress(implAddress);
            currentImplAddress = implAddress;
          } else {
            throw new Error("Stake registry data not found in GitHub response");
          }
        } catch (error) {
          // Catches network errors or errors thrown above
          console.error(
            "Error fetching initial stake registry addresses from GitHub:",
            error.message
          );
          setStakeRegistryABI(null);
          return;
        }
      }

      // 2. If we have an implementation address, fetch its ABI
      if (!currentImplAddress || !ethers.isAddress(currentImplAddress)) {
        if (stakeRegistryImplAddress) {
          console.warn(
            "Stake Registry: Implementation address is set but invalid, cannot fetch ABI.",
            currentImplAddress
          );
        }
        setStakeRegistryABI(null);
        return;
      }

      // console.log(
      //   `Stake Registry: Attempting to fetch ABI for implementation address: ${currentImplAddress}`
      // );
      let abiString = null;
      let abiSource = "";

      // 2a. Try Blockscout using fetch
      const blockscoutUrl = `https://optimism-sepolia.blockscout.com/api?module=contract&action=getabi&address=${currentImplAddress}`;
      try {
        // console.log(
        //   "Stake Registry: Attempting to fetch ABI from Blockscout (using fetch)..."
        // );
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
          // console.log(
          //   "Stake Registry: ABI fetched successfully from Blockscout."
          // );
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
