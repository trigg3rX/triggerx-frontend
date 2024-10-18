import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Header() {
  const logoRef = useRef(null);
  // const { wallet, address, connected, select, connect, disconnect } = useWallet();
  // const [isConnecting, setIsConnecting] = useState(false);

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

  // const handleWalletAction = async () => {
  //   if (connected) {
  //     await disconnect();
  //   } else {
  //     setIsConnecting(true);
  //     try {
  //       await select('MetaMask'); // Change to MetaMask
  //       await connect();
  //     } catch (error) {
  //       console.error('Failed to select or connect:', error);
  //     }
  //     setIsConnecting(false);
  //   }
  // };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
          <span className="text-2xl font-bold">Trigg3rX</span>
        </Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <li className="flex items-center">
              <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <Link to="/create-job" className="hover:text-secondary transition-colors">Create Job</Link>
            </li>
            <li className="flex items-center">
              <Link to="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link>
            </li>
            <li className="flex items-center">
              {/* <button
                onClick={handleWalletAction}
                disabled={isConnecting}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : connected ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})` : 'Connect Wallet'}
              </button> */}
              <div className="flex items-center">
                <ConnectButton />
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;