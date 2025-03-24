import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

//ContractDetails.js
export function ContractDetails({
  contractAddress,
  contractABI,
  targetFunction,
  functions,
  onContractAddressChange,
  onContractABIChange,
  onFunctionChange,
  argumentType,
  onArgumentTypeChange,
  setFunctionError,
  functionError,
}) {
  const selectedFunction = functions.find(
    (f) =>
      `${f.name}(${f.inputs.map((input) => input.type).join(",")})` ===
      targetFunction
  );
  const hasArguments = selectedFunction?.inputs?.length > 0;
  const [isFunctionOpen, setIsFunctionOpen] = useState(false);
  const [isArgumentTypeOpen, setIsArgumentTypeOpen] = useState(false);
  const [addressError, setAddressError] = useState("");
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

  const handleFunctionSelect = (signature) => {
    onFunctionChange({ target: { value: signature } });
    setIsFunctionOpen(false);
    setFunctionError(false); // Clear error once function is selected
  };

  const validateAddress = (address) => {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
    setAddressError(isValid ? "" : "Invalid contract address");
    return isValid;
  };

  const handleContractAddressChange = (e) => {
    const newAddress = e.target.value;
    validateAddress(newAddress);
    onContractAddressChange(e);
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
            <p className="text-red-500 text-xs mt-1">{addressError}</p>
          )}
        </div>
      </div>

      <div>
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
                <h4 className="text-gray-400 pr-2 text-xs xs:text-sm sm:text-base">
                  Not Available{" "}
                </h4>
                <h4 className="text-red-400 mt-[2px]"> ✕</h4>
              </div>
            )}
          </div>
        </div>
      </div>

      {contractAddress && !addressError && (
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
                className="break-all text-xs xs:text-sm sm:text-base w-full bg-[#1a1a1a] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center justify-between"
                aria-required
                onClick={() => setIsFunctionOpen(!isFunctionOpen)}
              >
                {targetFunction || "Select a function"}
                <ChevronDown className="text-white text-xs ml-4" />
              </div>
              {isFunctionOpen && (
                <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                  {functions.map((func, index) => {
                    const signature = `${func.name}(${func.inputs
                      .map((input) => input.type)
                      .join(",")})`;
                    return (
                      <div
                        key={index}
                        className="py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg text-xs xs:text-sm sm:text-base text-clip"
                        onClick={() => handleFunctionSelect(signature)}
                      >
                        {signature}
                      </div>
                    );
                  })}
                </div>
              )}
              {functionError && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a function.
                </p>
              )}
            </div>
          </div>

          {functions.length === 0 && contractAddress && (
            <h4 className="w-full md:w-[67%] xl:w-[78%] ml-auto text-xs xs:text-sm text-yellow-400">
              No writable functions found. Make sure the contract is verified on
              Blockscout / Etherscan.
            </h4>
          )}

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
              <div
                className={`text-xs xs:text-sm sm:text-base w-full bg-[#141414] text-white py-3 px-4 rounded-lg cursor-pointer border border-white/10 flex items-center justify-between ${
                  !hasArguments ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  hasArguments && setIsArgumentTypeOpen(!isArgumentTypeOpen)
                }
              >
                {argumentType === "static" ? "Static" : "Dynamic"}
                <ChevronDown className="text-white text-xs" />
              </div>
              {isArgumentTypeOpen && hasArguments && (
                <div className="absolute top-14 w-full bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                  {["static", "dynamic"].map((type) => (
                    <div
                      key={type}
                      className="py-3 px-4 hover:bg-[#333] cursor-pointer rounded-lg text-xs xs:text-sm sm:text-base"
                      onClick={() => {
                        onArgumentTypeChange({ target: { value: type } });
                        setIsArgumentTypeOpen(false);
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <h4 className="w-full md:w-[67%] xl:w-[78%] ml-auto text-xs text-gray-400">
            {hasArguments
              ? "Select how function arguments should be handled during execution"
              : "No arguments required for this function"}
          </h4>
        </>
      )}
    </div>
  );
}
