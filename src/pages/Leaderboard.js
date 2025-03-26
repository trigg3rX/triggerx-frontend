"use client";
import React, { useState } from "react";
import logo from "../assets/footerLogo.svg";
import footer1 from "../assets/footer1.svg";
import footer2 from "../assets/footer2.svg";
import { Tooltip } from "antd";
import leaderboardNav from "../assets/leaderboardNav.svg";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("keeper");
  const [copyStatus, setCopyStatus] = useState({});

  const copyAddressToClipboard = async (address, id) => {
    await navigator.clipboard.writeText(address);

    setCopyStatus((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setCopyStatus((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };
  // Sample data for keeper/operators table
  const keeperData = [
    {
      operator: "Time Base",
      address: "88808089675746475686797",
      performed: 858,
      attested: 56,
      points: 888,
    },
    {
      operator: "Alpha Node",
      address: "22345678901234567890123",
      performed: 742,
      attested: 48,
      points: 765,
    },
    {
      operator: "Quantum Keeper",
      address: "45678901234567890123456",
      performed: 921,
      attested: 62,
      points: 945,
    },
  ];

  // Sample data for developer table
  const developerData = [
    {
      address: "33456789012345678901234",
      totalJobs: 62,
      tasksExecuted: 623,
      points: 652,
    },
    {
      address: "55678901234567890123456",
      totalJobs: 57,
      tasksExecuted: 578,
      points: 595,
    },
    {
      address: "77890123456789012345678",
      totalJobs: 83,
      tasksExecuted: 834,
      points: 864,
    },
  ];

  // Render keeper/operators table
  const renderKeeperTable = () => {
    return (
      <table className="w-full border-separate border-spacing-y-4">
        <thead className="sticky top-0 bg-[#2A2A2A]">
          <tr>
            <th className="px-5 py-5 text-left text-[#FFFFFF] font-bold md:text-lg lg:text-lg xs:text-sm rounded-tl-lg rounded-bl-lg">
              Operator
            </th>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
              Address
            </th>
            <Tooltip title="Job Performed" color="#2A2A2A">
              <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
                Performed
              </th>
            </Tooltip>
            <Tooltip title="Job Attested" color="#2A2A2A">
              <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg">
                Attested
              </th>
            </Tooltip>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
              Points
            </th>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tr-lg rounded-br-lg">
              Profile
            </th>
          </tr>
        </thead>
        <tbody>
          {keeperData.map((item, index) => (
            <tr key={index}>
              <td className="px-5 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] text-left border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg bg-[#1A1A1A]">
                {item.operator}
              </td>
              <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                {item.address}
              </td>
              <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                {item.performed}
              </td>
              <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                {item.attested}
              </td>
              <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] border border-l-0 border-[#2A2A2A] border-r-0">
              <span className="px-7 py-3 bg-[#F8FF7C] text-md border-none text-[#C1BEFF] text-black md:text-md xs:text-[12px] rounded-lg">
              {item.points}
                </span>
              </td>
              <td className="bg-[#1A1A1A] px-6 py-5 space-x-2 text-white  flex-row justify-between border border-l-0 border-[#2A2A2A] rounded-tr-lg rounded-br-lg">
                <button className="px-5 py-2 border-[#C07AF6] rounded-full text-sm text-white border">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Render developer table with different columns
  const renderDeveloperTable = () => {
    return (
      <table className="w-full border-separate border-spacing-y-4">
        <thead className="sticky top-0 bg-[#2A2A2A]">
          <tr>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tl-lg rounded-bl-lg">
              Address
            </th>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
              Total Jobs
            </th>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
              Task Executed
            </th>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tr-lg rounded-br-lg">
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {developerData.map((item, index) => (
            <tr key={index}>
              <td
                key={item.id}
                className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg flex items-center"
              >
                <span className="truncate max-w-[180px] md:max-w-[220px] lg:max-w-[250px]">
                  {item.address}
                </span>
                {/* <button
                  onClick={() => copyAddressToClipboard(item.address, item.id)}
                  className="ml-2 p-1 hover:bg-[#252525] rounded-md transition-all"
                  title="Copy address"
                >
                  {copyStatus[item.id] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#A2A2A2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#A2A2A2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                    </svg>
                  )}
                </button> */}
              </td>
              <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                {item.totalJobs}
              </td>
              <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                {item.tasksExecuted}
              </td>
              <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] border border-l-0 border-[#2A2A2A] rounded-tr-lg rounded-br-lg">
                <span className="px-7 py-3 bg-[#F8FF7C] text-md border-none text-[#C1BEFF] text-black md:text-md xs:text-[12px] rounded-lg">
                  {item.points}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
          Leaderboard
        </h1>
        <div className="max-w-[1600px] w-[85%] mx-auto flex justify-between items-center my-10 bg-[#181818F0] p-2 rounded-lg">
          <button
            className={`w-[50%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${
              activeTab === "keeper"
                ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("keeper")}
          >
            Keeper
          </button>
          <button
            className={`w-[50%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${
              activeTab === "developer"
                ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("developer")}
          >
            Developer
          </button>
        </div>
        <div className="overflow-x-auto ">
          <div
            className="max-h-[650px] overflow-y-auto max-w-[1600px] mx-auto w-[85%] bg-[#141414] p-5 rounded-lg"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {activeTab === "keeper"
              ? renderKeeperTable()
              : renderDeveloperTable()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
