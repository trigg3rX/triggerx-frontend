"use client";
import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import { Helmet } from 'react-helmet-async';
import LeaderboardSkeleton from "../components/LeaderboardSkeleton";
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useAccount } from "wagmi";

const Leaderboard = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("keeper");
  const [copyStatus, setCopyStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState({
    keepers: [],
    developers: [],
    contributors: [],
  });
  const [hasConnectedUserData, setHasConnectedUserData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const baseUrl = 'https://app.triggerx.network';

  const getHighlightedData = (dataList) => {
    if (!isConnected || !connectedAddress) return null;

    return dataList.find(item =>
      (item.address && item.address.toLowerCase() === connectedAddress.toLowerCase())
    );
  };

  const highlightedKeeper = getHighlightedData(leaderboardData.keepers || []);
  const highlightedDeveloper = getHighlightedData(leaderboardData.developers || []);
  const highlightedContributor = getHighlightedData(leaderboardData.contributors || []);

  // Check if the connected user has data in any category
  useEffect(() => {
    if (isConnected && connectedAddress) {
      let hasDataInCurrentTab = false;

      if (activeTab === "keeper") {
        hasDataInCurrentTab = highlightedKeeper !== null;
      } else if (activeTab === "developer") {
        hasDataInCurrentTab = highlightedDeveloper !== null;
      } else if (activeTab === "contributor") {
        hasDataInCurrentTab = highlightedContributor !== null;
      }

      console.log(`Connected Address: ${connectedAddress}`);
      console.log(`Active Tab: ${activeTab}`);
      console.log(`Has Data In Current Tab: ${hasDataInCurrentTab}`);

      setHasConnectedUserData(hasDataInCurrentTab);
    } else {
      setHasConnectedUserData(false);
    }
  }, [isConnected, connectedAddress, highlightedKeeper, highlightedDeveloper, highlightedContributor, activeTab]);

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

          console.log("Transformed Keeper Data:", transformedKeeperData);

          if (isConnected && connectedAddress) {
            console.log("Looking for address:", connectedAddress);
            const userKeeper = transformedKeeperData.find(k =>
              k.address && k.address.toLowerCase() === connectedAddress.toLowerCase()
            );
            console.log("User's keeper data:", userKeeper || "Not found");
          }

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

  // Sorting helper
  const getSortedData = (dataList) => {
    if (!sortConfig.key) return dataList;
    const sorted = [...dataList].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return (a[sortConfig.key] ?? 0) - (b[sortConfig.key] ?? 0);
      } else {
        return (b[sortConfig.key] ?? 0) - (a[sortConfig.key] ?? 0);
      }
    });
    return sorted;
  };

  // Filter data based on search term, then sort
  const getFilteredData = (dataList) => {
    let filtered = [...dataList];
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
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
    }
    // Sort after filtering
    return getSortedData(filtered);
  };

  // Use filtered data for tables
  const filteredKeepers = getFilteredData(leaderboardData.keepers || []);
  const filteredDevelopers = getFilteredData(leaderboardData.developers || []);
  const filteredContributors = getFilteredData(leaderboardData.contributors || []);

  // Add pagination helper functions
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  // Render keeper/operators table
  const renderKeeperTable = () => {
    const paginatedKeepers = getPaginatedData(filteredKeepers);
    const totalPages = getTotalPages(filteredKeepers);

    return (
      <>
        {highlightedKeeper && (
          <div className="bg-[#212020] rounded-lg">
            <div className="mb-8 p-6 rounded-xl shadow-lg bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#FBF197]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="">

                  <div className=" bg-[#181818] p-3 flex items-center  gap-1 rounded-lg">
                    <h4 className="text-xl font-medium text-[#A2A2A2] ">
                      {highlightedKeeper.operator} : {highlightedKeeper.address}  <button
                        onClick={() => copyAddressToClipboard(highlightedDeveloper.address, highlightedDeveloper.address)}
                        className="p-1.5 hover:bg-[#252525] rounded-md transition-all ml-2"
                        title="Copy address"
                      >
                        {copyStatus[highlightedDeveloper.address] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#82FBD0"
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
                            stroke="#FBF197"
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
                    </h4>
                    {/* <p className="text-[#A2A2A2] text-md mr-2  px-3 py-1 rounded-lg flex items-center ">
                    6768678584568768 <button
                      onClick={() => copyAddressToClipboard(highlightedKeeper.address, highlightedKeeper.address)}
                      className="p-1.5 hover:bg-[#252525] rounded-md transition-all ml-2"
                      title="Copy address"
                    >

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

                    </button>
                  </p> */}

                  </div>

                </div>
                <div className="flex md:justify-start flex-wrap gap-3 items-center">
                  <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
                    <div className="text-gray-400 text-md mb-1">Performed</div>
                    <div className="text-white font-semibold">{highlightedKeeper.performed}</div>
                  </h4>
                  <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
                    <div className="text-gray-400 text-md mb-1">Attested</div>
                    <div className="text-white font-semibold">{highlightedKeeper.attested}</div>
                  </h4>
                  <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
                    <div className="text-gray-400 text-md mb-1">Points</div>
                    <div className="text-white font-bold">{Number(highlightedKeeper.points).toFixed(2)}</div>
                  </h4>
                  <h4 className=" ">
                    <button
                      onClick={() =>
                        window.open(
                          `https://app.eigenlayer.xyz/operator/${highlightedKeeper.address}`,
                          "_blank"
                        )
                      }
                      className="px-5 py-2 text-md text-white underline decoration-2 decoration-white underline-offset-4"
                    >
                      View Profile
                    </button>
                  </h4>
                </div>


              </div>

            </div>
          </div>
        )}
        <div
          className="bg-[#141414] px-5 rounded-lg"

        >
          <table className="w-full border-separate border-spacing-y-4  h-auto">
            <thead className="sticky top-0 bg-[#2A2A2A]">
              <tr>
                <th className="px-5 py-5 text-left text-[#FFFFFF] font-bold md:text-lg lg:text-lg xs:text-sm rounded-tl-lg rounded-bl-lg">
                  Operator
                </th>
                <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
                  Address
                </th>

                <th
                  className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm cursor-pointer select-none"
                  onClick={() => {
                    setSortConfig(prev => ({
                      key: 'performed',
                      direction: prev.key === 'performed' && prev.direction === 'desc' ? 'asc' : 'desc',
                    }));
                  }}
                >
                  Job Performed
                  {sortConfig.key === 'performed' ? (
                    sortConfig.direction === 'asc'
                      ? <Tooltip title="Sort ascending"><FiChevronUp className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                      : <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                  ) : (
                    <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#A2A2A2]" /></Tooltip>
                  )}
                </th>

                <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg">
                  Job Attested
                </th>
                <th
                  className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm cursor-pointer select-none"
                  onClick={() => {
                    setSortConfig(prev => ({
                      key: 'points',
                      direction: prev.key === 'points' && prev.direction === 'desc' ? 'asc' : 'desc',
                    }));
                  }}
                >
                  Points
                  {sortConfig.key === 'points' ? (
                    sortConfig.direction === 'asc'
                      ? <Tooltip title="Sort ascending"><FiChevronUp className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                      : <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                  ) : (
                    <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#A2A2A2]" /></Tooltip>
                  )}
                </th>
                <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tr-lg rounded-br-lg">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedKeepers.length > 0
                ? paginatedKeepers.map((item, index) => (
                  <tr key={index} className={isConnected && item.address === connectedAddress ? "bg-[#271039] border-2 border-[#C07AF6]" : ""}>
                    <td className="px-5 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] text-left border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg bg-[#1A1A1A]">
                      {item.operator}
                    </td>
                    <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">


                      {item.address ? `${item.address.substring(0, 8)}...${item.address.substring(item.address.length - 7)}` : ""}
                      <button
                        onClick={() =>
                          copyAddressToClipboard(item.address, item.address)
                        }
                        className="ml-2 p-1 hover:bg-[#252525] rounded-md transition-all"
                        title="Copy address"
                      >
                        {copyStatus[item.address] ? (
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
                        {Number(item.points).toFixed(2)}
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
                    <td colSpan="6" className="text-center text-[#A2A2A2] py-5">
                      <div className="flex flex-col items-center justify-center h-[200px] text-[#A2A2A2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-4"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M3 9h18" />
                          <path d="M9 21V9" />
                        </svg>
                        <p className="text-lg mb-2">No keeper data available</p>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table></div>
        {renderPagination(totalPages)}
      </>
    );
  };

  // Render developer table with different columns
  const renderDeveloperTable = () => {
    const paginatedDevelopers = getPaginatedData(filteredDevelopers);
    const totalPages = getTotalPages(filteredDevelopers);

    return (
      <>
        {highlightedDeveloper && (
          <div className="bg-[#212020] rounded-lg ">
            <div className="mb-8 p-6 rounded-xl shadow-lg bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#FBF197]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-3">

                    <p className="text-gray-400 text-base bg-[#181818] p-3 rounded-lg flex items-center">
                      {highlightedDeveloper.address} <button
                        onClick={() => copyAddressToClipboard(highlightedDeveloper.address, highlightedDeveloper.address)}
                        className="p-1.5 hover:bg-[#252525] rounded-md transition-all ml-2"
                        title="Copy address"
                      >
                        {copyStatus[highlightedDeveloper.address] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#82FBD0"
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
                            stroke="#FBF197"
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
                    </p>

                  </div>
                </div>
                <div className="flex md:justify-end flex-wrap gap-3">
                  <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
                    <div className="text-gray-400 text-md mb-1">Total Jobs</div>
                    <div className="text-white font-semibold">{highlightedDeveloper.totalJobs}</div>
                  </h4>
                  <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
                    <div className="text-gray-400 text-md mb-1">Tasks Executed</div>
                    <div className="text-white font-semibold">{highlightedDeveloper.tasksExecuted}</div>
                  </h4>
                  <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
                    <div className="text-gray-400 text-md mb-1">Points</div>
                    <div className="text-white font-semibold">{Number(highlightedDeveloper.points).toFixed(2)}</div>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className="bg-[#141414] p-7 rounded-lg"
        >
          <table className="w-full border-separate border-spacing-y-4 max-h-[650px] h-auto">
            <thead className="sticky top-0 bg-[#303030]">
              <tr>
                <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tl-lg rounded-bl-lg">
                  Address
                </th>
                <th
                  className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm cursor-pointer select-none"
                  onClick={() => {
                    setSortConfig(prev => ({
                      key: 'totalJobs',
                      direction: prev.key === 'totalJobs' && prev.direction === 'desc' ? 'asc' : 'desc',
                    }));
                  }}
                >
                  Total Jobs
                  {sortConfig.key === 'totalJobs' ? (
                    sortConfig.direction === 'asc'
                      ? <Tooltip title="Sort ascending"><FiChevronUp className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                      : <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                  ) : (
                    <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#A2A2A2]" /></Tooltip>
                  )}
                </th>
                <th
                  className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm cursor-pointer select-none"
                  onClick={() => {
                    setSortConfig(prev => ({
                      key: 'tasksExecuted',
                      direction: prev.key === 'tasksExecuted' && prev.direction === 'desc' ? 'asc' : 'desc',
                    }));
                  }}
                >
                  Task Performed
                  {sortConfig.key === 'tasksExecuted' ? (
                    sortConfig.direction === 'asc'
                      ? <Tooltip title="Sort ascending"><FiChevronUp className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                      : <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                  ) : (
                    <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#A2A2A2]" /></Tooltip>
                  )}
                </th>
                <th
                  className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tr-lg rounded-br-lg cursor-pointer select-none"
                  onClick={() => {
                    setSortConfig(prev => ({
                      key: 'points',
                      direction: prev.key === 'points' && prev.direction === 'desc' ? 'asc' : 'desc',
                    }));
                  }}
                >
                  Points
                  {sortConfig.key === 'points' ? (
                    sortConfig.direction === 'asc'
                      ? <Tooltip title="Sort ascending"><FiChevronUp className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                      : <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                  ) : (
                    <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#A2A2A2]" /></Tooltip>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDevelopers.length > 0
                ? paginatedDevelopers.map((item, index) => (
                  <tr key={index} className={isConnected && item.address === connectedAddress ? "bg-[#271039] border-2 border-[#C07AF6]" : ""}>
                    <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg flex items-center">
                      <span className="truncate max-w-[180px] md:max-w-[220px] lg:max-w-[250px]">
                        {item.address ? `${item.address.substring(0, 5)}...${item.address.substring(item.address.length - 4)}` : ""}
                      </span>
                      <button
                        onClick={() =>
                          copyAddressToClipboard(item.address, item.address)
                        }
                        className="ml-2 p-1 hover:bg-[#252525] rounded-md transition-all"
                        title="Copy address"
                      >
                        {copyStatus[item.address] ? (
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
                        {Number(item.points).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
                : !isLoading && (
                  <tr>
                    <td colSpan="4" className="text-center text-[#A2A2A2] py-5">
                      <div className="flex flex-col items-center justify-center h-[200px] text-[#A2A2A2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-4"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M3 9h18" />
                          <path d="M9 21V9" />
                        </svg>
                        <p className="text-lg mb-2">     No developer data available</p>
                      </div>

                    </td>
                  </tr>
                )}
            </tbody>
          </table></div>
        {renderPagination(totalPages)}
      </>
    );
  };

  const renderContributorTable = () => {
    const paginatedContributors = getPaginatedData(filteredContributors);
    const totalPages = getTotalPages(filteredContributors);

    return (
      <>
        {highlightedContributor && (
          <div className="bg-[#212020] rounded-lg">
            <div className="mb-8 p-6 rounded-xl shadow-lg bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#FBF197]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="">
                  <div className="flex items-center  bg-[#181818] p-3 rounded-lg">
                    <h4 className="text-2xl font-semibold text-white mb-2">
                      {highlightedContributor.name}
                    </h4>

                  </div>
                </div>
                <div className="flex md:justify-end flex-wrap gap-3 items-center" >
                  <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
                    <div className="text-gray-400 text-md mb-1">Points</div>
                    <div className="text-white font-semibold">{Number(highlightedContributor.points).toFixed(2)}</div>
                  </h4>
                  <h4 className="flex justify-end ">
                    <button
                      onClick={() =>
                        window.open(
                          `https://app.eigenlayer.xyz/contributor/${highlightedContributor.address}`,
                          "_blank"
                        )
                      }
                      className="px-5 py-2 text-md text-white underline decoration-2 decoration-white underline-offset-4"
                    >
                      View Profile
                    </button>
                  </h4>
                </div>

              </div>
            </div>
          </div>
        )}
        <div
          className="bg-[#141414] p-7 rounded-lg"
        >
          <table className="w-full border-separate border-spacing-y-4 max-h-[650px] h-auto">
            <thead className="sticky top-0 bg-[#303030]">
              <tr>
                <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tl-lg rounded-bl-lg">
                  Name
                </th>
                <th
                  className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm cursor-pointer select-none"
                  onClick={() => {
                    setSortConfig(prev => ({
                      key: 'points',
                      direction: prev.key === 'points' && prev.direction === 'desc' ? 'asc' : 'desc',
                    }));
                  }}
                >
                  Points
                  {sortConfig.key === 'points' ? (
                    sortConfig.direction === 'asc'
                      ? <Tooltip title="Sort ascending"><FiChevronUp className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                      : <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#C07AF6]" /></Tooltip>
                  ) : (
                    <Tooltip title="Sort descending"><FiChevronDown className="inline ml-1 text-[#A2A2A2]" /></Tooltip>
                  )}
                </th>
                <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm rounded-tr-lg rounded-br-lg">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {paginatedContributors.length > 0
                ? paginatedContributors.map((item, index) => (
                  <tr key={index} className={isConnected && item.address === connectedAddress ? "bg-[#271039] border-2 border-[#C07AF6]" : ""}>
                    <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg">
                      {item.name}
                    </td>
                    <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] border border-l-0 border-[#2A2A2A] border-r-0">
                      <span className="px-7 py-3 bg-[#F8FF7C] text-md border-none text-[#C1BEFF] text-black md:text-md xs:text-[12px] rounded-lg">
                        {Number(item.points).toFixed(2)}
                      </span>
                    </td>
                    <Tooltip title="View Profile" color="#2A2A2A">
                      <td className="bg-[#1A1A1A] px-6 py-5 space-x-2 text-white flex-row justify-between border border-l-0 border-[#2A2A2A] rounded-tr-lg rounded-br-lg">
                        <button
                          onClick={() =>
                            window.open(
                              `https://app.eigenlayer.xyz/contributor/${item.address}`,
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
                    <td colSpan="3" className="text-center text-[#A2A2A2] py-5">
                      <div className="flex flex-col items-center justify-center h-[200px] text-[#A2A2A2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-4"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M3 9h18" />
                          <path d="M9 21V9" />
                        </svg>
                        <p className="text-lg mb-2">     No contributor data available</p>
                      </div>

                    </td>
                  </tr>
                )} */}

              <tr>
                <td colSpan="3" className="text-center text-[#A2A2A2] py-5">
                  <div className="flex flex-col items-center justify-center h-[200px] text-[#A2A2A2]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-4"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                    <p className="text-lg mb-2">     No contributor data available</p>
                  </div>

                </td>
              </tr>
            </tbody>
          </table></div>
        {/* {renderPagination(totalPages)} */}
      </>
    );
  };

  // Add pagination component (updated for ellipsis and arrows)
  const renderPagination = (totalPages) => {
    if (totalPages <= 1) return null;

    const pageWindow = 2; // how many pages to show around current
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - pageWindow && i <= currentPage + pageWindow)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - pageWindow - 1 && currentPage - pageWindow > 2) ||
        (i === currentPage + pageWindow + 1 && currentPage + pageWindow < totalPages - 1)
      ) {
        pages.push('ellipsis-' + i);
      }
    }
    // Remove duplicate ellipsis
    pages = pages.filter((item, idx, arr) => {
      if (typeof item === 'string' && item.startsWith('ellipsis')) {
        return idx === 0 || arr[idx - 1] !== item;
      }
      return true;
    });

    return (
      <div className="flex justify-center items-center space-x-2 py-8">
        {/* Previous Arrow */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border border-[#EDEDED] bg-white text-black ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F8FF7C]'} transition`}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {/* Page Numbers & Ellipsis */}
        {pages.map((page, idx) =>
          typeof page === 'number' ? (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center border ${currentPage === page
                ? 'border-[#C07AF6] text-white bg-[#271039] font-bold'
                : 'border-[#EDEDED] text-white hover:bg-white hover:border-white hover:text-black'
                } transition`}
            >
              {page}
            </button>
          ) : (
            <span
              key={page}
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#232323] text-[#EDEDED] border border-[#232323]"
            >
              ...
            </span>
          )
        )}
        {/* Next Arrow */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border border-[#EDEDED] bg-white text-black ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F8FF7C]'} transition`}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth="2"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    );
  };

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset pagination and sort when tab changes
  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
    setSortConfig({ key: null, direction: 'desc' });
  }, [activeTab]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
        <h1 className="text-3xl sm:text-4xl lg:text-7xl font-[300]  text-center tracking-wider">
          Leaderboard
        </h1>
        <div className="flex justify-between  w-[85%] max-w-[1600px]  mx-auto items-end">
          <div className=" mt-8 ">
            <h2 className="text-2xl font-semibold text-[#C07AF6] mb-2">Points & Fair Use</h2>
            <ul className="list-disc pl-6 text-[#EDEDED] mb-2">
              <li>Operator and developer points are tracked separately and do not affect each other's rewards.</li>
              <li>Each wallet has a maximum point cap to ensure fair participation and prevent scripted job farming.</li>
            </ul>
            <p className="text-[#A2A2A2] text-sm mt-2">The system is designed to reward genuine contributions.</p>
          </div>
          <div className="flex justify-center items-end  mb-8 ">
            <div className="flex items-center  max-w-xl ">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 bg-[#181818] text-[#EDEDED] border border-[#A2A2A2]  placeholder-[#A2A2A2] rounded-l-full px-6 py-3 focus:outline-none  text-lg shadow-none"
              />
              <button
                onClick={() => setSearchTerm('')}
                className="bg-[#C07AF6] hover:bg-[#a46be0] transition-colors  w-14 h-14 flex items-center justify-center -ml-5 z-10 border border-[#A2A2A2] rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] w-[85%] mx-auto flex justify-between items-center my-10 bg-[#181818F0] p-2 rounded-lg">
          <button
            className={`w-[33%] text-[#FFFFFF]  lg:text-xl md:text-lg xs:text-sm p-4 rounded-lg ${activeTab === "keeper"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
              }`}
            onClick={() => setActiveTab("keeper")}
          >
            <h2>Keeper</h2>
          </button>
          <button
            className={`w-[33%] text-[#FFFFFF] lg:text-xl md:text-lg xs:text-sm p-4 rounded-lg ${activeTab === "developer"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
              }`}
            onClick={() => setActiveTab("developer")}
          >
            <h2>Developer</h2>
          </button>
          <button
            className={`w-[33%] text-[#FFFFFF]  lg:text-xl md:text-lg xs:text-sm p-4 rounded-lg ${activeTab === "contributor"
              ? "bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#4B4A4A]"
              : "bg-transparent"
              }`}
            onClick={() => setActiveTab("contributor")}
          >
            <h2>Contributor</h2>
          </button>
        </div>

        {!isConnected && (
          <div className="max-w-[1600px] w-[85%] mx-auto mb-6">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-[#77e8a3]">

              <p className="text-center flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#77E8A3] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Connect your wallet to see your performance metrics in the leaderboard</span>
              </p>
            </div>
          </div>
        )}

        {/* Show "no data" message when wallet is connected but data not found in the current tab */}
        {isConnected && !(
          (activeTab === "keeper" && highlightedKeeper) ||
          (activeTab === "developer" && highlightedDeveloper) ||
          (activeTab === "contributor" && highlightedContributor)
        ) && !isLoading &&
          // Make sure we have data loaded for the current tab
          ((activeTab === "keeper" && leaderboardData.keepers.length > 0) ||
            (activeTab === "developer" && leaderboardData.developers.length > 0) ||
            (activeTab === "contributor" && leaderboardData.contributors.length > 0)) && (
            <div className="max-w-[1600px] w-[85%] mx-auto mb-6">
              <div className="bg-gradient-to-br from-black/40 to-white/5 border border-white/10 p-5 rounded-xl">
                <p className="text-center text-[#77E8A3]">

                  Your connected wallet doesn't have any data in the {activeTab} leaderboard yet.
                </p>
              </div>
            </div>
          )}

        <div className="">
          <div
            className="max-w-[1600px] mx-auto w-[85%]  px-5 rounded-lg"

          >
            {/* Only render the table when not loading */}
            {!isLoading && (
              <div className={filteredKeepers.length > 0 || filteredDevelopers.length > 0 || filteredContributors.length > 0 ? " " : "h-auto"}>
                {activeTab === "keeper"
                  ? renderKeeperTable()
                  : activeTab === "developer"
                    ? renderDeveloperTable()
                    : renderContributorTable()}
              </div>
            )}

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