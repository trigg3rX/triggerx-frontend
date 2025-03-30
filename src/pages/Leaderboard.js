"use client";
import React, { useState, useRef } from "react";
import logo from "../assets/footerLogo.svg";
import footer1 from "../assets/footer1.svg";
import footer2 from "../assets/footer2.svg";
import { Tooltip } from "antd";
import leaderboardNav from "../assets/leaderboardNav.svg"; // Import leaderboard nav image

const Leaderboard = () => {
  return (
    <>
      <div className="min-h-screen  md:mt-[20rem] mt-[10rem]">
        <h4 className="text-center">Leaderboard</h4>
        <div className="overflow-x-auto">
          <div
            className="max-h-[650px] overflow-y-auto max-w-[1600px] mx-auto w-[85%]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <table className="w-full border-separate border-spacing-y-4 ">
              <thead className="sticky top-0 bg-[#2A2A2A]">
                <tr>
                  <th className="px-5 py-5 text-center text-[#FFFFFF] font-bold md:text-lg lg:text-lg xs:text-sm rounded-tl-lg rounded-bl-lg ">
                    Operator Name{" "}
                  </th>
                  <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg xs:text-sm">
                    Address
                  </th>
                  <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg  xs:text-sm">
                    Task Performed
                  </th>
                  <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg ">
                    Task Attested
                  </th>
                  <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg  xs:text-sm">
                    Points{" "}
                  </th>
                  <th className="px-6 py-5 text-left text-[#FFFFFF] font-bold md:text-lg  xs:text-sm  rounded-tr-lg rounded-br-lg">
                    Profile
                  </th>
                </tr>
              </thead>
              <tbody>
                <React.Fragment>
                  <tr className="  ">
                    <td className="px-5 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] text-center border border-r-0 border-[#2A2A2A] rounded-tl-lg rounded-bl-lg bg-[#1A1A1A]">
                      Time Base
                    </td>
                    <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                      88808089675746475686797
                    </td>
                    <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                      858
                    </td>

                    <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] md:text-md lg:text-lg xs:text-[12px] border border-l-0 border-r-0 border-[#2A2A2A]">
                      56
                    </td>
                    <td className="bg-[#1A1A1A] px-6 py-5 text-[#A2A2A2] border border-l-0 border-[#2A2A2A] border-r-0">
                      <span className="px-4 py-2 rounded-full text-[15px] border-[#5047FF] text-[#C1BEFF] border bg-[#5047FF1A]/10 md:text-md xs:text-[12px]">
                        888
                      </span>
                    </td>
                    <td className="bg-[#1A1A1A] px-6 py-5 space-x-2 text-white flex flex-row justify-between border border-l-0 border-[#2A2A2A] rounded-tr-lg rounded-br-lg">
                      <div className="flex flex-row gap-5">
                        <button
                          disabled
                          className="px-4 py-2 bg-[#C07AF6] rounded-lg text-sm text-white cursor-not-allowed"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default Leaderboard;
