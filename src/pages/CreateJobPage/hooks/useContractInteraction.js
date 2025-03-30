//useContractInteraction.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

export function useContractInteraction(jobType) {
  const [contractAddress, setContractAddress] = useState("");
  const [contractABI, setContractABI] = useState("");
  const [functions, setFunctions] = useState([]);
  const [targetFunction, setTargetFunction] = useState("");
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionInputs, setFunctionInputs] = useState([]);
  const [argumentsInBytes, setArgumentsInBytes] = useState([]);
  const [argsArray, setArgArray] = useState([]);
  const [argumentType, setArgumentType] = useState("static");

  const [events, setEvents] = useState([]); // Added for events
  const [selectedEvent, setSelectedEvent] = useState(null); // Added for events
  const [targetEvent, setTargetEvent] = useState(""); // Added for event selection
  const [eventInputs, setEventInputs] = useState([]); // Added for event parameters

  function extractFunctions(abi) {
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

      console.log("Extracted functions:", functions);
      return functions;
    } catch (error) {
      console.error("Error processing ABI:", error);
      return [];
    }
  }

  // New function to extract events from ABI
  function extractEvents(abi) {
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

      const events = abiArray
        .filter((item) => item && item.type === "event")
        .map((event) => ({
          name: event.name || "unnamed",
          inputs: event.inputs || [],
          anonymous: event.anonymous || false,
        }));

      console.log("Extracted events:", events);
      return events;
    } catch (error) {
      console.error("Error processing events from ABI:", error);
      return [];
    }
  }

  const handleContractAddressChange = async (e) => {
    const address = e.target.value;
    console.log("Contract address changed to:", address);
    setContractAddress(address);

    if (ethers.isAddress(address)) {
      const url = `https://optimism-sepolia.blockscout.com/api?module=contract&action=getabi&address=${address}`;
      try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.status === "1") {
          const writableFunctions = extractFunctions(data.result).filter(
            (func) =>
              func.stateMutability === "nonpayable" ||
              func.stateMutability === "payable"
          );
          console.log("Setting writable functions:", writableFunctions);
          setFunctions(writableFunctions);

          // Extract and set events
          const contractEvents = extractEvents(data.result);
          console.log("Setting contract events:", contractEvents);
          setEvents(contractEvents);

          setContractABI(data.result);
        } else {
          throw new Error(`Failed to fetch ABI: ${data.message}`);
        }
      } catch (error) {
        console.error("Error fetching ABI:", error.message);
        throw error;
      }
    } else {
      console.log("Invalid address, clearing ABI");
      setContractABI("");
    }
  };

  const handleFunctionChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Function selection changed to:", selectedValue);
    setTargetFunction(selectedValue);

    const func = functions.find(
      (f) =>
        `${f.name}(${f.inputs.map((input) => input.type).join(",")})` ===
        selectedValue
    );
    setSelectedFunction(func);

    // Reset argument type if function has no inputs
    if (!func?.inputs?.length) {
      setArgumentType("static");
    }

    if (func) {
      setFunctionInputs(func.inputs.map(() => ""));
      setArgArray(func.inputs.map(() => ""));
    } else {
      setFunctionInputs([]);
      setArgArray([]);
    }
  };

  // New handler for event selection
  const handleEventChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Event selection changed to:", selectedValue);
    setTargetEvent(selectedValue);

    const event = events.find(
      (e) =>
        `${e.name}(${e.inputs.map((input) => input.type).join(",")})` ===
        selectedValue
    );
    setSelectedEvent(event);

    if (event) {
      setEventInputs(event.inputs.map(() => ""));
    } else {
      setEventInputs([]);
    }
  };

  const handleArgumentTypeChange = (e) => {
    const newType = e.target.value;
    console.log("Argument type changed to:", newType);
    setArgumentType(newType);

    // Clear inputs when switching to dynamic
    if (newType === "dynamic") {
      const emptyInputs = selectedFunction?.inputs?.map(() => "") || [];
      setFunctionInputs(emptyInputs);
      setArgArray(emptyInputs);
    }
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...functionInputs];
    newInputs[index] = value;
    setFunctionInputs(newInputs);
    setArgArray(newInputs);

    if (newInputs.every((input) => input !== "")) {
      const bytesArray = newInputs.map((arg) => {
        const hexValue = ethers.toBeHex(arg);
        return hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`;
      });
      setArgumentsInBytes(bytesArray);
    } else {
      console.log("Not all inputs filled, clearing bytes array");
      setArgumentsInBytes([]);
    }
  };

  // New handler for event input changes
  const handleEventInputChange = (index, value) => {
    const newInputs = [...eventInputs];
    newInputs[index] = value;
    setEventInputs(newInputs);
  };

  // Function to emit an event (for testing or simulation purposes)
  const emitEvent = async (provider) => {
    if (!selectedEvent || !contractAddress || !contractABI) {
      console.error("Missing event details, contract address, or ABI");
      return;
    }

    try {
      const contract = new ethers.Contract(
        contractAddress,
        JSON.parse(contractABI),
        provider
      );

      // Create a filter for the event
      const filter = contract.filters[selectedEvent.name]();

      // Return a function that allows subscribing to the event
      return {
        subscribe: (callback) => {
          // Listen for the event
          contract.on(filter, (...args) => {
            // The last argument is the event object
            const event = args[args.length - 1];
            callback(event);
          });

          // Return a function to unsubscribe
          return () => {
            contract.removeAllListeners(filter);
          };
        },
        // Get past events
        getPastEvents: async (fromBlock = 0, toBlock = "latest") => {
          const events = await contract.queryFilter(filter, fromBlock, toBlock);
          return events;
        },
      };
    } catch (error) {
      console.error("Error setting up event listener:", error);
      throw error;
    }
  };

  useEffect(() => {
    const bytesArray = functionInputs.map((arg) => {
      if (arg === "") return "0x";
      try {
        const hexValue = ethers.toBeHex(arg);
        const paddedHex =
          hexValue.length % 2 === 0 ? hexValue : `0x0${hexValue.slice(2)}`;
        return paddedHex;
      } catch (error) {
        console.error("Error converting input to hex:", error);
        return "0x";
      }
    });
    console.log("Setting arguments in bytes:", bytesArray);
    setArgumentsInBytes(bytesArray);
  }, [functionInputs]);

  return {
    contractAddress,
    contractABI,
    functions,
    events, // Added
    targetFunction,
    targetEvent, // Added
    selectedFunction,
    selectedEvent, // Added
    functionInputs,
    eventInputs, // Added
    argumentsInBytes,
    argsArray,
    argumentType,
    handleContractAddressChange,
    handleFunctionChange,
    handleEventChange, // Added
    handleInputChange,
    handleEventInputChange, // Added
    handleArgumentTypeChange,
    emitEvent, // Added
  };
}
