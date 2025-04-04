import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="my-[10rem]">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-[50%] h-[300px] bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl">404</span>
        </div>
      </div>
      <div className="flex items-end flex-col w-[95%] mx-auto gap-10">
        <div className="text-end flex gap-5">
          <div>
            <p className="text-xs sm:text-base">
              This page seems to have vanished.
            </p>
            <p className="text-xs sm:text-base">
              {" "}
              No worries, our multi-chain navigation system can get you{" "}
            </p>
            <p className="text-xs sm:text-base">
              back on track. Head back to the TriggerX homepage.
            </p>
          </div>
          <div className="w-[50px] h-[50px] bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white">👻</span>
          </div>
        </div>
        <Link to="/">
          <button className="relative bg-[#222222] text-[#000000] border border-[#222222] px-6 py-2 sm:px-8 sm:py-3 rounded-full group transition-transform">
            <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
            <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
            <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
              Go Back
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
