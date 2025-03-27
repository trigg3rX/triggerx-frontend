import React from "react";
import reward from "../assets/reward.svg";

const BoostReward = () => {
  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <div className="flex p-8 gap-8 text-white max-w-[1600px] mx-auto justify-center">
        {/* Left Content Section */}
        <div className="bg-[#141414] rounded-2xl p-12 w-[60%] ">
          <div className="mb-8 ">
            <h1 className="text-4xl  mb-6 tracking-wide">
              Grow the Ecosystem,
              <br />
              Grow Your Rewards!
            </h1>
            <p className="text-white leading-relaxed">
              TriggerX testnet is live on Holeski, and we're boosting rewards!
            </p>
            <p className="text-[#F8FF7C]">
              2x your rewards by registering before April 7th :{" "}
            </p>
            <p>become a core part of our ecosystem and earn more!</p>
          </div>

          <div className="mt-8">
            <h2 className="text-[#C07AF6] text-2xl mb-8">Parameters to earn</h2>
            <div className="flex flex-col gap-8 text-gray-400">
              <h4 className="text-md text-white">
                <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                  1
                </span>{" "}
                Total Active Time
              </h4>
              <h4 className="text-md text-white">
                <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                  2
                </span>{" "}
                Execution Time
              </h4>
              <h4 className="text-md text-white">
                <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                  3
                </span>{" "}
                Memory Usage
              </h4>
              <h4 className="text-md text-white">
                <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                  4
                </span>{" "}
                Static Complexity Size
              </h4>
              <h4 className="text-md text-white">
                <span className="border border-[#C07AF6] bg-[#C07AF638] px-3 py-2 rounded-lg mr-3">
                  5
                </span>{" "}
                Number of Validator Nodes
              </h4>
            </div>
          </div>
        </div>

        {/* Right Rewards Section */}
        <div className="w-[40%] space-y-8 ">
          <div className="bg-[#141414] rounded-2xl  text-center">
            <div className="mb-4 flex justify-center">
              {/* <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full"></div> */}
              <img src={reward} alt="" className="" />
            </div>
            <div className="px-8 pb-8">
              <h1 className="text-4xl font-bold mb-8 tracking-wider">Check your Rewards</h1>

              <button className="bg-[#5047FF]  text-white px-8 py-3 rounded-full">
                Connect your Wallet
              </button>
            </div>
          </div>{" "}
          <div className="bg-[#141414] rounded-2xl  text-center p-8">
            <div className="mt-8  mx-auto">
              <div className="flex justify-center gap-2  font-bold text-6xl mb-2">
                <span className="bg-[#1a1a1a] px-4 py-2 rounded border-[#6C6C6C] border ">1</span>
                <span className="bg-[#1a1a1a] px-4 py-2 rounded  border-[#6C6C6C] border">0</span>
                <span>:</span>
                <span className="bg-[#1a1a1a] px-4 py-2 rounded  border-[#6C6C6C] border">3</span>
                <span className="bg-[#1a1a1a] px-4 py-2 rounded  border-[#6C6C6C] border">2</span>
                <span>:</span>
                <span className="bg-[#1a1a1a] px-4 py-2 rounded  border-[#6C6C6C] border">0</span>
                <span className="bg-[#1a1a1a] px-4 py-2 rounded  border-[#6C6C6C] border">4</span>
              </div>
              <p className="text-[#EFEFEF] text-start ml-8 py-2 ">Time Left For Boosted Rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostReward;
