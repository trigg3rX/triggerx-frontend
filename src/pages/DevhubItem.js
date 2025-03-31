import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaGithub, FaExclamationTriangle } from "react-icons/fa";
import devhub from "../assets/devhub.png"; // Replace with your actual image

function DevhubItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openSteps, setOpenSteps] = useState({});
  const [activeSection, setActiveSection] = useState("overview"); // Initialize with "overview"
  const [isScrolling, setIsScrolling] = useState(false); // Add a state to avoid useEffect conflict

  const devhubData = [
    {
      id: 1,
      title: "Automated Portfolio Management",
      description: "Learn about automated portfolio management.",
      image: devhub,
      userGuideLink: "#", // Replace with the actual link
    },
    {
      id: 2,
      title: "Decentralized Identity Solutions",
      description: "Explore decentralized identity solutions.",
      image: devhub,
      userGuideLink: "#",
    },
    {
      id: 3,
      title: "On-Chain Governance Mechanisms",
      description: "Discover on-chain governance mechanisms.",
      image: devhub,
      userGuideLink: "#",
    },
    {
      id: 4,
      title: "Data Oracles and Their Applications",
      description: "Understand data oracles and their applications.",
      image: devhub,
      userGuideLink: "#",
    },
    {
      id: 5,
      title: "Cross-Chain Interoperability Protocols",
      description: "Learn about cross-chain interoperability protocols.",
      image: devhub,
      userGuideLink: "#",
    },
    {
      id: 6,
      title: "Tokenization of Real-World Assets",
      description: "Explore the tokenization of real-world assets.",
      image: devhub,
      userGuideLink: "#",
    },
    // Add more data objects as needed
  ];

  useEffect(() => {
    scrollToSection(activeSection);
  }, [activeSection]);

  const item = devhubData.find((item) => item.id === parseInt(id));

  if (!item) {
    return <div>Item not found</div>;
  }

  // Function to toggle the collapse state of a step
  const toggleStep = (stepNumber) => {
    setOpenSteps((prevOpenSteps) => ({
      ...prevOpenSteps,
      [stepNumber]: !prevOpenSteps[stepNumber],
    }));
  };

  // Function to handle section click and update activeSection state
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId); // Call the scroll function
  };

  const scrollToSection = (sectionId) => {
    setIsScrolling(true); // Set scrolling state
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsScrolling(false); // Reset scrolling state after scroll
  };

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white">
            Automation Station
          </h1>
          <h4 className="text-sm sm:text-base lg:text-lg text-[#A2A2A2] leading-relaxed">
            Use FlashLiquidity's Automation Station to manage your upkeeps.
          </h4>
        </div>

        {/* Main Content Area */}
        <div className="rounded-3xl border border-gray-700 p-6 w-[80%] mx-auto">
          {/* Top Section */}
          <div className="mb-8">
            <div className="rounded-2xl  items-center justify-center w-[100%]">
              <img
                src={devhub} // Use the imported image here
                alt="Automation"
                className=" object-cover  w-[100%] p-5"
              />
            </div>

            {/* Info Grid */}
            <div className="flex text-md md:text-sm text-white justify-evenly gap-9 my-5 md:flex-row flex-col text-xs">
              <div className="">
                <h3 className="mb-3">
                  Chainlink Products :
                  <span className="text-white ml-3 md:text-sm text-xs">
                    AUTOMATION
                  </span>
                </h3>
                <h3>
                  Product Versions :
                  <span className="text-white ml-3 md:text-sm text-xs">
                    AUTOMATION
                  </span>
                </h3>
              </div>
              <div>
                {" "}
                <h3 className="mb-3">
                  Required Time :{" "}
                  <span className="text-white ml-3 md:text-sm text-xs">
                    180 MINUTES
                  </span>
                </h3>
                <h3>
                  Requires :
                  <span className="text-white ml-3 md:text-sm text-xs">
                    WALLET WITH GAS TOKEN & ERC-677 LINK
                  </span>
                </h3>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <a
                href="#"
                className="bg-[#F8FF7C] text-black font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline flex items-center"
              >
                <FaGithub className="mr-2" />
                Open Github
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Grid Layout */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-8 w-[80%] mx-auto my-10 ">
          <div className="md:col-span-1 hidden  sm:hidden md:hidden lg:block">
            <div className="sticky top-32">
              <h2 className="text-white font-bold mb-4 text-lg">
                On this page
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a
                    href="#overview"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionClick("overview");
                    }}
                    className={`hover:text-white transition-colors block py-1 px-2 ${
                      activeSection === "overview" ? "text-[#82FBD0]" : ""
                    }`}
                  >
                    [1] OVERVIEW
                  </a>
                </li>
                <li>
                  <a
                    href="#objective"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionClick("objective");
                    }}
                    className={`hover:text-white transition-colors block py-1 px-2 ${
                      activeSection === "objective" ? "text-[#82FBD0]" : ""
                    }`}
                  >
                    [2] OBJECTIVE
                  </a>
                </li>
                <li>
                  <a
                    href="#before-you-begin"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionClick("before-you-begin");
                    }}
                    className={`hover:text-white transition-colors block py-1 px-2 ${
                      activeSection === "before-you-begin"
                        ? "text-[#82FBD0]"
                        : ""
                    }`}
                  >
                    [3] BEFORE YOU BEGIN
                  </a>
                </li>
                <li>
                  <a
                    href="#steps-to-implement"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSectionClick("steps-to-implement");
                    }}
                    className={`hover:text-white transition-colors block py-1 px-2 ${
                      activeSection === "steps-to-implement"
                        ? "text-[#82FBD0]"
                        : ""
                    }`}
                  >
                    [4] STEPS TO IMPLEMENT
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-4 ">
            <section id="overview" className="mb-12">
              <h2 className="text-3xl font-bold text-white tracking-wider mb-4">
                OVERVIEW
              </h2>
              <p className="tracking-wide md:text-lg mb-4 sm:text-sm ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
              <button className="bg-white text-black font-bold py-4 px-8 rounded-full mt-4  ">
                See the Code
              </button>
            </section>

            <section id="objective" className="mb-12">
              <h2 className="text-3xl font-bold text-white tracking-wider mb-4">
                OBJECTIVE
              </h2>
              <p className="text-white mb-4 md:text-lg   sm:text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
              <div className="rounded-2xl bg-white p-8 mt-5">
                <div className="flex items-center mb-4">
                  <FaExclamationTriangle className="text-red-700 mr-2" />
                  <h3 className="text-black font-bold">Disclaimer</h3>
                </div>
                <p className="text-black md:text-lg  sm:text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </section>

            <section id="before-you-begin" className="mb-12">
              <h2 className="text-3xl font-bold text-white tracking-wider mb-4">
                BEFORE YOU BEGIN
              </h2>
              <p className="text-white md:text-lg   sm:text-sm mb-3">
                Before you start this tutorial, complete the following items:
              </p>
              <ul className="list-disc list-inside text-white md:text-lg   sm:text-sm ml-4">
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                </li>
              </ul>
            </section>

            <section id="steps-to-implement" className="mb-12">
              <h2 className="text-3xl font-bold text-white tracking-wider mb-4">
                STEPS TO IMPLEMENT
              </h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className="bg-[#242323] rounded-md overflow-hidden"
                  >
                    <button
                      className="flex items-start justify-between w-full p-4 text-white gap-1"
                      onClick={() => toggleStep(stepNumber)}
                    >
                      <div>
                        {stepNumber}{" "}
                        <span className="ml-3 md:text-lg   sm:text-sm">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit
                        </span>
                      </div>
                      <span
                        className={`transition-transform duration-200 ${
                          openSteps[stepNumber] ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                      {/* Up/Down Arrow */}
                    </button>
                    {openSteps[stepNumber] && (
                      <p className="p-4 text-white md:text-lg   sm:text-sm">
                        {/* Content for the step */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevhubItem;
