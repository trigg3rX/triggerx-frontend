import React, { useState, useEffect } from "react";
import reward from "../assets/reward.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const BoostReward = () => {
  const { isConnected } = useAccount();
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });


  useEffect(() => {
    const targetDate = new Date("2025-04-07T23:59:59").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days.toString().padStart(2, "0"),
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0")
        });
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, []);

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
        <div className="space-y-8 ">
          <div className="bg-[#141414] rounded-2xl  text-center">
            <div className="mb-4 flex justify-center">
              {/* <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full"></div> */}
              <img src={reward} alt="" className="" />
            </div>
            <div className="px-8 pb-8">
              <h1 className="text-4xl font-bold mb-8 tracking-wider">Check your Rewards</h1>

              <div className="flex justify-center items-center text-white px-8 py-3 rounded-full">
                  <ConnectButton chainStatus="none" accountStatus="none" />
                </div>
            </div>
          </div>{" "}
          <div className="bg-[#141414] rounded-2xl text-center p-8">
    <div className=" mx-auto">
    <p className="text-[#EFEFEF] text-start ml-0 py-2">Time Left For Boosted Rewards</p>
      <div className="flex justify-center gap-2 font-bold text-6xl mb-2">
        <span className="bg-[#1a1a1a] px-4 py-2 rounded border-[#6C6C6C] border">{timeLeft.days.charAt(0)}</span>
        <span className="bg-[#1a1a1a] px-4 py-2 rounded border-[#6C6C6C] border">{timeLeft.days.charAt(1)}</span>
        <span>:</span>
        <span className="bg-[#1a1a1a] px-4 py-2 rounded border-[#6C6C6C] border">{timeLeft.hours.charAt(0)}</span>
        <span className="bg-[#1a1a1a] px-4 py-2 rounded border-[#6C6C6C] border">{timeLeft.hours.charAt(1)}</span>
        <span>:</span>
        <span className="bg-[#1a1a1a] px-4 py-2 rounded border-[#6C6C6C] border">{timeLeft.minutes.charAt(0)}</span>
        <span className="bg-[#1a1a1a] px-4 py-2 rounded border-[#6C6C6C] border">{timeLeft.minutes.charAt(1)}</span>
      </div>
      <div className="flex justify-evenly gap-[3.2rem] text-sm text-gray-400 mt-2">
        <span>DAYS</span>
        <span>HOURS</span>
        <span>MINS</span>
      </div>
     
    </div>
  </div>
        </div>
      </div>
    </div>
  );
};

export default BoostReward;
