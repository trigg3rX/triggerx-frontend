import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Header() {
  const logoRef = useRef(null);
  const location = useLocation();
  
  useEffect(() => {
    const logo = logoRef.current;
    if (logo) {
      logo.style.transform = 'rotateY(0deg)';
      logo.style.transition = 'transform 1s ease-in-out';

      const rotateLogo = () => {
        logo.style.transform = 'rotateY(360deg)';
        setTimeout(() => {
          logo.style.transform = 'rotateY(0deg)';
        }, 1000);
      };

      const interval = setInterval(rotateLogo, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div ref={logoRef} className="w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#A78BFA", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M20,80 L80,20 M20,20 L80,80" stroke="url(#grad1)" strokeWidth="20" strokeLinecap="round" />
                <path d="M30,70 L70,30 M30,30 L70,70" stroke="white" strokeWidth="10" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
              Trigg3rX
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center">
            <ul className="flex items-center space-x-8">
              <li>
                <Link 
                  to="/" 
                  className={`font-medium transition-all duration-300 ${
                    isActiveRoute('/') 
                      ? 'text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/create-job" 
                  className={`font-medium transition-all duration-300 ${
                    isActiveRoute('/create-job')
                      ? 'text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Create Job
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className={`font-medium transition-all duration-300 ${
                    isActiveRoute('/dashboard')
                      ? 'text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li className="pl-6">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-1 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                  <ConnectButton />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;