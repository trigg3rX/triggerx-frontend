import React from "react";
import { Link } from "react-router-dom"; // Make sure you have react-router-dom installed
import devhub from "../assets/devhub.png";
import { FaArrowUp } from "react-icons/fa"; // Import the arrow-up icon

function Devhub() {
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
  const totalCount = devhubData.length;

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <h4 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-left max-w-[1600px] mx-auto px-4 mb-8">
        Total{" "}
        <span className="text-[#FBF197] text-[25px]">
          {" "}
          {` {${totalCount}}`}
        </span>
      </h4>
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mb-40">
          {devhubData.map((item) => (
            <Link
              to={item.userGuideLink} // Use to instead of href for react-router-dom
              key={item.id}
              className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-[#0F0F0F] p-3 border border-[#5F5F5F] flex flex-col justify-between"
            >
              <div className="w-full h-[200px] rounded-2xl border border-[#5F5F5F] relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-auto object-cover"
                />
              </div>

              <h2 className="font-actayWide text-base sm:text-xl group-hover:text-[#B7B7B7] transition-colors p-4 mt-4 sm:mt-8">
                {item.title}
              </h2>

              <div className="flex items-center justify-center text-[#B7B7B7] px-6 py-2 rounded-lg w-max text-xs sm:text-sm ">
                Read User Guide
                <FaArrowUp className="ml-2 transform rotate-[45deg] hover:translate-y-[-2px] transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Devhub;
