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
      <div className="w-[90%] h-[100px] mx-auto header hidden lg:flex items-center justify-between">
        <div className=" ">
          <a href="https://www.triggerx.network/" target="blank">
            <img src={logo} alt="" className="w-[170px] h-auto" />
          </a>
        </div>
        <div className="relative flex flex-col items-center">
          {/* Background Image */}
          <img
            src={navImage}
            alt="Background Design"
            className="absolute z-0 h-auto w-[500px]"
            style={{
              top: isScrolled ? -300 : -38,
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
                className={`text-center xl:w-[150px] lg:w-[110px]  lg:text-[12px] xl:text-base ${
                  isActiveRoute("/devhub")
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
                  ${
                    isActiveRoute("/")
                      ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]"
                      : "transparent"
                  } py-3 rounded-xl cursor-pointer`}
              >
                Create Job
              </h4>
              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => navigate("/dashboard")}
                className={`text-center xl:w-[150px] lg:w-[110px] xl:text-base lg:text-[12px] ${
                  isActiveRoute("/dashboard")
                    ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] rounded-xl border border-[#4B4A4A]"
                    : "transparent"
                } py-3 rounded-xl cursor-pointer`}
              >
                Dashboard
              </h4>
              <h4
                onMouseEnter={handleMouseEnter}
                onClick={() => {
                  navigate("/leaderboard");
                }}
                className={`text-center xl:w-[150px] lg:w-[110px]  lg:text-[12px] xl:text-base ${
                  isActiveRoute("/leaderboard")
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
            )}
          </div>
          <ConnectButton
            chainStatus="icon"
            accountStatus="address"
            showBalance={false}
          />
        </div>
      </div>
      <div className="w-[90%] h-[100px] mx-auto flex lg:hidden justify-between items-center header">
        <div className="absolute left-[calc(50%-80px)] sm:left-[calc(50%-120px)] -top-3 sm:-top-7">
          <img
            src={nav}
            alt="Nav"
            className="w-[180px] sm:w-[240px] h-auto z-0"
          />
        </div>
        {/* Logo */}
        <div className="flex-shrink-0 relative z-10 ">
          <a href="https://www.triggerx.network/" target="blank">
            <img
              src={logo}
              alt="Logo"
              width={130}
              height={120}
              className="w-[100px] md:w-[130px] h-auto"
            />
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
          {/* Hamburger Menu for Mobile */}
          <div className="lg:hidden">
            <h4
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-xlsm:text-2xl cursor-pointer"
            >
              {menuOpen ? "✖" : "☰"}
            </h4>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-3 bg-[#181818] p-4 rounded-md shadow-lg z-10 min-w-[250px] sm:min-w-[300px]">
                <div className="flex flex-col gap-4 text-white text-xs sm:text-base">
                  <h4
                    onClick={() => {
                      navigate("/devhub");
                      setMenuOpen(false);
                    }}
                    className={`w-full     
                        ${
                          isActiveRoute("https://www.triggerx.network/")
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
                    className={`w-full ${
                      isActiveRoute("/") ? "text-white" : "text-gray-400"
                    }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Create Job
                  </h4>
                  <h4
                    onClick={() => {
                      navigate("/dashboard");
                      setMenuOpen(false);
                    }}
                    className={` w-full  ${
                      isActiveRoute("/dashboard")
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
                    className={` w-full  ${
                      isActiveRoute("/leaderboard")
                        ? "text-white"
                        : "text-gray-400"
                    }  px-7 py-3 rounded-xl cursor-pointer`}
                  >
                    Leaderboard
                  </h4>
                  <div className="w-full px-7 mb-3">
                  <ConnectButton
                    chainStatus="none"
                    accountStatus="address"
                    showBalance={false}
                  />
                  </div>
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
