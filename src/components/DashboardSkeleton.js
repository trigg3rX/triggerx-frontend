import React from "react";

const DashboardSkeleton = () => {
  // Create an array of 5 items for skeleton rows
  const skeletonRows = Array(5).fill(null);

  return (
    <div className="animate-pulse">
      {/* Main table skeleton */}
      <div className="bg-[#141414] backdrop-blur-xl rounded-2xl p-8">
        <div className="h-8 bg-gray-700 rounded w-60 mb-6"></div>
        <div className="overflow-x-auto">
          <div className="max-h-[650px] overflow-y-auto">
            <table className="w-full border-separate border-spacing-y-4">
              <thead className="sticky top-0 bg-[#2A2A2A]">
                <tr>
                  <th className="px-5 py-5 text-center rounded-tl-lg rounded-bl-lg">
                    <div className="h-6 bg-gray-600 rounded w-16 mx-auto"></div>
                  </th>
                  <th className="px-6 py-5 text-left">
                    <div className="h-6 bg-gray-600 rounded w-20"></div>
                  </th>
                  <th className="px-6 py-5 text-left">
                    <div className="h-6 bg-gray-600 rounded w-24"></div>
                  </th>
                  <th className="px-6 py-5 text-left rounded-tr-lg rounded-br-lg">
                    <div className="h-6 bg-gray-600 rounded w-28"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {skeletonRows.map((_, index) => (
                  <tr key={index} className="">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
