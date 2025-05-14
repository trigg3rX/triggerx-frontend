import React from "react";

const DashboardSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-5 border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg bg-[#1A1A1A]">
      <div className="h-6 bg-gray-700 rounded w-10 mx-auto"></div>
    </td>
    <td className="bg-[#1A1A1A] px-6 py-5 border border-l-0 border-r-0 border-[#2A2A2A]">
      <div className="h-6 bg-gray-700 rounded w-28"></div>
    </td>
    <td className="bg-[#1A1A1A] px-6 py-5 border border-l-0 border-[#2A2A2A] border-r-0">
      <div className="h-8 bg-gray-700 rounded-full w-24"></div>
    </td>
    <td className="bg-[#1A1A1A] px-6 py-5 space-x-2 border border-l-0 border-[#2A2A2A] rounded-tr-lg rounded-br-lg">
      <div className="flex flex-row gap-5">
        <div className="h-8 bg-gray-700 rounded-lg w-20"></div>
        <div className="h-8 bg-gray-700 rounded-lg w-20"></div>
        <div className="h-8 bg-gray-700 rounded-lg w-10"></div>
      </div>
    </td>

  </tr>

);

export default DashboardSkeleton;
