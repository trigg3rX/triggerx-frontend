// contract details
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

//ContractDetails.js
export function ContractDetails({
  contractAddress,
  setContractAddress,
  contractABI,
  setContractABI,
  functions,
  setFunctions,
  targetFunction,
  setTargetFunction,
  argumentType,
  setArgumentType,
  argsArray,
  setArgArray,
  ipfsCodeUrl,
  setIpfsCodeUrl,
  sourceType,
  setSourceType,
  sourceUrl,
  setSourceUrl,
  conditionType,
  setConditionType,
  upperLimit,
  setUpperLimit,
  lowerLimit,
  setLowerLimit,
  jobKey,
  jobType,
}) {
  const [isFunctionOpen, setIsFunctionOpen] = useState(false);
  const [isArgumentTypeOpen, setIsArgumentTypeOpen] = useState(false);
  const [isConditionTypeOpen, setIsConditionTypeOpen] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [ipfsCodeUrlError, setIpfsCodeUrlError] = useState("");
  const [sourceUrlError, setSourceUrlError] = useState("");
  const [manualABI, setManualABI] = useState("");
  const [showManualABIInput, setShowManualABIInput] = useState(false);

  const selected = functions.find(
    (f) =>
      `${f.name}(${f.inputs.map((input) => input.type).join(",")})` ===
      targetFunction
  );
  const hasArguments = selected?.inputs?.length > 0;

  const dropdownRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFunctionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdown2Ref = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdown2Ref.current &&
        !dropdown2Ref.current.contains(event.target)
      ) {
        setIsArgumentTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const conditionTypeDropdownRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        conditionTypeDropdownRef.current &&
        !conditionTypeDropdownRef.current.contains(event.target)
      ) {
        setIsConditionTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateAddress = (address) => {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
    setAddressError(isValid ? "" : "Invalid contract address");
    return isValid;
  };

  function extractFunctions(abi) {
    // console.log("Extracting functions from ABI:", abi);
    try {
      let abiArray;
      if (typeof abi === "string") {
        try {
          abiArray = JSON.parse(abi);
        } catch (e) {
          throw new Error("Invalid ABI string format");
        }
      } else if (Array.isArray(abi)) {
        abiArray = abi;
      } else if (typeof abi === "object") {
        abiArray = [abi];
      } else {
        throw new Error("ABI must be an array, object, or valid JSON string");
      }

      if (!Array.isArray(abiArray)) {
        throw new Error("Processed ABI is not an array");
      }

      const functions = abiArray
        .filter((item) => item && item.type === "function")
        .map((func) => ({
          name: func.name || "unnamed",
          inputs: func.inputs || [],
          outputs: func.outputs || [],
          stateMutability: func.stateMutability || "nonpayable",
          payable: func.payable || false,
          constant: func.constant || false,
        }));

      // console.log("Extracted functions:", functions);
      return functions;
    } catch (error) {
      // console.error("Error processing ABI:", error);
      return [];
    }
  }

  // ... (validateAddress, setContractAddress, helper functions are the same) ...

  const handleContractAddressChange = async (e) => {
    const address = e.target.value;
    validateAddress(address);

    // console.log("Contract address changed to:", address);
    setContractAddress(address);
    // Clear target function and manual ABI when contract address changes
    setTargetFunction("");
    setManualABI("");
    setShowManualABIInput(false);

    const processSuccessfulAbi = (abiResult, source) => {
      // console.log(`ABI fetched successfully from ${source}`);
      try {
        // Ensure the result is actually a parsable ABI
        JSON.parse(abiResult); // This will throw if abiResult is not valid JSON
        const writableFunctions = extractFunctions(abiResult).filter(
          (func) =>
            func.stateMutability === "nonpayable" ||
            func.stateMutability === "payable"
        );
        // console.log("Setting writable functions:", writableFunctions);
        setFunctions(writableFunctions);
        setContractABI(abiResult);
        setShowManualABIInput(false);
        return true; // Indicate success
      } catch (jsonError) {
        console.error(
          `Error processing ABI from ${source}: Not valid JSON.`,
          jsonError.message
        );
        console.error(
          "Problematic ABI string:",
          abiResult.substring(0, 200) + "..."
        ); // Log part of the problematic string
        handleAbiFetchFailure(
          source,
          `Received data from ${source}, but it's not a valid ABI JSON.`
        );
        return false; // Indicate failure
      }
    };

    const handleAbiFetchFailure = (source, errorDetails) => {
      console.warn(
        `Failed to fetch or process ABI from ${source}. Details:`,
        errorDetails
      );
    };

    const resetAndShowManualInput = (reason) => {
      // console.log(reason);
      setShowManualABIInput(true);
      setContractABI("");
      setFunctions([]);
    };

    if (ethers.isAddress(address)) {
      let abiFetched = false;

      // 1. Try Blockscout
      const blockscoutUrl = `https://optimism-sepolia.blockscout.com/api?module=contract&action=getabi&address=${address}`;
      try {
        const response = await axios.get(blockscoutUrl);
        const data = response.data;
        if (
          data.status === "1" &&
          data.result &&
          typeof data.result === "string" &&
          data.result.startsWith("[")
        ) {
          if (processSuccessfulAbi(data.result, "Blockscout")) {
            abiFetched = true;
          }
          // if processSuccessfulAbi returns false, abiFetched remains false
        } else {
          handleAbiFetchFailure(
            "Blockscout",
            `Status: ${data.status}, Message: ${data.message || "N/A"}, Result: ${data.result ? data.result.substring(0, 100) + "..." : "No result"}`
          );
        }
      } catch (error) {
        handleAbiFetchFailure(
          "Blockscout",
          `Network error or other issue: ${error.message}`
        );
      }

      // 2. If Blockscout failed or its result wasn't a valid ABI, try Etherscan
      if (!abiFetched) {
        const ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY =
          process.env.REACT_APP_ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY;

        if (!ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY) {
          console.warn(
            "Etherscan API key (REACT_APP_ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY) is missing or empty. Skipping Etherscan fallback."
          );
        } else {
          const etherscanUrl = `https://api-sepolia-optimism.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_OPTIMISM_SEPOLIA_API_KEY}`;
          try {
            const response = await axios.get(etherscanUrl);
            const data = response.data;

            // Log the raw Etherscan response for detailed debugging
            // console.log(
            //   "Raw Etherscan API response data:",
            //   JSON.stringify(data, null, 2)
            // );

            if (
              data.status === "1" &&
              data.result &&
              typeof data.result === "string" &&
              data.result.startsWith("[")
            ) {
              if (
                processSuccessfulAbi(
                  data.result,
                  "Etherscan (Optimism Sepolia)"
                )
              ) {
                abiFetched = true;
              }
              // if processSuccessfulAbi returns false, abiFetched remains false
            } else {
              // More detailed failure reason from Etherscan
              let failureReason = `Status: ${data.status}.`;
              if (data.message) failureReason += ` Message: ${data.message}.`;
              if (data.result)
                failureReason += ` Result: ${data.result.substring(0, 100) + "..."}.`; // Show a snippet of the result if it's not the ABI
              else failureReason += ` Result was empty/null.`;

              handleAbiFetchFailure(
                "Etherscan (Optimism Sepolia)",
                failureReason +
                  "(Check API key validity, contract verification on Etherscan, and network settings)."
              );
            }
          } catch (error) {
            console.error("Axios error fetching from Etherscan:", error);
            handleAbiFetchFailure(
              "Etherscan (Optimism Sepolia)",
              `Network error or other issue: ${error.message}`
            );
          }
        }
      }

      // 3. If ABI still not fetched after all attempts, then show manual input
      if (!abiFetched) {
        resetAndShowManualInput(
          "ABI not found or processed successfully from Blockscout or Etherscan. Showing manual input."
        );
      }
    } else {
      // Address is invalid
      setContractABI("");
      setFunctions([]);
      setShowManualABIInput(false);
    }
  };

  const handleManualABIChange = (e) => {
    const abi = e.target.value;
    setManualABI(abi);
    try {
      JSON.parse(abi);
      const writableFunctions = extractFunctions(abi).filter(
        (func) =>
          func.stateMutability === "nonpayable" ||
          func.stateMutability === "payable"
      );
      // console.log("Setting writable functions:", writableFunctions);
      setFunctions(writableFunctions);
      setContractABI(abi);

      // Reset target function when ABI changes
      setTargetFunction("");
    } catch (error) {
      console.error("Error processing manual ABI:", error);
      setFunctions([]);
      setContractABI("");
      setTargetFunction("");
    }
  };

  const handleFunctionChange = (e) => {
    const selectedValue = e.target.value;
    // console.log("Function selection changed to:", selectedValue);
    setTargetFunction(selectedValue);
  };

  const handleFunctionSelect = (signature) => {
    handleFunctionChange({ target: { value: signature } });
    setIsFunctionOpen(false);
  };

  const handleArgumentTypeChange = (e) => {
    const newType = e.target.value;
    // console.log("Argument type changed to:", newType);
    setArgumentType(newType);
  };

  const isDisabled = argumentType === "dynamic";

  const handleInputChange = (index, value) => {
    const newInputs = [...argsArray];
    newInputs[index] = value;
    setArgArray(newInputs);
  };

  const handleCodeUrlChange = (e) => {
    const value = e.target.value;
    setIpfsCodeUrl(value);

    // Clear error if input is empty
    if (!value) {
      setIpfsCodeUrlError("");
      return;
    }

    // Validation logic:
    if (!isValidIpfsUrl(value)) {
      setIpfsCodeUrlError("Please enter a valid IPFS URL (e.g., ipfs://... or https://ipfs.io/ipfs/...)");
    } else {
      setIpfsCodeUrlError(""); // Clear the error if valid
    }
  };

  const isValidIpfsUrl = (url) => {
    // Allow empty string
    if (!url) return true;
  
    // Trim whitespace
    url = url.trim();
    if (!url) return true;
  
    try {
      // Check for IPFS protocol
      if (url.startsWith("ipfs://")) {
        const cid = url.replace("ipfs://", "");
        return isValidCID(cid);
      }
  
      // Check for HTTP/HTTPS gateway URLs
      if (url.startsWith("http://") || url.startsWith("https://")) {
        const urlObj = new URL(url);
        
        // Check standard gateway format (/ipfs/CID)
        const pathMatch = urlObj.pathname.match(/^\/ipfs\/([a-zA-Z0-9]+)$/);
        if (pathMatch) {
          return isValidCID(pathMatch[1]);
        }
  
        // Check subdomain format (CID.ipfs.gateway.com)
        const subdomainMatch = urlObj.hostname.match(/^([a-zA-Z0-9]+)\.ipfs\./);
        if (subdomainMatch && urlObj.pathname === '/') {
          return isValidCID(subdomainMatch[1]);
        }
  
        return false;
      }
  
      return false;
    } catch (error) {
      // Invalid URL format
      return false;
    }
  };
  
  const isValidCID = (cid) => {
    if (!cid || typeof cid !== 'string') return false;
  
    // CIDv0: Starts with 'Qm' and is 46 characters long (base58)
    if (cid.startsWith('Qm') && cid.length === 46) {
      return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid);
    }
  
    // CIDv1: Starts with 'b' (base32) or other multibase prefixes
    if (cid.length >= 59) { // Minimum length for CIDv1
      // Base32 (most common for CIDv1)
      if (/^b[a-z2-7]{58,}$/.test(cid)) return true;
      
      // Base58 CIDv1
      if (/^z[1-9A-HJ-NP-Za-km-z]{58,}$/.test(cid)) return true;
      
      // Base16 (hex)
      if (/^f[0-9a-f]{60,}$/i.test(cid)) return true;
    }
  
    return false;
  };


  const selectedFunction = functions.find((func) => {
    const signature = `${func.name}(${func.inputs
      .map((input) => input.type)
      .join(",")})`;
    return signature === targetFunction;
  });
  const functionInputs = selectedFunction?.inputs || [];

  const handleSourceTypeChange = (e) => {
    // console.log("Source type changed to:", e.target.value);
    setSourceType(e.target.value);
  };

  const handleSourceUrlChange = (e) => {
    const url = e.target.value;
    setSourceUrl(url);
    setSourceUrlError("");

    if (!url) {
      setSourceUrlError("Source URL is required");
      return;
    }

    try {
      const urlObj = new URL(url);

      switch (sourceType) {
        case "API":
          if (!urlObj.protocol.match(/^https?:$/)) {
            setSourceUrlError("API URL must use HTTP or HTTPS protocol");
          }
          break;
        case "WebSocket":
          if (!urlObj.protocol.match(/^wss?:$/)) {
            setSourceUrlError("WebSocket URL must use WS or WSS protocol");
          }
          break;
        case "Oracle":
          if (!urlObj.protocol.match(/^https?:$/)) {
            setSourceUrlError("Oracle URL must use HTTP or HTTPS protocol");
          }
          break;
        default:
          setSourceUrlError("Invalid source type");
          break;
      }
    } catch (error) {
      setSourceUrlError("Please enter a valid URL");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <label
          htmlFor="contractAddress"
          className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
        >
          Contract Address
        </label>
        <div className="w-full md:w-[70%] xl:w-[80%]">
          <input
            type="text"
            id="contractAddress"
            required
            value={contractAddress}
            onChange={handleContractAddressChange}
            placeholder="Your Contract address"
            className={`text-xs xs:text-sm sm:text-base w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
              addressError ? "border-red-500" : "border-white/10"
            }`}
          />
          {addressError && (
            <p className="text-red-500 text-xs mt-1 ml-1">{addressError}</p>
          )}
        </div>
      </div>
      {contractAddress && (
        <div className="flex items-center justify-between gap-6">
          <h4 className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap">
            Contract ABI
          </h4>
          <div className="w-[70%] xl:w-[80%] text-start ml-3">
            {contractABI ? (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <div className="flex items-center ml-3">
                <h4 className="text-gray-400 pr-2 text-xs xs:text-sm sm:text-base hidden md:block">
                  Not Available{" "}
                </h4>
                <h4 className="text-red-400 mt-[2px]"> ✕</h4>
              </div>
            )}
          </div>
        </div>
      )}
      {showManualABIInput && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <label
            htmlFor="manualABI"
            className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
          >
            Manual ABI Input
          </label>
          <div className="w-full md:w-[70%] xl:w-[80%]">
            <textarea
              id="manualABI"
              value={manualABI}
              onChange={handleManualABIChange}
              placeholder={`Enter contract ABI manually (JSON format), e.g.
[
  {
    "inputs": [],
    "name": "functionName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`}
              className="text-xs xs:text-sm sm:text-base w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none min-h-[260px]"
            />
            <p className="text-xs text-gray-400 mt-2">
              Enter the contract ABI in JSON format if automatic fetch fails
            </p>
          </div>
        </div>
      )}
      {contractAddress && contractABI && !addressError && (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <label
              htmlFor="targetFunction"
              className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
            >
              Target Function
            </label>

            <div
              ref={dropdownRef}
              className="relative w-full md:w-[70%] xl:w-[80%] z-50"
            >
              <div
                className="break-all text-sm xs:text-sm sm:text-base w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center justify-between"
                aria-required
                onClick={() => setIsFunctionOpen(!isFunctionOpen)}
              >
                {targetFunction || "Select a function"}
                <ChevronDown className="text-white text-xs ml-4" />
              </div>
              {isFunctionOpen && (
                <li className="list-none absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-visible shadow-lg z-50">
                  {functions.map((func, index) => {
                    const signature = `${func.name}(${func.inputs
                      .map((input) => input.type)
                      .join(",")})`;
                    return (
                      <div
                        key={index}
                        className="break-all py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg text-sm xs:text-sm sm:text-base text-clip"
                        onClick={() => handleFunctionSelect(signature)}
                      >
                        {signature}
                      </div>
                    );
                  })}
                </li>
              )}
            </div>
          </div>

          {functions.length === 0 && (contractAddress || manualABI) && (
            <h4 className="w-full md:w-[67%] xl:w-[78%] ml-auto text-xs xs:text-sm text-yellow-400">
              No writable functions found. Make sure the contract is verified on
              Blockscout / Etherscan or the ABI is valid.
            </h4>
          )}

          {targetFunction && (
            <>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <label
                  htmlFor="argumentType"
                  className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
                >
                  Argument Type
                </label>
                <div
                  ref={dropdown2Ref}
                  className="relative w-full md:w-[70%] xl:w-[80%] z-30"
                >
                  <li
                    className={`list-none text-sm xs:text-sm sm:text-base w-full bg-[#141414] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center justify-between ${
                      !hasArguments ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      hasArguments && setIsArgumentTypeOpen(!isArgumentTypeOpen)
                    }
                  >
                    {argumentType === "static" ? "Static" : "Dynamic"}
                    <ChevronDown className="text-white text-xs" />
                  </li>
                  <h4 className="w-full ml-1 mt-3 text-xs text-gray-400">
                    {hasArguments
                      ? "Select how function arguments should be handled during execution"
                      : "No arguments required for this function"}
                  </h4>
                  {isArgumentTypeOpen && hasArguments && (
                    <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                      {["static", "dynamic"].map((type) => (
                        <li
                          key={type}
                          className="list-none py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg text-sm xs:text-sm sm:text-base"
                          onClick={() => {
                            handleArgumentTypeChange({
                              target: { value: type },
                            });
                            setIsArgumentTypeOpen(false);
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </li>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
      {targetFunction && functionInputs.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between  flex-col lg:flex-row md:flex-row">
            <label className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap mb-3 lg:mb-6">
              Function Arguments
            </label>
            {isDisabled && (
              <span className="text-sm text-yellow-400 lg:mb-6 m-3">
                Arguments disabled for dynamic type
              </span>
            )}
          </div>
          {!isDisabled &&
            functionInputs.map((input, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between mt-6"
              >
                <label className="break-all block text-sm text-gray-400 text-nowrap tracking-wide">
                  {input.name || `Argument ${index + 1}`} ()
                </label>
                <input
                  type="text"
                  value={argsArray[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={`text-xs xs:text-sm sm:text-base w-full md:w-[60%] xl:w-[70%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed bg-gray-800"
                      : ""
                  }`}
                  placeholder={`Enter ${input.type}`}
                  disabled={isDisabled}
                  readOnly={isDisabled}
                  required
                />
              </div>
            ))}
        </div>
      )}
      {argumentType !== "static" && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <label
            htmlFor="ipfsCodeUrl"
            className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
          >
            IPFS Code URL
          </label>
          <div className="w-full md:w-[70%] xl:w-[80%]">
            <input
              id="ipfsCodeUrl"
              value={ipfsCodeUrl}
              required
              onChange={(e) => handleCodeUrlChange(e)}
              className={`text-xs xs:text-sm sm:text-base w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                ipfsCodeUrlError ? "border-red-500" : "border-white/10"
              }`}
              placeholder="Enter IPFS URL or CID (e.g., ipfs://... or https://ipfs.io/ipfs/...)"
            />
            {ipfsCodeUrlError && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {ipfsCodeUrlError}
              </p>
            )}
            <h4 className="w-full ml-1 mt-3 text-xs text-gray-400">
              Provide an IPFS URL or CID, where your code is stored.
            </h4>
          </div>
        </div>
      )}
      
      {jobType === 2 && (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <label
              htmlFor={`sourceType-${jobKey}`}
              className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
            >
              Source Type
            </label>
            <div className="w-full md:w-[70%] xl:w-[80%] flex gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`sourceType-${jobKey}`}
                  value="API"
                  checked={sourceType === "API"}
                  onChange={handleSourceTypeChange}
                  className="form-radio h-4 w-4 text-blue-500 accent-[#F8FF7C]"
                />
                <span className="text-sm text-gray-300">API</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`sourceType-${jobKey}`}
                  value="WebSocket"
                  checked={sourceType === "WebSocket"}
                  onChange={handleSourceTypeChange}
                  className="form-radio h-4 w-4 text-blue-500 accent-[#F8FF7C]"
                />
                <span className="text-sm text-gray-300">WebSocket</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`sourceType-${jobKey}`}
                  value="Oracle"
                  checked={sourceType === "Oracle"}
                  onChange={handleSourceTypeChange}
                  disabled
                  className="form-radio h-4 w-4 text-blue-500 accent-[#F8FF7C] opacity-50 cursor-not-allowed"
                />
                <span className="text-sm text-gray-300 opacity-50">Oracle</span>
              </label>
            </div>
          </div>

          {sourceType && (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <label
                htmlFor="sourceUrl"
                className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
              >
                Source URL
              </label>
              <div className="w-full md:w-[70%] xl:w-[80%]">
                <input
                  type="text"
                  id="sourceUrl"
                  required
                  value={sourceUrl}
                  onChange={handleSourceUrlChange}
                  placeholder={`Enter ${sourceType.toLowerCase()} URL`}
                  className={`text-xs xs:text-sm sm:text-base w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none ${
                    sourceUrlError ? "border-red-500" : "border-white/10"
                  }`}
                />
                {sourceUrlError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {sourceUrlError}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <label
              htmlFor="conditionType"
              className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap"
            >
              Condition Type
            </label>
            <div
              ref={conditionTypeDropdownRef}
              className="relative w-full md:w-[70%] xl:w-[80%] z-30"
            >
              <div
                className="w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center justify-between text-xs xs:text-sm sm:text-base"
                aria-required
                onClick={() => setIsConditionTypeOpen(!isConditionTypeOpen)}
              >
                {conditionType || "Select a condition type"}
                <ChevronDown className="text-white text-xs ml-4" />
              </div>
              {isConditionTypeOpen && (
                <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg z-40">
                  {[
                    {
                      value: "Equals to",
                      label: "Equals to",
                    },
                    {
                      value: "Not Equals to",
                      label: "Not Equals to",
                    },
                    {
                      value: "Less Than",
                      label: "Less Than",
                    },
                    {
                      value: "Greater Than",
                      label: "Greater Than",
                    },
                    {
                      value: "In Range",
                      label: "In Range",
                    },
                    {
                      value: "Less Than or Equals to",
                      label: "Less Than or Equals to",
                    },
                    {
                      value: "Greater Than or Equals to",
                      label: "Greater Than or Equals to",
                    },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg text-xs xs:text-sm sm:text-base"
                      onClick={() => {
                        setConditionType(option.value);
                        if (option.value !== "In Range") {
                          setLowerLimit("0");
                        }
                        setIsConditionTypeOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {conditionType && (
            <>
              {conditionType === "In Range" ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <label className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap">
                    Limits
                  </label>
                  <div className="flex gap-4 w-full md:w-[70%] xl:w-[80%]">
                    <div className="flex-1">
                      <label
                        htmlFor="upperLimit"
                        className="block text-xs text-gray-400 mb-1"
                      >
                        Upper Limit
                      </label>
                      <input
                        id="upperLimit"
                        type="number"
                        value={upperLimit}
                        onChange={(e) => setUpperLimit(e.target.value)}
                        className="text-xs xs:text-sm sm:text-base w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                        placeholder="Enter upper limit"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="lowerLimit"
                        className="block text-xs text-gray-400 mb-1"
                      >
                        Lower Limit
                      </label>
                      <input
                        id="lowerLimit"
                        type="number"
                        value={lowerLimit}
                        onChange={(e) => setLowerLimit(e.target.value)}
                        className="text-xs xs:text-sm sm:text-base w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                        placeholder="Enter lower limit"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <label className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap">
                    Value
                  </label>
                  <input
                    type="number"
                    value={upperLimit} // Use upperLimit for single value
                    onChange={(e) => setUpperLimit(e.target.value)}
                    className="text-xs xs:text-sm sm:text-base w-full md:w-[70%] xl:w-[80%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                    placeholder="Enter value"
                    required
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
