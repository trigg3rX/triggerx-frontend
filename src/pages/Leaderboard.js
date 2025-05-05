"use client";
import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import { Helmet } from 'react-helmet-async';
import LeaderboardSkeleton from "../components/LeaderboardSkeleton";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("keeper");
  const [copyStatus, setCopyStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState({
    keepers: [],
    developers: [],
    contributors: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const baseUrl = 'https://app.triggerx.network';


  // useEffect(() => {
  //   // Update meta tags when activeTab changes
  //   document.title = 'TriggerX | Leaderboard';
  //   document.querySelector('meta[name="description"]').setAttribute('content', 'Automate Tasks Effortlessly');

  //   // Update Open Graph meta tags
  //   document.querySelector('meta[property="og:title"]').setAttribute('content', 'TriggerX | Leaderboard');
  //   document.querySelector('meta[property="og:description"]').setAttribute('content', 'Automate Tasks Effortlessly');
  //   document.querySelector('meta[property="og:image"]').setAttribute('content', `${baseUrl}/images/leaderboard-og.png`);
  //   document.querySelector('meta[property="og:url"]').setAttribute('content', `${baseUrl}/leaderboard`);

  //   // Update Twitter Card meta tags
  //   document.querySelector('meta[name="twitter:title"]').setAttribute('content', 'TriggerX | Leaderboard');
  //   document.querySelector('meta[name="twitter:description"]').setAttribute('content', 'Automate Tasks Effortlessly');
  //   document.querySelector('meta[name="twitter:image"]').setAttribute('content', `${baseUrl}/images/leaderboard-og.png`);
  // }, [activeTab, baseUrl]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let apiUrl;
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        if (activeTab === "keeper") {
          apiUrl = `${API_BASE_URL}/api/leaderboard/keepers`;
        } else if (activeTab === "developer" || activeTab === "contributor") {
          apiUrl = `${API_BASE_URL}/api/leaderboard/users`;
        }

        const response = await fetch(apiUrl);

        const data = await response.json();
        console.log("Raw API response:", data);

        // Transform the data to match the table structure
        if (activeTab === "keeper") {
          const transformedKeeperData = Array.isArray(data)
            ? data.map((keeper) => ({
              operator: keeper.keeper_name,
              address: keeper.keeper_address,
              performed: keeper.tasks_executed,
              attested: keeper.tasks_executed, // If you don't have a separate attested field
              points: keeper.keeper_points,
            }))
            : [];

          // Sort the keepers by points in descending order
          transformedKeeperData.sort((a, b) => b.points - a.points);

          setLeaderboardData((prev) => ({
            ...prev,
            keepers: transformedKeeperData,
          }));
        } else if (activeTab === "developer") {
          const transformedUserData = Array.isArray(data)
            ? data.map((user) => ({
              address: user.user_address,
              totalJobs: user.total_jobs,
              tasksExecuted: user.tasks_completed, // If you don't have a separate attested field
              points: user.user_points,
            }))
            : [];

          // Sort developers by points in descending order
          transformedUserData.sort((a, b) => b.points - a.points);

          setLeaderboardData((prev) => ({
            ...prev,
            developers: transformedUserData,
          }));
        } else {
          // Sort contributors by points in descending order if they exist
          const sortedContributors = Array.isArray(data)
            ? [...data].sort((a, b) => b.points - a.points)
            : [];

          setLeaderboardData((prev) => ({
            ...prev,
            contributors: sortedContributors,
          }));
        }
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]); // Re-fetch when activeTab changes

  const copyAddressToClipboard = async (address, id) => {
    await navigator.clipboard.writeText(address);

    setCopyStatus((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setCopyStatus((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Filter data based on search term
  const getFilteredData = (dataList) => {
    if (!searchTerm) return dataList;

    return dataList.filter(item => {
      if (activeTab === "keeper") {
        return (
          (item.operator && item.operator.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      } else if (activeTab === "developer") {
        return item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  };

  // Use filtered data for tables
  const filteredKeepers = getFilteredData(leaderboardData.keepers || []);
  const filteredDevelopers = getFilteredData(leaderboardData.developers || []);
  const filteredContributors = getFilteredData(leaderboardData.contributors || []);

  // Render keeper/operators table
  const renderKeeperTable = () => {
    return (
      <table className="w-full border-separate border-spacing-y-4 max-h-[650px] h-auto">
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
          {filteredKeepers.length > 0
            ? filteredKeepers.map((item, index) => (
              <tr key={index}>
                <td className="px-5 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] text-left border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg bg-[#1A1A1A]">
                  {item.operator}
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">


                  {item.address ? `${item.address.substring(0, 8)}...${item.address.substring(item.address.length - 7)}` : ""}
                  <button
                    onClick={() =>
                      copyAddressToClipboard(item.address, item.id)
                    }
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
                  </button>
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                  {item.performed}
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                  {item.attested}
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] border border-l-0 border-[#2A2A2A] border-r-0 ">
                  <span className="px-7 py-3 bg-[#F8FF7C] text-md border-none font-extrabold text-black md:text-[15px] xs:text-[12px] rounded-lg w-[200px]">
                    {Number(item.points).toFixed(5)}
                  </span>
                </td>
                <Tooltip title="View Profile" color="#2A2A2A">
                  <td className="bg-[#1A1A1A] px-6 py-5 space-x-2 text-white flex-row justify-between border border-l-0 border-[#2A2A2A] rounded-tr-lg rounded-br-lg">
                    <button
                      onClick={() =>
                        window.open(
                          `https://app.eigenlayer.xyz/operator/${item.address}`,
                          "_blank"
                        )
                      }
                      className="px-5 py-2 text-sm text-white underline decoration-2 decoration-white underline-offset-4"
                    >
                      View
                    </button>
                  </td>
                </Tooltip>
              </tr>
            ))
            : !isLoading && (
              <tr>
                <td colSpan="6" className="text-center text-[#A2A2A2] py-5 h-[650px] ">
                  No keeper data available
                </td>
              </tr>
            )}
        </tbody>
      </table>
    );
  };

  // Render developer table with different columns
  const renderDeveloperTable = () => {
    return (
      <table className="w-full border-separate border-spacing-y-4 max-h-[650px] h-auto">
        <thead className="sticky top-0 bg-[#2A2A2A]">
          <tr>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tl-lg rounded-bl-lg">
              Address
            </th>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
              Total Jobs
            </th>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
              Task Performed
            </th>
            <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tr-lg rounded-br-lg">
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredDevelopers.length > 0
            ? filteredDevelopers.map((item, index) => (
              <tr key={index}>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg flex items-center">
                  <span className="truncate max-w-[180px] md:max-w-[220px] lg:max-w-[250px]">
                    {item.address ? `${item.address.substring(0, 5)}...${item.address.substring(item.address.length - 4)}` : ""}
                  </span>
                  <button
                    onClick={() =>
                      copyAddressToClipboard(item.address, item.id)
                    }
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
                  </button>
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                  {item.totalJobs}
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                  {item.tasksExecuted}
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] border border-l-0 border-[#2A2A2A] rounded-tr-lg rounded-br-lg">
                  <span className="px-7 py-3 bg-[#F8FF7C] text-md border-none text-[#C1BEFF] text-black md:text-md xs:text-[12px] rounded-lg">
                    {Number(item.points).toFixed(5)}
                  </span>
                </td>
              </tr>
            ))
            : !isLoading && (
              <tr>
                <td colSpan="4" className="text-center text-[#A2A2A2] py-5 h-[650px] ">
                  No developer data available
                </td>
              </tr>
            )}
        </tbody>
      </table>
    );
  };

  const renderContributorTable = () => {
    return (
      <table className="w-full border-separate border-spacing-y-4 max-h-[650px] h-auto">
        <thead className="sticky top-0 bg-[#2A2A2A]">
          <tr>
            <th className="px-6 py-5 text-center text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tl-lg rounded-bl-lg">
              Name
            </th>
            <th className="px-6 py-5 text-center text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
              Points
            </th>
            <th className="px-6 py-5 text-center text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tr-lg rounded-br-lg">
              Profile
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredContributors.length > 0
            ? filteredContributors.map((item, index) => (
              <tr key={index}>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg">
                  {item.name}
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] border border-l-0 border-[#2A2A2A] border-r-0">
                  <span className="px-7 py-3 bg-[#F8FF7C] text-md border-none text-[#C1BEFF] text-black md:text-md xs:text-[12px] rounded-lg">
                    {Number(item.points).toFixed(5)}
                  </span>
                </td>
                <td className="bg-[#1A1A1A] px-6 py-5 space-x-2 text-white border border-l-0 border-[#2A2A2A] rounded-tr-lg rounded-br-lg">
                  <button className="px-5 py-2 border-[#C07AF6] rounded-full text-sm text-white border">
                    View
                  </button>
                </td>
              </tr>
            ))
            : !isLoading && (
              <tr>
                <td colSpan="3" className="text-center text-[#A2A2A2] py-5 h-[650px] ">
                  No contributor data available
                </td>
              </tr>
            )}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Helmet>
        <title>TriggerX | Leaderboard</title>
        <meta name="description" content="View real-time rankings and performance metrics for TriggerX operators, developers, and contributors" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`TriggerX | ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Leaderboard`} />
        <meta property="og:description" content="View real-time rankings and performance metrics for TriggerX operators, developers, and contributors" />
        <meta property="og:image" content={`${baseUrl}/images/${activeTab}-og.png`} />
        <meta property="og:url" content={`${baseUrl}/leaderboard`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`TriggerX | ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Leaderboard`} />
        <meta name="twitter:description" content="View real-time rankings and performance metrics for TriggerX operators, developers, and contributors" />
        <meta name="twitter:image" content={`${baseUrl}/images/${activeTab}-og.png`} />
      </Helmet>
      <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
          Leaderboard
        </h1>

        <div className="max-w-[1600px] w-[85%] mx-auto flex items-center justify-end mt-8 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#141414] text-white border border-gray-700 rounded-full py-2 px-6 pr-12 focus:outline-none"
            />
            <button className="absolute right-4 top-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="#C07AF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <button className="ml-2 bg-[#141414] text-white p-2.5 rounded-full border border-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H21M7 12H17M11 18H13" stroke="#C07AF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="max-w-[1600px] w-[85%] mx-auto flex justify-between items-center my-10 bg-[#181818F0] p-2 rounded-lg">
          <button
            className={`w-[33%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${activeTab === "keeper"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
              }`}
            onClick={() => setActiveTab("keeper")}
          >
            Keeper
          </button>
          <button
            className={`w-[33%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${activeTab === "developer"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
              }`}
            onClick={() => setActiveTab("developer")}
          >
            Developer
          </button>
          <button
            className={`w-[33%] text-[#FFFFFF] font-bold md:text-lg xs:text-sm p-4 rounded-lg ${activeTab === "contributor"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
              }`}
            onClick={() => setActiveTab("contributor")}
          >
            Contributor
          </button>
        </div>
        <div className="overflow-x-auto">
          <div
            className="h-[650px]  overflow-y-auto max-w-[1600px] mx-auto w-[85%] bg-[#141414] px-5 rounded-lg"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Only render the table when not loading */}
            {!isLoading &&
              (activeTab === "keeper"
                ? renderKeeperTable()
                : activeTab === "developer"
                  ? renderDeveloperTable()
                  : renderContributorTable())}

            {/* Display loading or error states */}
            {isLoading && <LeaderboardSkeleton activeTab={activeTab} />}


            {error && !isLoading && (
              <div className="flex justify-center h-[500px] items-center">
                <div className="text-center text-red-500">Error: {error}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
