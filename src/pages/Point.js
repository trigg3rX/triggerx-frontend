import React from "react";
import point from "../assets/point.svg";
import { useNavigate } from "react-router-dom";


const Point = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen md:mt-[20rem] mt-[10rem]">
      <div className="md:flex-space-evenly bg-[#141414] rounded-3xl p-8 flex items-center justify-evenly gap-20 md:w-[80%] w-full mx-auto">
        {/* Left - 3D Gift Image */}
        <div className="w-1/3 ">
          <img src={point} alt="Gift" className="w-full h-auto" />
        </div>
        <div className="">
        <div className="flex gap-20">
          {/* Center - Total Points */}
          <div className="text-center">
            <h1 className="text-white text-start  text-xl mb-4 tracking-wide">Total Points</h1>
            <div className="bg-[#1A1A1A] rounded-xl px-10 py-6  py-4 border border-bg-[#6C6C6C]">
              <div className="flex gap-4 text-4xl font-bold text-white ">
                <span>4</span>
                <span>0</span>
                <span>2</span>
                <span>5</span>
                <span>2</span>
              </div>
            </div>
          </div>

          {/* Right - Boosted Rewards */}
          <div className="text-center">
            <h1 className="text-[#E8FF66] text-xl mb-4 tracking-wide text-start">Boosted Rewards</h1>
            <div className="bg-[#1A1A1A] rounded-xl px-10 py-6 border border-bg-[#6C6C6C]">
              <div className="flex gap-4 text-4xl font-bold text-[#E8FF66]">
                <span>4</span>
                <span>0</span>
                <span>2</span>
                <span>5</span>
                <span>2</span>
              </div>
            </div>
          </div>
         
        </div>
        <div className="flex justify-center mt-20">
            <button       onClick={() => navigate('/leaderboard')} 
 className="bg-[#9747FF]  text-white px-9 py-5 rounded-full text-lg">
              Guess Who's Leading?
            </button>
          </div></div>
      </div>

      {/* Guess Who's Leading Button */}
    </div>
  );
};

export default Point;
