import React, { useState, useEffect } from 'react';

const PriceOracle = () => {
    return (
        <div className="min-h-[90vh] md:mt-[20rem] mt-[10rem]">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4 mb-6 ">
                Dynamic Price Oracle
            </h1>
            <h4 className="text-sm sm:text-base lg:text-lg text-[#A2A2A2] leading-relaxed text-center">
                Set up your automated blockchain tasks with precise conditions and
                parameters.
            </h4>
            <div className="bg-[#141414] rounded-lg max-w-[1600px] mx-auto w-[95%] sm:w-[85%] px-3 sm:px-5 py-6 mt-4 my-8 sm:my-12">
                {/* Contract Info Section */}
                <div className="p-4 rounded-lg mb-6">
                    <h2 className="text-xl text-white mb-3">Contract Information</h2>
                    <div className="text-[#A2A2A2] space-y-2">
                        <p className="pb-2">Status: Not Deployed</p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                className="bg-[#C07AF6] text-white px-8 py-3 rounded-lg transition-colors text-lg"
                            >
                                🛠️ Deploy Contract
                            </button>
                            <button
                                className="bg-[#F8FF7C] text-black px-8 py-3 rounded-lg transition-colors text-lg hover:bg-[#E1E85A]"
                            >
                                💰 Claim ETH
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#303030] p-4 rounded-lg mb-6">
                    <h2 className="text-xl text-white mb-3">Add Addresses</h2>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Enter wallet address where you maintain your funds"
                            className="bg-[#1A1B1E] text-white px-4 py-4 rounded-lg flex-1"
                        />
                        <input
                            type="number"
                            placeholder="Minimum balance (ETH)"
                            className="bg-[#1A1B1E] text-white px-4 py-4 rounded-lg w-48"
                            step="0.1"
                            min="0"
                        />
                        <button
                            className="bg-[#FFFFFF] text-black px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
                        >
                            Add Address
                        </button>
                    </div>
                </div>

                {/* Addresses Table */}
                <div className="p-4 rounded-lg mb-6 min-h-[40vh]">
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
                                <tr>
                                    <td colSpan="3" className="px-2 sm:px-4 md:px-6 py-4 text-center text-[#A2A2A2] h-[40vh]">
                                        Please deploy the contract first to configure addresses
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Deploy Button */}
                <div className="flex justify-center">
                    <button className="relative bg-[#F8FF7C] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform ">
                        <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                        <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                        <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs lg:text-sm xl:text-base">
                            Create Job
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceOracle;