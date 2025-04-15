import React, { useState } from "react";
import { FiCopy, FiCheck, FiKey } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { useAccount } from "wagmi";

const ApiCreation = () => {
  const [activeTab, setActiveTab] = useState("apikey");
  const [expandedSection, setExpandedSection] = useState(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const { isConnected, address } = useAccount(); // Add address from useAccount
  // Update the initial state
  const [apiKeys, setApiKeys] = useState([
    {
      key: "No API key generated yet",
      created: "-",
      rateLimit: "20 requests/min",
      status: "Inactive",
    },
  ]);

  const generateNewApiKey = async () => {
    try {
      const user = process.env.REACT_APP_USER;
      if (!user) {
        console.error("Owner is not defined in environment variables");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/${user}/api-keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: address, // 使用钱包地址作为 owner
            rateLimit: 20,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const newApiKey = {
        key: data.key || data.apiKey || "",
        created: new Date().toLocaleString(),
        rateLimit: "20 requests/min",
        status: "Active",
      };

      setApiKeys([newApiKey]);
    } catch (error) {
      console.error("Error generating API key:", error);
    }
  };

  const QuickStartGuide = () => (
    <div className="bg-[#141414] rounded-lg mb-8  border border-[#4B4A4A]">
      <div className="p-8 ">
        <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
        <ol className="space-y-4">
          <li className="flex flex-row gap-5 items-center">
            <span className="border border-[#C07AF6] bg-[#C07AF638] w-10 h-10 flex items-center justify-center rounded-lg">
              {" "}
              1
            </span>
            <span className="text-md">
              Generate an API key in the "API Key Generator" tab
            </span>
          </li>
          <li className="flex flex-row gap-5 items-center">
            <span className="border border-[#C07AF6] bg-[#C07AF638] w-10 h-10 flex items-center justify-center rounded-lg">
              2
            </span>
            <span className="text-md">
              Review the API documentation for available endpoints
            </span>
          </li>
          <li className="flex flex-row gap-5 items-center">
            <span className="border border-[#C07AF6] bg-[#C07AF638] w-10 h-10 flex items-center justify-center rounded-lg">
              {" "}
              3
            </span>
            <span className="text-md">
              Make API requests using your generated key
            </span>
          </li>
          <li className="flex flex-row gap-5 items-center">
            <span className="border border-[#C07AF6] bg-[#C07AF638] w-10 h-10 flex items-center justify-center rounded-lg">
              {" "}
              4
            </span>
            <span className="text-md">Monitor your usage and rate limits</span>
          </li>
        </ol>
      </div>
      <div className="mt-6 bg-[#313131] p-5 rounded-bl-md rounded-br-md">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p>
          If you have any questions or need assistance, please don't hesitate to
          contact our support team at{" "}
          <a className="underline">hello@triggerx.network</a>
        </p>
      </div>
    </div>
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4">
        API Documentation & Key Management
      </h1>

      <div className="max-w-[1600px] w-[95%] sm:w-[85%] mx-auto flex justify-between items-center my-8 sm:my-12 bg-[#181818F0] p-2 rounded-lg">
        <button
          className={`w-[50%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${
            activeTab === "documetation"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
          }`}
          onClick={() => setActiveTab("documetation")}
        >
          Documentation
        </button>
        <button
          className={`w-[50%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${
            activeTab === "apikey"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
          }`}
          onClick={() => setActiveTab("apikey")}
        >
          API key Generator
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto w-[95%] sm:w-[85%] px-3 sm:px-5 rounded-lg">
        {activeTab === "apikey" ? (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full justify-between ">
            {apiKeys.map((apiKey, index) => (
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full justify-between ">
                <div
                  key={index}
                  className="bg-[#181818] p-6 rounded-lg mb-4 flex-1 h-[350px]  border border-[#4B4A4A]"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#FBF197] text-center">
                    Generate API Key
                  </h2>
                  {!isConnected ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-gray-400 mb-4">
                        Please connect your wallet to generate and manage API
                        keys
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <button
                          className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 my-8 sm:px-8 sm:py-3 rounded-full group transition-transform w-full"
                          onClick={generateNewApiKey}
                        >
                          <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-lg scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                          <span className="absolute inset-0 bg-[#FFFFFF] rounded-lg scale-100 translate-y-0 group-hover:translate-y-0"></span>
                          <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-lg translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs lg:text-sm xl:text-base">
                            Generate New API Key
                          </span>
                        </button>
                        <div className="flex items-center gap-4 mb-6 bg-[#242424] rounded-lg ">
                          <input
                            type="text"
                            value={apiKey.key}
                            readOnly
                            className="flex-1  bg-[#242424]  p-3  text-sm rounded"
                          />
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className={`p-2 rounded text-gray-400 hover:text-white transition-colors ${
                              copiedEndpoint ? "text-green-500" : ""
                            }`}
                          >
                            {copiedEndpoint ? (
                              <FiCheck size={20} />
                            ) : (
                              <FiCopy size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
                        <div>
                          <p className="text-gray-400 mb-2">Created</p>
                          <p className="text-white">{apiKey.created}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-2">Rate Limit</p>
                          <p className="text-white">{apiKey.rateLimit}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-2">Status</p>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            {apiKey.status}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div className="w-full lg:w-[700px]">
              <QuickStartGuide />
            </div>
          </div>
        ) : (
          <div className="text-white ">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 bg-[#141414] p-4 sm:p-8  border border-[#4B4A4A] rounded-xl">
              <div className="flex-1 space-y-4 ">
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-col items-start sm:items-start justify-between gap-2 p-4">
                    {" "}
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      API Documentation
                    </h2>
                    <p className="mt-5 text-gray-400">
                    Explore and integrate with our Concentration Power Index
                    (CPI) calculation APIs.
                  </p>
                    {/* <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 border border-[#E2E8F0] bg-[#5D5D5D] rounded-full text-sm">
                        Operational
                      </span>
                      <span className="px-3 py-1 border border-[#E2E8F0] rounded-full text-sm">
                        v1.0.0
                      </span>
                    </div> */}
                  </div>
                
                </div>
                {/* Get Calculated CPI Value */}
                <div
                  className="max-h-[500px] overflow-y-auto space-y-4"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className=" flex-1 space-y-4  p-4 rounded-xl">
                   
                    {/* <div>
                      {" "}
                      <span className="px-4 py-2 bg-[#FFFFFF] rounded-full text-xs text-black mr-2">
                        POST
                      </span>{" "}
                      <span className="px-3 py-2 bg-[#5047FF] rounded-full text-xs">
                        Auth Required
                      </span>
                    </div> */}



{activeTab === "documetation" && (
  <div >
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 ">
      {/* Column 1: API List */}
      <div className="w-full lg:w-1/5 py-4">
  <h3 className="text-xl font-bold mb-4">Present APIs</h3>
  <div className="space-y-2">
    {[
      { name: 'Create Automation Job', method: 'POST' },
      { name: 'Retrieve Job Data', method: 'GET' },
      { name: 'Last Executed Job', method: 'PUT' },
      { name: 'Get Jobs By User', method: 'GET' },
      { name: 'Delete Job Data', method: 'DELETE' }
    ].map((api) => (
      <button
        key={api.name}
        className={`w-full text-left p-3 rounded-lg transition-colors ${
          expandedSection === api.name.toLowerCase().replace(/\s+/g, '')
            ? 'bg-[#242424] '
            : 'hover:bg-[#242424]'
        }`}
        onClick={() => setExpandedSection(api.name.toLowerCase().replace(/\s+/g, ''))}
      >
        <div className="flex items-center justify-start gap-5 ">
        <span className={`px-2 py-1 rounded-full text-xs text-center min-w-[60px] ${
            api.method === 'GET' ? 'bg-green-500' :
            api.method === 'POST' ? 'bg-[#FFFFFF] text-black' :
            api.method === 'PUT' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {api.method}
          </span>
          <span className="text-sm">{api.name}</span>
         
        </div>
      </button>
    ))}
  </div>
</div>

      {/* Column 2: API Details */}
      <div className="w-full lg:w-2/5  py-4">
        {expandedSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">API Details</h3>
             
            </div>
            
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Endpoint</h4>
              <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                <code className="flex-1 p-3 rounded-lg text-sm">
                  https://data.triggerx.network/api/jobs
                </code>
                <button
                  onClick={() => copyToClipboard("https://data.triggerx.network/api/jobs")}
                  className="p-2 rounded text-gray-400 hover:text-white transition-colors"
                >
                  {copiedEndpoint ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-2">Parameters</h4>
              <div className="bg-[#242424] p-3 rounded-lg">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-2 text-gray-400">owner</td>
                      <td>Wallet address of the job owner</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-400">rateLimit</td>
                      <td>Maximum requests per minute</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Column 3: Response Preview */}
      <div className="w-full lg:w-1/3  py-4 ">
        <h3 className="text-xl font-bold mb-4">Response Preview</h3>
        <div className="bg-[#242424] p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify({
              success: true,
              data: {
                jobId: "job_123xyz",
                status: "created",
                timestamp: "2024-03-15T10:30:00Z"
              }
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  </div>
)}


                  </div>
                  {/* <div className=" flex-1 space-y-4 bg-[#141414] p-4 border border-[#E2E8F0] rounded-xl">
                    <button
                      className="w-full mb-2 flex items-center justify-between"
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === "getjob" ? null : "getjob"
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg ">Retrieve Jobdata</h4>
                      </div>
                      <div className="bg-[#F8FF7C] text-black rounded-full p-1">
                        <IoIosArrowDown
                          className={`transform transition-transform ${
                            expandedSection === "getjob" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>
                    <div>
                      {" "}
                      <span className="px-4 py-2 bg-[#FFFFFF] rounded-full text-xs text-black mr-2">
                        GET
                      </span>{" "}
                      <span className="px-3 py-2 bg-[#5047FF] rounded-full text-xs">
                        Auth Required
                      </span>
                    </div>

                    {expandedSection === "getjob" && (
                      <div className="p-6 border-t border-[#242424] mt-6">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Endpoint
                            </h4>
                            <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                              <code className="flex-1  p-3 rounded-lg text-sm">
                                https://data.triggerx.network/api/jobs/{"{"}id
                                {"}"}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    "https://data.triggerx.network/api/jobs/{id}"
                                  )
                                }
                                className={`p-2 rounded text-gray-400 hover:text-white transition-colors ${
                                  copiedEndpoint ? "text-green-500" : ""
                                }`}
                              >
                                {copiedEndpoint ? (
                                  <FiCheck size={20} />
                                ) : (
                                  <FiCopy size={20} />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Description
                            </h4>
                            <p className="text-sm">Retrieve GetJobData </p>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Status Codes
                            </h4>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>200 - Successful response with data</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  400 - Bad request - Invalid parameters
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  401 - Unauthorized - Invalid or missing API
                                  key
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>500 - Internal server error</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Example
                            </h4>
                            <pre className="bg-[#242424] p-3 rounded-lg text-sm overflow-x-auto">
                              {`{
          "results": [
            {
              "date": "2024-03-15",
              "cpi": 0.123456,
              "activeCouncils": ["th_vp", "ch_vp_r6", "gc_vp_56"],
              "councilPercentages": {
                "active": 77.07,
                "inactive": 22.93
              }
            }
          ]
        }`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className=" flex-1 space-y-4 bg-[#141414] p-4 border border-[#E2E8F0] rounded-xl">
                    <button
                      className="w-full mb-2 flex items-center justify-between"
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === "LastExecutedAt"
                            ? null
                            : "LastExecutedAt"
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg ">LastExecuted job details</h4>
                      </div>
                      <div className="bg-[#F8FF7C] text-black rounded-full p-1">
                        <IoIosArrowDown
                          className={`transform transition-transform ${
                            expandedSection === "LastExecutedAt"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </button>
                    <div>
                      {" "}
                      <span className="px-4 py-2 bg-[#FFFFFF] rounded-full text-xs text-black mr-2">
                        PUT
                      </span>{" "}
                      <span className="px-3 py-2 bg-[#5047FF] rounded-full text-xs">
                        Auth Required
                      </span>
                    </div>

                    {expandedSection === "LastExecutedAt" && (
                      <div className="p-6 border-t border-[#242424] mt-6">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Endpoint
                            </h4>
                            <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                              <code className="flex-1  p-3 rounded-lg text-sm">
                                https://data.triggerx.network/api/jobs/{"{"}id
                                {"}"}/LastExecutedAt
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    "https://data.triggerx.network/api/jobs{id}/LastExecutedAt"
                                  )
                                }
                                className={`p-2 rounded text-gray-400 hover:text-white transition-colors ${
                                  copiedEndpoint ? "text-green-500" : ""
                                }`}
                              >
                                {copiedEndpoint ? (
                                  <FiCheck size={20} />
                                ) : (
                                  <FiCopy size={20} />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Description
                            </h4>
                            <p className="text-sm">
                              Retrieve LastExecuted Job Data
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Status Codes
                            </h4>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>200 - Successful response with data</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  400 - Bad request - Invalid parameters
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  401 - Unauthorized - Invalid or missing API
                                  key
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>500 - Internal server error</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Example
                            </h4>
                            <pre className="bg-[#242424] p-3 rounded-lg text-sm overflow-x-auto">
                              {`{
          "results": [
            {
              "date": "2024-03-15",
              "cpi": 0.123456,
              "activeCouncils": ["th_vp", "ch_vp_r6", "gc_vp_56"],
              "councilPercentages": {
                "active": 77.07,
                "inactive": 22.93
              }
            }
          ]
        }`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className=" flex-1 space-y-4 bg-[#141414] p-4 border border-[#E2E8F0] rounded-xl">
                    <button
                      className="w-full mb-2 flex items-center justify-between"
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === "GetJobsByUserAddress"
                            ? null
                            : "GetJobsByUserAddress"
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg ">GetJobs By UserAddress</h4>
                      </div>
                      <div className="bg-[#F8FF7C] text-black rounded-full p-1">
                        <IoIosArrowDown
                          className={`transform transition-transform ${
                            expandedSection === "GetJobsByUserAddress"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </button>
                    <div>
                      {" "}
                      <span className="px-4 py-2 bg-[#FFFFFF] rounded-full text-xs text-black mr-2">
                        GET
                      </span>{" "}
                      <span className="px-3 py-2 bg-[#5047FF] rounded-full text-xs">
                        Auth Required
                      </span>
                    </div>

                    {expandedSection === "GetJobsByUserAddress" && (
                      <div className="p-6 border-t border-[#242424] mt-6">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Endpoint
                            </h4>
                            <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                              <code className="flex-1  p-3 rounded-lg text-sm">
                                https://data.triggerx.network/api/jobs/user/
                                {"{"}user_address{"}"}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    "https://data.triggerx.network/api/jobs/user/{user_address}"
                                  )
                                }
                                className={`p-2 rounded text-gray-400 hover:text-white transition-colors ${
                                  copiedEndpoint ? "text-green-500" : ""
                                }`}
                              >
                                {copiedEndpoint ? (
                                  <FiCheck size={20} />
                                ) : (
                                  <FiCopy size={20} />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Description
                            </h4>
                            <p className="text-sm">GetJobs By UserAddress</p>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Status Codes
                            </h4>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>200 - Successful response with data</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  400 - Bad request - Invalid parameters
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  401 - Unauthorized - Invalid or missing API
                                  key
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>500 - Internal server error</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Example
                            </h4>
                            <pre className="bg-[#242424] p-3 rounded-lg text-sm overflow-x-auto">
                              {`{
          "results": [
            {
              "date": "2024-03-15",
              "cpi": 0.123456,
              "activeCouncils": ["th_vp", "ch_vp_r6", "gc_vp_56"],
              "councilPercentages": {
                "active": 77.07,
                "inactive": 22.93
              }
            }
          ]
        }`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className=" flex-1 space-y-4 bg-[#141414] p-4 border border-[#E2E8F0] rounded-xl">
                    <button
                      className="w-full mb-2 flex items-center justify-between"
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === "DeleteJobData"
                            ? null
                            : "DeleteJobData"
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg ">Delete JobData</h4>
                      </div>
                      <div className="bg-[#F8FF7C] text-black rounded-full p-1">
                        <IoIosArrowDown
                          className={`transform transition-transform ${
                            expandedSection === "DeleteJobData"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </button>
                    <div>
                      {" "}
                      <span className="px-4 py-2 bg-[#FFFFFF] rounded-full text-xs text-black mr-2">
                        PUT
                      </span>{" "}
                      <span className="px-3 py-2 bg-[#5047FF] rounded-full text-xs">
                        Auth Required
                      </span>
                    </div>

                    {expandedSection === "DeleteJobData" && (
                      <div className="p-6 border-t border-[#242424] mt-6">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Endpoint
                            </h4>
                            <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                              <code className="flex-1  p-3 rounded-lg text-sm">
                                https://data.triggerx.network/api/jobs/delete/
                                {"{"}id{"}"}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    "https://data.triggerx.network/api/jobs/delete/{id}"
                                  )
                                }
                                className={`p-2 rounded text-gray-400 hover:text-white transition-colors ${
                                  copiedEndpoint ? "text-green-500" : ""
                                }`}
                              >
                                {copiedEndpoint ? (
                                  <FiCheck size={20} />
                                ) : (
                                  <FiCopy size={20} />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Description
                            </h4>
                            <p className="text-sm">Delete JobData</p>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Status Codes
                            </h4>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>200 - Successful response with data</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  400 - Bad request - Invalid parameters
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  401 - Unauthorized - Invalid or missing API
                                  key
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>500 - Internal server error</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Example
                            </h4>
                            <pre className="bg-[#242424] p-3 rounded-lg text-sm overflow-x-auto">
                              {`{
          "results": [
            {
              "date": "2024-03-15",
              "cpi": 0.123456,
              "activeCouncils": ["th_vp", "ch_vp_r6", "gc_vp_56"],
              "councilPercentages": {
                "active": 77.07,
                "inactive": 22.93
              }
            }
          ]
        }`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className=" flex-1 space-y-4 bg-[#141414] p-4 border border-[#E2E8F0] rounded-xl">
                    <button
                      className="w-full mb-2 flex items-center justify-between"
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === "GetWalletPoints"
                            ? null
                            : "GetWalletPoints"

                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg ">Get Wallet Points</h4>
                      </div>
                      <div className="bg-[#F8FF7C] text-black rounded-full p-1">
                        <IoIosArrowDown
                          className={`transform transition-transform ${
                            expandedSection === "GetWalletPoints"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </button>
                    <div>
                      {" "}
                      <span className="px-4 py-2 bg-[#FFFFFF] rounded-full text-xs text-black mr-2">
                        GET
                      </span>{" "}
                      <span className="px-3 py-2 bg-[#5047FF] rounded-full text-xs">
                        Auth Required
                      </span>
                    </div>

                    {expandedSection === "GetWalletPoints" && (
                      <div className="p-6 border-t border-[#242424] mt-6">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Endpoint
                            </h4>
                            <div className="flex items-center gap-2 bg-[#242424] rounded-md">
                              <code className="flex-1  p-3 rounded-lg text-sm">
                                https://data.triggerx.network/api/wallet/points/
                                {"{"}wallet_address{"}"}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    "https://data.triggerx.network/api/wallet/points/{wallet_address}"
                                  )
                                }
                                className={`p-2 rounded text-gray-400 hover:text-white transition-colors ${
                                  copiedEndpoint ? "text-green-500" : ""
                                }`}
                              >
                                {copiedEndpoint ? (
                                  <FiCheck size={20} />
                                ) : (
                                  <FiCopy size={20} />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Description
                            </h4>
                            <p className="text-sm">GetWallet Points</p>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Status Codes
                            </h4>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>200 - Successful response with data</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  400 - Bad request - Invalid parameters
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>
                                  401 - Unauthorized - Invalid or missing API
                                  key
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span>500 - Internal server error</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">
                              Response Example
                            </h4>
                            <pre className="bg-[#242424] p-3 rounded-lg text-sm overflow-x-auto">
                              {`{
          "results": [
            {
              "date": "2024-03-15",
              "cpi": 0.123456,
              "activeCouncils": ["th_vp", "ch_vp_r6", "gc_vp_56"],
              "councilPercentages": {
                "active": 77.07,
                "inactive": 22.93
              }
            }
          ]
        }`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiCreation;
