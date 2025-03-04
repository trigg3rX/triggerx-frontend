import React from "react";
import { ArrowLeft, Search, Home } from "lucide-react";
import error from "../assets/404.gif";

const NotFound = () => {
  // Function to go back to previous page
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center  px-4 py-12  mt-[10rem] lg:mt-[20rem] ">
      {/* <div className="w-full max-w-md bg-[#0F0F0F] rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="relative mx-auto w-32 h-32 mb-4">
            <div className="absolute inset-0 border border-gray-800 rounded-full "></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">404</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
          <p className="mt-2 text-gray-600 text-sm">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-1">
          <a
            href="/"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium transition-colors w-1/2 mx-auto"
          >
            <ArrowLeft size={16} />
            Go Back
          </a>
        </div>
      </div> */}
      <img src={error} alt="" className="w-1/2 " />
    </div>
  );
};

export default NotFound;
