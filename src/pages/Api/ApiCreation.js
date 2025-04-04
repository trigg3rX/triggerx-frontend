import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";


const ApiCreation = () => {
  const [activeTab, setActiveTab] = useState("apikey");
  const [expandedSection, setExpandedSection] = useState(null);

  const [apiKeys] = useState([
    {
      key: "cpi_cb88217d-56b8-40a0-a296-995cffede7ca",
      created: "4/4/2025, 5:20:56 PM",
      rateLimit: "20 requests",
      status: "Active"
    }
  ]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const QuickStartGuide = () => (
    <div className="bg-[#1B2C4F] p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
      <ol className="space-y-2">
        <li>1. Generate an API key in the "API Key Generator" tab</li>
        <li>2. Review the API documentation for available endpoints</li>
        <li>3. Make API requests using your generated key</li>
        <li>4. Monitor your usage and rate limits</li>
      </ol>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p>
          If you have any questions or need assistance, please don't hesitate to contact our support team at{" "}
          <span className="text-blue-400">@chain_l</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
        API Documentation & Key Management
      </h1>

        <div className="max-w-[1600px] w-[85%] mx-auto flex justify-between items-center my-10 bg-[#181818F0] p-2 rounded-lg">
          <button
            className={`w-[33%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${
              activeTab === "documetation"
                ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("documetation")}
          >
            Documentation 
          </button>
          <button
            className={`w-[33%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${
              activeTab === "apikey"
                ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("apikey")}
          >
           API key Generator
          </button>
         
        </div>
        <div className="overflow-x-auto">
        <div
          className="h-[650px] overflow-y-auto max-w-[1600px] mx-auto w-[85%] bg-[#141414] px-5 rounded-lg"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {activeTab === "apikey" ? (
            <div className="p-8">
               <QuickStartGuide />
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Generate API Key</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                  Generate New API Key
                </button>
              </div>

              {apiKeys.map((apiKey, index) => (
                <div key={index} className="bg-[#181818] p-6 rounded-lg mb-4">
                  <div className="flex items-center gap-4 mb-6">
                    <input
                      type="text"
                      value={apiKey.key}
                      readOnly
                      className="flex-1 bg-[#242424] text-gray-300 p-3 rounded font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-2 hover:bg-[#242424] rounded text-gray-400 hover:text-white"
                    >
                      <FiCopy size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-white">
               <QuickStartGuide />
            <div className="space-y-4">
              {/* Get Calculated CPI Value */}
              <div className="bg-[#181818] rounded-lg">
                <button
                  className="w-full p-4 flex items-center justify-between"
                  onClick={() => setExpandedSection(expandedSection === 'cpi' ? null : 'cpi')}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#242424] rounded text-sm">GET</span>
                    <h3 className="text-lg font-semibold">Get Calculated CPI Value</h3>
                  </div>
                  <IoIosArrowDown
                    className={`transform transition-transform ${
                      expandedSection === 'cpi' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedSection === 'cpi' && (
                  <div className="p-6 border-t border-[#242424]">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2">Endpoint</h4>
                        <code className="bg-[#242424] p-3 rounded-lg block text-sm">
                          https://docs.daocpi.com/api/calculate-cpi
                        </code>
                      </div>
        
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2">Description</h4>
                        <p className="text-sm">Retrieve calculated CPI values for different dates.</p>
                      </div>
        
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2">Response Status Codes</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>200 - Successful response with CPI data</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span>400 - Bad request - Invalid parameters</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span>401 - Unauthorized - Invalid or missing API key</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span>500 - Internal server error</span>
                          </div>
                        </div>
                      </div>
        
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2">Response Example</h4>
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
        
              {/* Temporary CPI Calculator */}
              <div className="bg-[#181818] rounded-lg">
                <button
                  className="w-full p-4 flex items-center justify-between"
                  onClick={() => setExpandedSection(expandedSection === 'temp' ? null : 'temp')}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#242424] rounded text-sm">GET</span>
                    <h3 className="text-lg font-semibold">Temporary CPI Calculator</h3>
                  </div>
                  <IoIosArrowDown
                    className={`transform transition-transform ${
                      expandedSection === 'temp' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* Add similar content structure as above */}
              </div>
        
              {/* Historic CPI */}
              <div className="bg-[#181818] rounded-lg">
                <button
                  className="w-full p-4 flex items-center justify-between"
                  onClick={() => setExpandedSection(expandedSection === 'historic' ? null : 'historic')}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#242424] rounded text-sm">GET</span>
                    <h3 className="text-lg font-semibold">Historic CPI</h3>
                  </div>
                  <IoIosArrowDown
                    className={`transform transition-transform ${
                      expandedSection === 'historic' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* Add similar content structure as above */}
              </div>
        
              {/* Historic CPI Data for Specific Date */}
              <div className="bg-[#181818] rounded-lg">
                <button
                  className="w-full p-4 flex items-center justify-between"
                  onClick={() => setExpandedSection(expandedSection === 'specific' ? null : 'specific')}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-[#242424] rounded text-sm">GET</span>
                    <h3 className="text-lg font-semibold">Historic CPI Data for Specific Date</h3>
                  </div>
                  <IoIosArrowDown
                    className={`transform transition-transform ${
                      expandedSection === 'specific' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* Add similar content structure as above */}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ApiCreation;