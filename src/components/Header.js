import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';

function Header() {
  const logoRef = useRef(null);
  const location = useLocation();

  const { wallet, address, connected, select, connect, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const logo = logoRef.current;
    if (logo) {
      logo.style.transform = 'rotateY(0deg)';
      logo.style.transition = 'transform 1s ease-in-out';

      const rotatelogo = () => {
        logo.style.transform = 'rotateY(360deg)';
        setTimeout(() => {
          logo.style.transform = 'rotateY(0deg)';
        }, 1000);
      };

      const interval = setInterval(rotatelogo, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleWalletAction = async () => {
    if (connected) {
      await disconnect();
    } else {
      setIsConnecting(true);
      if (wallet) {
        try {
          await connect();
        } catch (error) {
          console.error('Failed to connect:', error);
        }
      } else {
        try {
          await select('TronLink');
          await connect();
        } catch (error) {
          console.error('Failed to select or connect:', error);
        }
      }
      setIsConnecting(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div ref={logoRef} className="w-12 h-12 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#3498db", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#2980b9", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M20,80 L80,20 M20,20 L80,80" stroke="url(#grad1)" strokeWidth="20" strokeLinecap="round" />
                <path d="M30,70 L70,30 M30,30 L70,70" stroke="white" strokeWidth="10" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">Trigg3rX</span>
          </Link>
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
              <li className="flex items-center">
                <button
                  onClick={handleWalletAction}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-1 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {isConnecting ? 'Connecting...' : connected ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})` : 'Connect Wallet'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;