// import React, { useEffect, useRef } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import new_logo from '../images/new_logo.png';

// function Header() {
//   const logoRef = useRef(null);
//   const location = useLocation();

//   useEffect(() => {
//     const logo = logoRef.current;
//     if (logo) {
//       logo.style.transform = 'rotateY(0deg)';
//       logo.style.transition = 'transform 1s ease-in-out';

//       const rotateLogo = () => {
//         logo.style.transform = 'rotateY(360deg)';
//         setTimeout(() => {
//           logo.style.transform = 'rotateY(0deg)';
//         }, 1000);
//       };

//       const interval = setInterval(rotateLogo, 5000);
//       return () => clearInterval(interval);
//     }
//   }, []);

//   const isActiveRoute = (path) => {
//     return location.pathname === path;
//   };

//   return (
//     <header className="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/10">
//       <div className="container mx-auto px-6 py-4">
//         <div className="flex justify-between items-center">
//           <Link to="/" className="flex items-center space-x-3 group">
//             <div ref={logoRef} className="w-10 h-10">
//               <img src={new_logo} alt="TriggerX Logo" />
//             </div>
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
//               TriggerX
//             </span>
//           </Link>

//           <nav className="flex items-center">
//             <ul className="flex items-center space-x-8">
//               <li>
//                 <Link
//                   to="/"
//                   className={`font-medium transition-all duration-300 ${
//                     isActiveRoute('/')
//                       ? 'text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
//                       : 'text-gray-400 hover:text-white'
//                   }`}
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/create-job"
//                   className={`font-medium transition-all duration-300 ${
//                     isActiveRoute('/create-job')
//                       ? 'text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
//                       : 'text-gray-400 hover:text-white'
//                   }`}
//                 >
//                   Create Job
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/dashboard"
//                   className={`font-medium transition-all duration-300 ${
//                     isActiveRoute('/dashboard')
//                       ? 'text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
//                       : 'text-gray-400 hover:text-white'
//                   }`}
//                 >
//                   Dashboard
//                 </Link>
//               </li>
//               <li className="pl-6">
//                 <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-1 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
//                   <ConnectButton />
//                 </div>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "../assets/logo.svg";
import nav from "../assets/nav.svg";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div>
      <div className="lg:w-[80%] md:w-[90%] mx-auto  justify-between my-10 header sm:hidden hidden lg:flex md:flex items-center ">
        <div className=" ">
          <img src={logo} alt="" className="lg:w-full md:w-[200px]" />
        </div>
        <div className="relative flex flex-col items-center">
          {/* Background Image */}
          <img
            src={nav}
            alt="Background Design"
            className="absolute z-0 h-auto lg:max-w-min  lg:w-[500px] md:[200px] "
            style={{ top: "-40px" }}
          />

          {/* Foreground Navigation */}
          <div className="flex gap-5 bg-[#181818F0] rounded-xl relative z-10 p-1">
            <h4
              onClick={() => navigate("/")}
              className={`text-center lg:w-[150px] md:w-[100px] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white hover:border-[#4B4A4A] hover:border ${
                isActiveRoute("/")
                  ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white border-[#4B4A4A] border"
                  : "transparent"
              }  px-7 py-3 rounded-xl`}
            >
              Home
            </h4>
            <h4
              onClick={() => navigate("/create-job")}
              className={`text-center lg:w-[150px] md:w-[100px] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white hover:border-[#4B4A4A] hover:border ${
                isActiveRoute("/create-job")
                  ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white border-[#4B4A4A] border"
                  : "transparent"
              }  px-7 py-3 rounded-xl`}
            >
              Create Job
            </h4>
            <h4
              onClick={() => navigate("/dashboard")}
              className={`text-center lg:w-[150px] md:w-[100px] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white hover:border-[#4B4A4A] hover:border ${
                isActiveRoute("/dashboard")
                  ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white border-[#4B4A4A] border"
                  : "transparent"
              }  px-7 py-3 rounded-xl`}
            >
              Dashboard
            </h4>
          </div>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
      <div className="w-[90%] mx-auto flex justify-between items-center my-10 header sm:flex  lg:hidden md:hidden">
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 -translate-y-10 z-0">
          <img src={nav} alt="Nav Background" className="w-64 h-auto z-0" />
        </div>
        {/* Logo */}
        <div className="flex-shrink-0 relative z-10">
          <img src={logo} alt="Logo" width={150} />
        </div>
        {/* Connect Wallet Button */}
        <div className="flex-shrink-0 relative z-10">
          <ConnectButton />
        </div>
        {/* Hamburger Menu and Navigation */}
        <div className="relative flex items-center">
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <h4
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-2xl"
            >
              {menuOpen ? "✖" : "☰"}
            </h4>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-3 bg-[#181818] p-4 rounded-md shadow-lg">
                <div className="flex flex-col gap-4 text-white">
                  <h4
                    onClick={() => navigate("/")}
                    className={`lg:w-[135px] md:w-[100px] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white hover:border-[#4B4A4A] hover:border ${
                      isActiveRoute("/")
                        ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white border-[#4B4A4A] border"
                        : "transparent"
                    }  px-7 py-3 rounded-xl`}
                  >
                    Home
                  </h4>
                  <h4
                    onClick={() => navigate("/create-job")}
                    className={`lg:w-[135px] md:w-[100px] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white hover:border-[#4B4A4A] hover:border ${
                      isActiveRoute("/create-job")
                        ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white border-[#4B4A4A] border"
                        : "transparent"
                    }  px-7 py-3 rounded-xl`}
                  >
                    Create Job
                  </h4>
                  <h4
                    onClick={() => navigate("/dashboard")}
                    className={` lg:w-[135px] md:w-[100px] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white hover:border-[#4B4A4A] hover:border ${
                      isActiveRoute("/dashboard")
                        ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] text-white border-[#4B4A4A] border"
                        : "transparent"
                    }  px-7 py-3 rounded-xl`}
                  >
                    Dashboard
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
