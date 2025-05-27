import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import logo from "../assets/logo.svg";
import nav from "../assets/nav.svg";
import { useWallet } from "../contexts/WalletContext";

function Header() {
  const { address } = useAccount();
  const { refreshBalance } = useWallet();
  const { data, refetch, isLoading } = useBalance({
    address,
    watch: true, // Enable watching for automatic updates
    cacheTime: 5000,
  });

  useEffect(() => {
    if (address) {
      console.log("Header: Balance refresh triggered");
      refetch();
    }
  }, [address, refreshBalance, refetch]);

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightStyle, setHighlightStyle] = useState({});
  const [prevRect, setPrevRect] = useState();
  const navRef = useRef();
  const isActiveRoute = (path) => location.pathname === path;
  const [isScrolled, setIsScrolled] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [navImage, setNavImage] = useState(nav); // State for nav image URL

  const handleMouseEnter = (event) => {
    const hoveredElement = event.currentTarget;
    if (!hoveredElement) return;
    const rect = hoveredElement.getBoundingClientRect();
    const navRect = navRef.current
      ? navRef.current.getBoundingClientRect()
      : { x: 0, y: 0, width: 0, height: 0 };

    const direction = prevRect
      ? rect.x > prevRect.x
        ? "right"
        : "left"
      : "none";

    setHighlightStyle({
      opacity: 1,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: `translateX(${rect.x - navRect.x}px)`,
      transition: prevRect ? "all 0.3s ease" : "none",
    });

    setPrevRect(rect);
  };

  const handleMouseLeave = () => {
    setHighlightStyle((prev) => ({
      ...prev,
      opacity: 0,
      transition: "all 0.3s ease",
    }));
  };

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <div className="fixed top-0 left-0 right-0 w-full headerbg bg-[#0a0a0a]">
      <div className="md:w-[90%] mx-auto  my-10 header hidden lg:flex items-center justify-between">
        <div className=" ">
          <a href="https://www.triggerx.network/" target="blank">
            <img src={logo} alt="" className="w-[160px] xl:w-[200px] h-auto" />
          </a>
        </div>
        <div className="relative flex flex-col items-center">
          {/* Background Image */}
          <img
            src={navImage}
            alt="Background Design"
            className="absolute z-0 h-auto lg:max-w-min  lg:w-[500px] md:[200px] "
            style={{
              top: isScrolled ? -300 : -50,
              transition: "top 0.7s ease",
            }}
          />

          {/* Foreground Navigation */}
          <nav
            ref={navRef}
            className="relative bg-[#181818F0] rounded-xl z-10"
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="absolute bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A] "
              style={highlightStyle}
            />
            <div className="relative flex">
              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => {
                  navigate("/devhub");
                }}
                className={`text-center xl:w-[150px] lg:w-[110px]  lg:text-[12px] xl:text-base ${isActiveRoute("/devhub")
                  ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]"
                  : "transparent"
                  }  py-3 rounded-xl cursor-pointer`}
              >
                Dev Hub
              </h4>

              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => {
                  navigate("/");
                }}
                className={`text-center xl:w-[150px] lg:w-[110px] xl:text-base lg:text-[12px]
                  ${isActiveRoute("/")
                    ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]"
                    : "transparent"
                  } py-3 rounded-xl cursor-pointer`}
              >
                Create Job
              </h4>
              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => navigate("/dashboard")}
                className={`text-center xl:w-[150px] lg:w-[110px] xl:text-base lg:text-[12px] ${isActiveRoute("/dashboard")
                  ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]"
                  : "transparent"
                  }
         py-3 rounded-xl cursor-pointer`}
              >
                Dashboard
              </h4>
              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => {
                  navigate("/leaderboard");
                }}
                className={`text-center xl:w-[150px] lg:w-[110px]  lg:text-[12px] xl:text-base ${isActiveRoute("/leaderboard")
                  ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]"
                  : "transparent"
                  }
                
              }  py-3 rounded-xl cursor-pointer xl:text-base`}
              >
                Leaderboard
              </h4>
            </div>
          </nav>
        </div>
        <div className="flex items-cente gap-2">

          <div className="hidden md:block">
            {address && data && (
              <div className=" bg-[#f8ff7c] px-3 py-[6px] rounded-full border border-[#f8ff7c] text-nowrap">
                <span className="text-black text-[15px] font-bold tracking-wider">
                  {Number(data.formatted).toFixed(2)} {data.symbol}
                </span>
              </div>
            )}</div>
          <ConnectButton
            chainStatus="icon"
            accountStatus="address"
            showBalance={false}
          />

          {/* <div className="relative">
            <FiInfo
              className="text-gray-400 hover:text-white cursor-pointer ml-2"
              size={20}
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
            />
            {showInfoTooltip && (
              <div className="absolute right-0 mt-2 p-4 bg-[#181818] rounded-xl border border-[#4B4A4A] shadow-lg z-50 w-[280px]">
                <div className="flex flex-col gap-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <span>• View only permissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>• Smart contract audit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>• Trusted by 418k traders</span>
                  </div>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
      <div className="w-[90%] mx-auto flex justify-between items-center my-10 header sm:flex  lg:hidden md:flex">
        <div
          className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-10 z-0"
          style={{
            top: isScrolled ? -100 : 15,
            transition: "top 0.7s ease",
          }}
        >
          <img src={nav} alt="Nav" className="w-64 h-auto z-0" />
        </div>
        {/* Logo */}
        <div className="flex-shrink-0 relative z-10 ">
          <a href="https://www.triggerx.network/" target="blank">
            <img src={logo} alt="Logo" width={130} height={120} className="w-[140px] md:w-[170px] h-auto" />
          </a>
        </div>

        {/* Hamburger Menu and Navigation */}
        <div className="relative flex items-center gap-2 md:gap-5 ">
          {/* {address && data && (
            <div className="bg-[#f8ff7c] px-4 py-[5px] rounded-full border border-[#f8ff7c] text-nowrap">
              <span className="text-black text-sm font-bold h-[24px]">
                {Number(data.formatted).toFixed(2)} {data.symbol}
              </span>
            </div>
          )} */}
          <div className="flex-shrink-0 relative z-10">
            <ConnectButton
              chainStatus="none"
              accountStatus="address"
              showBalance={false}
            />
          </div>
          {/* Hamburger Menu for Mobile */}
          <div className="lg:hidden">
            <h4
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-2xl cursor-pointer"
            >
              {menuOpen ? "✖" : "☰"}
            </h4>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-3 bg-[#181818] p-4 rounded-md shadow-lg z-10 min-w-[200px]">
                <div className="flex flex-col gap-4 text-white ">
                  <h4
                    onClick={() => {
                      navigate("/devhub");
                      setMenuOpen(false);
                    }}
                    className={`w-full 
                         
                        ${isActiveRoute("https://www.triggerx.network/")
                        ? "text-white"
                        : "text-gray-400"
                      }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Dev Hub
                  </h4>

                  <h4
                    onClick={() => {
                      navigate("/");
                      setMenuOpen(false);
                    }}
                    className={`w-full ${isActiveRoute("/") ? "text-white" : "text-gray-400"
                      }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Create Job
                  </h4>
                  <h4
                    onClick={() => {
                      navigate("/dashboard");
                      setMenuOpen(false);
                    }}
                    className={` w-full  ${isActiveRoute("/dashboard")
                      ? "text-white"
                      : "text-gray-400"
                      }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Dashboard
                  </h4>
                  <h4
                    onClick={() => {
                      navigate("/leaderboard");
                      setMenuOpen(false);
                    }}
                    className={` w-full  ${isActiveRoute("/leaderboard")
                      ? "text-white"
                      : "text-gray-400"
                      }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Leaderboard
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