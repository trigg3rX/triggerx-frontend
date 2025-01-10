import React from "react";
import { useState } from "react";

import chain from "../assets/chain.svg";
import architect from "../assets/architect.svg";
import architect2 from "../assets/architect2.svg";
import secure from "../assets/secure.svg";
import job from "../assets/job.svg";
import power from "../assets/power.svg";
import bls from "../assets/bls.svg";
import insights from "../assets/insights.svg";
import choose from "../assets/chooseTrigger.svg";
import eigen from "../assets/eigen.svg";
import avs from "../assets/avs.svg";
import honesty from "../assets/honesty.svg";
import security from "../assets/security.svg";
import validation from "../assets/validation.svg";
import submit from "../assets/submit.svg";
import scale from "../assets/scale.svg";
import track from "../assets/track.svg";

function homepage() {
  return (
    <>
      <div className="relative w-[90%] mx-auto lg:my-40 md:my-40 my-20 sm:my-20">
        <h1 className="relative text-center text-4xl sm:text-5xl md:text-5xl lg:text-7xl leading-[3rem] lg:leading-0 md:leading-8 sm:leading-15">
          Next-Gen Blockchain
        </h1>
        <h1 className="relative text-center text-4xl sm:text-5xl md:text-5xl lg:text-7xl lg:mt-3 md:mt-3 sm:mt-0 mt-0 leading-[3rem] lg:leading-0 md:leading-0 sm:leading-15">
          Automation
        </h1>
        <div className="bg-[#FCFCFC] rounded-2xl lg:px-8 lg:py-4  md:px-8 md:py-4  px-5 py-3 flex items-center justify-center gap-4 shadow-md  mx-auto mt-8 min-w-min w-[300px]">
          <span className="text-[#4B4B4B] ">Seamless</span>
          <div className="h-6 border-l border-[#4B4B4B]"></div>
          <span className="text-[#4B4B4B] ">Secure</span>
          <div className="h-6 border-l border-[#4B4B4B]"></div>
          <span className="text-[#4B4B4B] ">Scalable</span>
        </div>
      </div>

      <div className=" flex items-center lg:my-40 md:my-40 my-20 sm:my-20">
        {/* Content Container */}
        <div className=" w-[80%] mx-auto flex justify-between items-center gap-5 sm:flex-col lg:flex-row md:flex-row flex-col">
          {/* Text Content */}
          <div className="lg:max-w-[65%] md:max-w-[55%] sm:max-w-[65%] relative ">
            <h4 className="text-[#A2A2A2] lg:text-lg md:text-lg text-md sm:text-md lg:leading-[2rem] md:leading-[2rem] sm:lg:leading-[1.5rem] leading-[1.5rem] p-9 tracking-wide font-normal">
              TriggerX is the future of blockchain automation—bringing ease,
              trust, and innovation to developers, dApps, and enterprises.
              Powered by EigenLayer's AVS (Actively Validated Services), we
              deliver reliable and secure automation across multi-chain
              ecosystems.
            </h4>

            {/* Decorative Elements */}
            <div className="absolute inset-0 border-2 border-black/20 ">
              {/* Top Left Corner */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#C07AF6] rounded-tl-md"></div>
              {/* Bottom Right Corner */}
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#C07AF6] rounded-br-md"></div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-full transition-colors">
              Get Started
            </button>
            <button className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-full transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-10  w-[90%] mx-auto lg:mt-40 md:mt-40 mt-20 sm:mt-20">
        {/* Left side - Title */}
        <div className="flex-1">
          <h2 className="text-white text-6xl font-normal space-y-5">
            <div>Why Choose</div>
            <div>TriggerX?</div>
          </h2>
        </div>
        {/* Right side - Feature Card */}
        <div className="flex-1 flex-col ">
          <div className="relative bg-[#111111] rounded-xl flex">
            {/* Content */}
            <div className="relative z-10 p-8">
              <h3 className="text-white text-2xl  mb-4">
                Seamless Multi-Chain Support
              </h3>
              <h4 className="text-[#A2A2A2] ">
                Automate tasks across diverse blockchain networks, including
                emerging Layer 2 (L2) solutions.
              </h4>
            </div>
            <img src={chain} alt={""} />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-10 flex-col w-[90%] mx-auto lg:mt-10 md:mt-10 mt-10 sm:mt-10">
        <div>
          <div className="grid grid-cols-4 gap-6">
            {/* Customizable Job Templates */}
            <div className="relative bg-[#111111]  rounded-lg flex items-start">
              <div className="relative z-10 p-8">
                <h3 className="text-white text-2xl  mb-4">
                  Customizable Job Templates
                </h3>
                <h4 className="text-[#A2A2A2]">
                  Ready-to-use templates for time-based, condition-based, and
                  event-triggered automation
                </h4>
              </div>
              <img src={job} alt={""} />
            </div>

            {/* Crypto-Economic Security */}
            <div className="relative bg-[#111111]  rounded-lg flex items-start ">
              <img src={secure} alt={""} />

              <div className="relative z-10 p-8">
                <h3 className="text-white text-2xl  mb-4">
                  Crypto-Economic Security
                </h3>
                <h4 className="text-[#A2A2A2]">
                  Powered by EigenLayer's AVS, ensuring safe and reliable task
                  execution
                </h4>
              </div>
            </div>

            {/* Decentralized Keeper Network */}
            <div className="relative bg-[#111111] p-8 rounded-lg">
              <div className="relative z-10">
                <h3 className="text-white text-2xl  mb-4">
                  Decentralized Keeper Network
                </h3>
                <h4 className="text-[#A2A2A2]">
                  Resilient and tamper-resistant infrastructure powered by
                  decentralized operators
                </h4>
              </div>
            </div>

            {/* Scalable Architecture */}
            <div className="relative bg-[#111111] rounded-lg flex items-end flex-col">
              <img src={architect} alt={""} />

              <div className="relative z-10 p-8 ">
                <h3 className="text-white text-2xl  mb-4">
                  Scalable Architecture
                </h3>
                <h4 className="text-[#A2A2A2]">
                  Instantly expand to new blockchains with minimal configuration
                  effort
                </h4>
              </div>
              <img src={architect2} alt={""} />
            </div>

            {/* Powered by EigenLayer - Spans 2 columns */}
            <div className="relative bg-[#111111]  rounded-lg  flex items-start">
              <div className="relative z-10 p-8">
                <h3 className="text-white text-2xl  mb-4">
                  Powered by EigenLayer
                </h3>
                <p className="text-[#A2A2A2]">
                  Uses EigenLayer's Active Validator System (AVS) for robust
                  economic security
                </p>
              </div>
              <img src={power} alt={""} />
            </div>

            {/* BLS Signature Aggregation */}
            <div className="relative bg-[#111111]  rounded-lg col-span-2 flex  items-center">
              <img src={bls} alt={""} />

              <div className="relative z-10 p-8">
                <h3 className="text-white text-2xl  mb-4">
                  BLS Signature Aggregation
                </h3>
                <h4 className="text-[#A2A2A2]">
                  Efficient aggregation of task results with cryptographic
                  security, minimizing costs and execution time
                </h4>
              </div>
            </div>

            {/* Real-Time Monitoring & Insights */}
            <div className="relative bg-[#111111] rounded-lg flex items-start">
              <div className="relative z-10 p-8 ">
                <h3 className="text-white text-2xl  mb-4">
                  Real-Time Monitoring & Insights
                </h3>
                <h4 className="text-[#A2A2A2]">
                  User dashboards to submit tasks, track job progress, and view
                  keeper performance metrics
                </h4>
              </div>
              <img src={insights} alt={""} />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-[50px] lg:my-40 md:my-40 my-20 sm:my-20">
        <div className="bg-white rounded-3xl  shadow-lg text-black">
          <div className=" flex items-start">
            <div className="flex items-start justify-between flex-col p-8">
              <div className="relative p-8">
                <h1 className="text-6xl ">What Can You Automate</h1>
                <h1 className="text-6xl relative pt-6 ">
                  with
                  <span className="relative text-[#5047FF] py-2 px-4 ml-3">
                    TriggerX ?{/* Decorative Elements */}
                    <div className="absolute inset-0 border-2 border-transparent pointer-events-none">
                      {/* Top Left Corner */}
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#5047FF] rounded-tl-md"></div>
                      {/* Bottom Right Corner */}
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#5047FF] rounded-br-md"></div>
                    </div>
                  </span>
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 p-8">
                {/* First Item */}
                <div className="space-y-4">
                  <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-xl ">
                    01
                  </div>

                  <h2 className="text-xl px-2">Time-Based Tasks</h2>
                  <h4 className="text-[#1F1F1F] leading-relaxed px-2">
                    Schedule automated actions at specific times or intervals
                  </h4>
                </div>

                {/* Second Item */}
                <div className="space-y-4">
                  <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-xl ">
                    02
                  </div>
                  <h2 className="text-xl px-2">Event-Triggered Actions</h2>
                  <h4 className="text-[#1F1F1F] leading-relaxed px-2">
                    Trigger workflows based on on-chain events like governance
                    proposals or token transfers
                  </h4>
                </div>

                {/* Third Item */}
                <div className="space-y-4">
                  <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-xl ">
                    03
                  </div>
                  <h2 className="text-xl px-2">Condition-Based Processes</h2>
                  <h4 className="text-[#1F1F1F] leading-relaxed px-2">
                    Execute tasks when specific conditions are met, such as
                    price thresholds or liquidity levels
                  </h4>
                </div>
              </div>
            </div>

            <img src={choose} alt={""} className="w-[20%]" />
          </div>
        </div>
      </div>

      <div className=" w-[90%] mx-auto lg:mt-40 md:mt-40 mt-20 sm:mt-20">
        {/* Content container */}

        {/* Title with bottom border effect */}
        <h1 className="text-4xl md:text-6xl text-white  pb-2 text-center">
          Why EigenLayer Matters?
        </h1>

        {/* Subtitle in a dark glass-like container */}

        <div className=" rounded-lg px-6 py-3 border border-[#FFFFFF] mx-auto mt-8 min-w-min w-[650px]">
          <h4 className="text-[#A2A2A2] text-lg md:text-base text-center">
            EigenLayer's AVS provides the backbone of TriggerX's security,
            enabling
          </h4>
        </div>
      </div>
      <div className="w-[90%] mx-auto lg:mt-40 md:mt-40 mt-20 sm:mt-20 flex justify-between relative">
        {/* Left Column */}
        <div className="flex justify-between gap-[200px] flex-col relative">
          {/* Line connecting to top box */}
          {/* <div className="absolute top-[25%] right-[-100px] flex items-center">
            <div className="w-2 h-2 bg-white transform rotate-45"></div>

            <div className="w-[100px] h-[2px] bg-white"></div>
          </div> */}
          <div className="relative text-white p-8 max-w-sm mx-auto">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-md"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-md"></div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex items-start justify-center rounded-full">
                  <img src={honesty} alt={""} />
                </div>
                <div>
                  <h3 className="text-xl">Incentivized Honesty</h3>
                  <h4 className="text-[#A2A2A2] mt-2">
                    Misbehaving keepers are penalized through slashing, ensuring
                    reliability.
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Line connecting to bottom box */}
          {/* <div className="absolute bottom-[30%] right-[-100px] w-[100px] h-[2px] bg-[#C07AF6]"></div> */}

          <div className="bg-[#141414] text-white p-8 max-w-sm mx-auto rounded-[30px]">
            <div className="relative text-white p-8 max-w-sm mx-auto">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#C07AF6] rounded-tl-md"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#C07AF6] rounded-br-md"></div>
              <div className="space-y-4">
                <img src={avs} alt={""} />
              </div>
            </div>
          </div>
        </div>

        {/* Center img */}
        <div>
          <img src={eigen} alt="" className="w-[500px]" />
        </div>

        {/* Right Column */}
        <div className="flex justify-center gap-[50px] flex-col relative">
          {/* Line connecting to top box */}
          {/* Line connecting to top box with diamond */}
          {/* <div className="absolute top-[25%] left-[-100px] flex items-center flex-row-reverse">
            <div className="w-[100px] h-[2px] bg-white"></div>
            <div className="w-2 h-2 bg-white transform rotate-45"></div>
          </div> */}

          <div className="relative text-white p-8 max-w-sm mx-auto">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-md"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-md"></div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center rounded-full">
                  <img src={security} alt={""} />
                </div>
                <div>
                  <h3 className="text-xl">Shared Security</h3>
                  <h4 className="text-[#A2A2A2] mt-2">
                    Operators leverage EigenLayer's crypto-economic guarantees
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Line connecting to bottom box */}
          {/* <div className="absolute bottom-[30%] left-[-100px] flex items-center flex-row-reverse">
            <div className="w-[100px] h-[2px] bg-white"></div>
            <div className="w-2 h-2 bg-white transform rotate-45"></div>
          </div> */}

          <div className="relative text-white p-8 max-w-sm mx-auto">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-md"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-md"></div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center rounded-full">
                  <img src={validation} alt={""} />
                </div>
                <div>
                  <h3 className="text-xl">Decentralized Validations</h3>
                  <h4 className="text-[#A2A2A2] mt-2">
                    Tasks are verified by a distributed network of keepers using
                    AVS mechanisms
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-[90%] mx-auto lg:mt-40 md:mt-40 mt-20 sm:mt-20">
        {/* Content container */}

        {/* Title with bottom border effect */}
        <h1 className="text-4xl md:text-6xl text-white  pb-2 text-center ">
          Who is TriggerX For?
        </h1>
        <div>
          <h4 className="text-lg md:text-md text-[#A2A2A2] text-center mt-8">
            Whether you're a dApp developer, DeFi protocol creator, or
            enterprise innovator,
          </h4>
          <h4 className="text-lg md:text-md text-[#A2A2A2]   text-center">
            {" "}
            TriggerX empowers you to automate tasks with ease and confidence.
          </h4>
        </div>

        {/* Subtitle in a dark glass-like container */}

        <div className=" rounded-lg px-6 py-3 border border-[#FFFFFF] mx-auto mt-8 min-w-min w-[250px]">
          <h4 className="text-[#A2A2A2] text-lg md:text-base text-center">
            Use cases include
          </h4>
        </div>
        <div className="lg:mt-20 md:mt-20 mt-20 sm:mt-20">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto ">
            <div className="relative flex items-center gap-3 px-4 pb-8 pt-4 rounded-xl">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#303030] via-[#FFFFFF] to-[#303030]"></div>
              <div className="flex items-center gap-8 ">
                <img src={honesty} alt={""} width={30} />
                <h3 className="text-xl">Automated API calls</h3>
              </div>
            </div>
            <div className="relative flex items-center gap-3 px-4 pb-8 pt-4 rounded-xl">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#303030] via-[#FFFFFF] to-[#303030]"></div>
              <div className="flex items-center gap-8 ">
                <img src={validation} alt={""} width={30} />
                <h3 className="text-xl">Governance actions</h3>
              </div>
            </div>
            <div className="relative flex items-center gap-3 px-4 pb-8 pt-4 rounded-xl">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#303030] via-[#FFFFFF] to-[#303030]"></div>
              <div className="flex items-center gap-8 ">
                <img src={security} alt={""} width={30} />
                <h3 className="text-xl">Liquidity management</h3>
              </div>
            </div>

            <div className="relative flex items-center gap-3 px-4 pb-8 pt-4 rounded-xl">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#303030] via-[#FFFFFF] to-[#303030]"></div>
              <div className="flex items-center gap-8 ">
                <img src={honesty} alt={""} width={30} />
                <h3 className="text-xl">Token burns or mints</h3>
              </div>
            </div>
          </div>
          <div className=" max-w-[30rem] mx-auto mt-5">
            <div className="relative flex items-center gap-3 px-4 pb-8 pt-4  rounded-xl">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#303030] via-[#FFFFFF] to-[#303030]"></div>
              <div className="flex items-center gap-8 ">
                <img src={security} alt={""} width={30} />
                <h3 className="text-xl">User notifications and more !</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-[90%] mx-auto lg:mt-40 md:mt-40 mt-20 sm:mt-20">
        {/* Get Started Section */}
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl text-white  pb-2 text-center ">
            Who is TriggerX For?
          </h1>

          <div className=" rounded-lg px-6 py-3 border border-[#FFFFFF] mx-auto mt-8 min-w-min w-[600px]">
            <h4 className="text-[#A2A2A2] text-md md:text-base text-center">
              TriggerX makes automation seamless, secure, and scalable
            </h4>
          </div>
          <div className="lg:mt-20 md:mt-20 mt-20 sm:mt-20">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6  ">
              <div className="bg-[#141414] rounded-2xl border border-white/10 hover:bg-white hover:text-black">
                <div className="  ">
                  <img src={submit} alt={""} />
                </div>
                <div className="p-6 max-w-[16rem]">
                  <h3 className="text-2xl mb-3 text-start">Submit Tasks</h3>
                  <h4 className=" text-sm text-start tracking-wider">
                    Use our intuitive interface to solve your automation needs
                  </h4>
                </div>
              </div>

              <div className="bg-[#141414]  rounded-2xl border border-[#3C3C3C] hover:bg-white hover:text-black">
                <div className="  ">
                  <img src={track} alt={""} />
                </div>
                <div className="p-6 max-w-[16rem]">
                  <h3 className="text-2xl mb-3 text-start">Track Progress</h3>
                  <h4 className=" text-sm text-start tracking-wider">
                    Stay updated with real-time dashboards and alerts
                  </h4>
                </div>
              </div>

              <div className="bg-[#141414] rounded-2xl border border-white/10 hover:bg-white hover:text-black">
                <div className="  ">
                  <img src={scale} alt={""} />
                </div>
                <div className="p-6 max-w-[16rem]">
                  <h3 className="text-2xl mb-3 text-start">
                    Scale with Confidence
                  </h3>
                  <h4 className=" text-sm text-start tracking-wider">
                    Expand your automation capabilities as your project grows
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default homepage;
