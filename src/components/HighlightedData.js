import React from 'react';

const HighlightedData = ({ data, type, onCopyAddress, copyStatus, onViewProfile }) => {
  if (!data) return null;

  const renderStats = () => {
    switch (type) {
      case 'keeper':
        return (
          <>
            <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
              <div className="text-gray-400 text-md mb-1">Performed</div>
              <div className="text-white font-semibold">{data.performed}</div>
            </h4>
            <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
              <div className="text-gray-400 text-md mb-1">Attested</div>
              <div className="text-white font-semibold">{data.attested}</div>
            </h4>
            <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
              <div className="text-gray-400 text-md mb-1">Points</div>
              <div className="text-white font-bold">{Number(data.points).toFixed(2)}</div>
            </h4>
          </>
        );
      case 'developer':
        return (
          <>
            <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
              <div className="text-gray-400 text-md mb-1">Total Jobs</div>
              <div className="text-white font-semibold">{data.totalJobs}</div>
            </h4>
            <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
              <div className="text-gray-400 text-md mb-1">Tasks Executed</div>
              <div className="text-white font-semibold">{data.tasksExecuted}</div>
            </h4>
            <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
              <div className="text-gray-400 text-md mb-1">Points</div>
              <div className="text-white font-semibold">{Number(data.points).toFixed(2)}</div>
            </h4>
          </>
        );
      case 'contributor':
        return (
          <h4 className="bg-[#181818] rounded-lg px-4 py-2 border border-[#5F5F5F]">
            <div className="text-gray-400 text-md mb-1">Points</div>
            <div className="text-white font-semibold">{Number(data.points).toFixed(2)}</div>
          </h4>
        );
      default:
        return null;
    }
  };

  const renderTitle = () => {
    switch (type) {
      case 'keeper':
        return (
          <div className="bg-[#181818] p-3 flex items-center gap-1 rounded-lg">
            <h4 className="text-xl font-medium text-[#A2A2A2]">
              {data.operator} : {data.address}{' '}
              <button
                onClick={() => onCopyAddress(data.address)}
                className="p-1.5 hover:bg-[#252525] rounded-md transition-all ml-2"
                title="Copy address"
              >
                {copyStatus[data.address] ? (
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
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                  </svg>
                )}
              </button>
            </h4>
          </div>
        );
      case 'developer':
        return (
          <div className="flex items-center mb-3">
            <p className="text-gray-400 text-base bg-[#181818] p-3 rounded-lg flex items-center">
              {data.address}{' '}
              <button
                onClick={() => onCopyAddress(data.address)}
                className="p-1.5 hover:bg-[#252525] rounded-md transition-all ml-2"
                title="Copy address"
              >
                {copyStatus[data.address] ? (
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
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                  </svg>
                )}
              </button>
            </p>
          </div>
        );
      case 'contributor':
        return (
          <div className="flex items-center bg-[#181818] p-3 rounded-lg">
            <h4 className="text-2xl font-semibold text-white mb-2">{data.name}</h4>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#212020] rounded-lg">
      <div className="mb-8 p-6 rounded-xl shadow-lg bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border border-[#FBF197]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="">{renderTitle()}</div>
          <div className="flex md:justify-start flex-wrap gap-3 items-center">
            {renderStats()}
            {onViewProfile && (
              <h4 className="">
                <button
                  onClick={() => onViewProfile(data.address)}
                  className="px-5 py-2 text-md text-white underline decoration-2 decoration-white underline-offset-4"
                >
                  View Profile
                </button>
              </h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightedData; 