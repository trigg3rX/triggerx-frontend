"use client";
import React, { useState, useRef } from "react";
import logo from "../assets/footerLogo.svg";
import footer1 from "../assets/footer1.svg";
import footer2 from "../assets/footer2.svg";
import { Tooltip } from "antd";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="relative flex flex-col items-center justify-center gap-[10px] sm:gap-[90px] lg:gap-[120px] 2xl:gap-[120px]">
        <div className="flex mt-20 flex-col-reverse sm:flex-row items-start sm:items-end justify-between gap-10 sm:gap-5 w-[70%] mx-auto">
          <div className="flex flex-col gap-4 sm:gap-4">
            <div className="flex space-x-4 items-center">
              <Tooltip
                title="Github"
                styles={{ body: { background: "#141414" } }}              >
                <a
                  href="https://github.com/trigg3rX"
                  className="hover:text-gray-300"
                  title="Github"
                  target="blank"
                >
                  <svg
                    width="40"
                    height="45"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hover:fill-white transition-colors duration-300 w-8 h-8  lg:w-12 lg:h-12"
                  >
                    <path
                      d="M24 4C21.3736 4 18.7728 4.51732 16.3463 5.52241C13.9198 6.5275 11.715 8.00069 9.85786 9.85786C6.10714 13.6086 4 18.6957 4 24C4 32.84 9.74 40.34 17.68 43C18.68 43.16 19 42.54 19 42V38.62C13.46 39.82 12.28 35.94 12.28 35.94C11.36 33.62 10.06 33 10.06 33C8.24 31.76 10.2 31.8 10.2 31.8C12.2 31.94 13.26 33.86 13.26 33.86C15 36.9 17.94 36 19.08 35.52C19.26 34.22 19.78 33.34 20.34 32.84C15.9 32.34 11.24 30.62 11.24 23C11.24 20.78 12 19 13.3 17.58C13.1 17.08 12.4 15 13.5 12.3C13.5 12.3 15.18 11.76 19 14.34C20.58 13.9 22.3 13.68 24 13.68C25.7 13.68 27.42 13.9 29 14.34C32.82 11.76 34.5 12.3 34.5 12.3C35.6 15 34.9 17.08 34.7 17.58C36 19 36.76 20.78 36.76 23C36.76 30.64 32.08 32.32 27.62 32.82C28.34 33.44 29 34.66 29 36.52V42C29 42.54 29.32 43.18 30.34 43C38.28 40.32 44 32.84 44 24C44 21.3736 43.4827 18.7728 42.4776 16.3463C41.4725 13.9198 39.9993 11.715 38.1421 9.85786C36.285 8.00069 34.0802 6.5275 31.6537 5.52241C29.2272 4.51732 26.6264 4 24 4Z"
                      stroke="white"
                    />
                  </svg>
                </a>
              </Tooltip>
              <Tooltip
                title="Twitter"
                styles={{ body: { background: "#141414" } }}              >
                <a
                  href="https://x.com/TriggerXnetwork"
                  className="hover:text-gray-300"
                  title="Twitter"
                  target="blank"
                >
                  <svg
                    width="40"
                    height="45"
                    viewBox="0 0 40 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hover:fill-white transition-colors duration-300 w-8 h-8  lg:w-10 lg:h-10"
                  >
                    <path
                      d="M5.6075 2.80273C2.51461 2.80273 0 5.31735 0 8.41023V36.4477C0 39.5406 2.51461 42.0552 5.6075 42.0552H33.645C36.7379 42.0552 39.2525 39.5406 39.2525 36.4477V8.41023C39.2525 5.31735 36.7379 2.80273 33.645 2.80273H5.6075ZM31.6386 10.1626L22.5439 20.554L33.242 34.6954H24.8658L18.312 26.1177L10.8032 34.6954H6.64138L16.3669 23.5768L6.10692 10.1626H14.6934L20.6251 18.0043L27.4767 10.1626H31.6386ZM28.3266 32.2071L13.4405 12.5195H10.9609L26.0135 32.2071H28.3179H28.3266Z"
                      stroke="white"
                    />
                  </svg>
                </a>
              </Tooltip>
              <Tooltip
                title="Telegram"
                styles={{ body: { background: "#141414" } }}              >
                <a
                  href="https://t.me/triggerxnetwork"
                  className="hover:text-gray-300"
                  title="Telegram"
                  target="blank"
                >
                  <svg
                    width="46"
                    height="45"
                    viewBox="0 0 46 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hover:fill-white transition-colors duration-300 w-8 h-8  lg:w-10 lg:h-10"
                  >
                    <path
                      d="M30.061 34.1847L30.0697 34.163L30.0742 34.14L34.3672 12.2115L34.3718 12.1877V12.1635C34.3718 11.7361 34.2225 11.4276 33.9501 11.2473C33.6958 11.0791 33.3809 11.0551 33.1117 11.0755C32.8365 11.0965 32.5679 11.1672 32.3727 11.2301C32.274 11.2618 32.1916 11.2924 32.1335 11.3152C32.1043 11.3266 32.0812 11.3362 32.065 11.343L32.0459 11.3511L32.0433 11.3522L7.93882 20.9293L7.93827 20.9295L7.92691 20.9336C7.91694 20.9373 7.90299 20.9426 7.88564 20.9494C7.85099 20.9631 7.80254 20.9832 7.74509 21.0096C7.63102 21.0621 7.47741 21.1413 7.32485 21.2473C7.03808 21.4465 6.6652 21.8054 6.7297 22.319C6.78612 22.789 7.10817 23.1104 7.37448 23.3018C7.51119 23.4 7.64369 23.4718 7.7417 23.519C7.79097 23.5427 7.83221 23.5605 7.86183 23.5727C7.87665 23.5788 7.88861 23.5835 7.89727 23.5868L7.90773 23.5908L7.91101 23.592L7.91214 23.5924L7.91258 23.5925L7.91277 23.5926C7.91285 23.5926 7.91293 23.5927 7.99709 23.3572L7.91292 23.5927L7.91648 23.5939L13.9802 25.6594L14.0945 25.6983L14.1961 25.633L28.7572 16.266L28.7577 16.2657L28.7626 16.2627L28.7855 16.2493C28.8058 16.2377 28.8352 16.2213 28.8705 16.2031C28.9429 16.1657 29.0325 16.1244 29.1161 16.0982C29.1442 16.0894 29.1672 16.0838 29.1856 16.0801L29.1821 16.1476C29.1786 16.1527 29.1748 16.1581 29.1706 16.1639C29.1329 16.2158 29.0688 16.2894 28.9628 16.3887L28.9614 16.39C28.74 16.6002 25.8837 19.2054 23.0778 21.7626C21.6759 23.0401 20.288 24.3044 19.2506 25.2493L17.9994 26.3888L17.6498 26.7071L17.6125 26.7412L17.4619 26.6057L17.4079 27.0892L16.6564 33.8145L16.6349 34.0069L16.8158 34.0759C16.9607 34.131 17.117 34.1489 17.2706 34.1279C17.4241 34.1069 17.5699 34.0477 17.6946 33.9556L17.7056 33.9475L17.7157 33.9382L21.4795 30.4639L27.4209 35.0814L27.4353 35.0926L27.4512 35.1015C27.6792 35.2306 27.9322 35.3094 28.1932 35.3326C28.4542 35.3558 28.7171 35.3229 28.9644 35.236C29.2116 35.1492 29.4373 35.0104 29.6265 34.8291C29.8156 34.6478 29.9638 34.4281 30.061 34.1847ZM10.3124 3.9998C13.9714 1.55494 18.2732 0.25 22.6738 0.25C25.5957 0.25 28.489 0.825513 31.1885 1.94368C33.888 3.06185 36.3409 4.70077 38.407 6.76687C40.4731 8.83297 42.112 11.2858 43.2301 13.9853C44.3483 16.6848 44.9238 19.5781 44.9238 22.5C44.9238 26.9006 43.6189 31.2024 41.174 34.8614C38.7292 38.5204 35.2542 41.3723 31.1885 43.0563C27.1229 44.7404 22.6491 45.181 18.3331 44.3225C14.017 43.4639 10.0524 41.3448 6.94071 38.2331C3.82899 35.1214 1.70989 31.1568 0.851366 26.8407C-0.00715525 22.5247 0.433469 18.0509 2.11752 13.9853C3.80157 9.91963 6.6534 6.44466 10.3124 3.9998Z"
                      stroke="white"
                    />
                  </svg>
                </a>
              </Tooltip>

              <Tooltip
                title="Gitbook"
                styles={{ body: { background: "#141414" } }}              >
                <a
                  href="https://triggerx.gitbook.io/triggerx-docs"
                  className="hover:text-gray-300"
                  target="blank"
                >
                  <div className="border border-white rounded-full hover:bg-white ">
                    {" "}
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="hover:fill-black transition-colors duration-300 w-7 h-7  lg:w-10 lg:h-10"
                    >
                      <path
                        d="M18.77 21.4789C20.0439 22.2134 20.6806 22.5803 21.3806 22.581C22.0806 22.5817 22.7172 22.2155 23.9933 21.4831L32.1215 16.8161C32.3018 16.7127 32.4516 16.5635 32.5557 16.3837C32.6599 16.2038 32.7147 15.9997 32.7147 15.7918C32.7147 15.584 32.6599 15.3798 32.5557 15.2C32.4516 15.0201 32.3018 14.871 32.1215 14.7675L23.9898 10.0984C22.7158 9.36815 22.0792 9.00195 21.3799 9.00195C20.6806 9.00195 20.0446 9.36815 18.7714 10.1006L11.7805 14.1217L11.6783 14.1809C10.5051 14.8667 9.53033 15.8457 8.84968 17.022C8.16903 18.1982 7.80589 19.5312 7.7959 20.8901V21.1253C7.80604 22.5027 8.17896 23.8531 8.87712 25.0405C9.57528 26.2278 10.574 27.2103 11.7727 27.8888L16.1516 30.4142C18.7031 31.886 19.9791 32.622 21.3806 32.622C22.782 32.6227 24.0574 31.8874 26.6102 30.4177L31.2328 27.7557C32.511 27.0198 33.1504 26.6522 33.5004 26.0458C33.8525 25.4388 33.8525 24.7021 33.8525 23.2289V20.3817C33.8528 20.1837 33.8009 19.9891 33.702 19.8176C33.6031 19.6461 33.4608 19.5037 33.2894 19.4046C33.118 19.3056 32.9235 19.2535 32.7255 19.2535C32.5275 19.2536 32.3331 19.3058 32.1617 19.4049L22.6827 24.8472C22.0468 25.212 21.7292 25.3951 21.3799 25.3951C21.0313 25.3951 20.713 25.2127 20.077 24.8479L13.6615 21.1697C13.3396 20.9852 13.1791 20.8929 13.0502 20.8767C12.9071 20.8584 12.762 20.8878 12.6373 20.9604C12.5126 21.0329 12.4154 21.1447 12.3607 21.2782C12.3114 21.3979 12.3129 21.5831 12.3143 21.9528C12.3164 22.2254 12.3171 22.3613 12.3424 22.4873C12.3995 22.7676 12.5467 23.0225 12.7629 23.2106C12.8593 23.2951 12.9776 23.3627 13.2136 23.4993L20.0728 27.4536C20.7108 27.8212 21.0299 28.005 21.3799 28.005C21.7299 28.005 22.0489 27.8219 22.6869 27.4543L31.0948 22.6134C31.3131 22.488 31.4215 22.4254 31.5032 22.4725C31.5849 22.5197 31.5849 22.6451 31.5849 22.8965V24.1873C31.5849 24.5564 31.5849 24.7402 31.4969 24.8916C31.4096 25.0437 31.2497 25.1352 30.93 25.3198L23.9954 29.3128C22.7186 30.0473 22.0806 30.4149 21.3799 30.4142C20.6792 30.4135 20.0418 30.0459 18.7657 29.3099L12.2776 25.5662L12.2375 25.543C11.5691 25.153 11.014 24.5956 10.6268 23.9256C10.2397 23.2556 10.0339 22.4963 10.0297 21.7225V20.4908C10.0299 20.0638 10.1422 19.6443 10.3556 19.2744C10.5689 18.9044 10.8757 18.5971 11.2452 18.3831C11.572 18.1938 11.9428 18.094 12.3204 18.0938C12.698 18.0935 13.069 18.1928 13.396 18.3816L18.77 21.4789Z"
                        stroke="white"
                        strokeWidth="0.601826"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </a>
              </Tooltip>
              <Tooltip
                title="Mirror"
                styles={{ body: { background: "#141414" } }}              >
                <a
                  href="https://mirror.xyz/0x0255F7A175f73a05765719c165445F63155aF8E9"
                  className="hover:text-gray-300"
                  title="Telegram"
                  target="blank"
                >
                  <div className="border border-white rounded-full group hover:bg-white p-2">
                    {" "}
                    <svg
                      width="20"
                      height="22"
                      viewBox="0 0 21 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:fill-black transition-colors duration-300 w-3 h-3  lg:w-6 lg:h-6"
                    >
                      <path
                        d="M1 10.5C1 5.25329 5.2533 1 10.5 1V1C15.7467 1 20 5.25329 20 10.5V26H1V10.5Z"
                        stroke="white"
                        strokeWidth="0.8"
                      />
                    </svg>
                  </div>
                </a>
              </Tooltip>
              <Tooltip
                title="Medium"
                styles={{ body: { background: "#141414" } }}              >
                <a
                  href="https://medium.com/@triggerx"
                  className="hover:text-gray-300"
                  title="Telegram"
                  target="blank"
                >
                  <svg
                    width="46"
                    height="45"
                    viewBox="0 0 42 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hover:fill-white transition-colors duration-300 w-8 h-8  lg:w-12 lg:h-12"
                  >
                    <path
                      d="M22.757 21C22.757 25.3015 19.292 28.7875 15.022 28.7875C10.7485 28.7875 7.28525 25.3015 7.28525 21C7.28525 16.6985 10.7503 13.2107 15.0203 13.2107C19.2938 13.2107 22.757 16.6985 22.757 20.9982M38.5 21C38.5 11.34 30.66 3.5 21 3.5C11.34 3.5 3.5 11.34 3.5 21C3.5 30.66 11.34 38.5 21 38.5C30.66 38.5 38.5 30.6583 38.5 21ZM31.2445 20.9982C31.2445 25.0477 29.512 28.3307 27.377 28.3307C25.2385 28.3307 23.5077 25.0477 23.5077 20.9982C23.5077 16.9487 25.2402 13.6658 27.3752 13.6658C29.5102 13.6658 31.2445 16.947 31.2445 20.9982ZM34.713 20.9982C34.713 24.6242 34.104 27.5678 33.3533 27.5678C32.6025 27.5678 31.9918 24.626 31.9918 20.9982C31.9918 17.3705 32.6008 14.4287 33.3533 14.4287C34.104 14.4287 34.713 17.3687 34.713 20.9982Z"
                      stroke="white"
                      strokeWidth="0.8"
                    />
                  </svg>
                </a>
              </Tooltip>
            </div>
            <h4 className="text-start text-[2.5vw] xs:text-xs lg:text-[1vw] 2xl:text-[15px] text-nowrap">
              © {currentYear} TriggerX. All rights reserved.
            </h4>
          </div>

          <div className="w-[100%] sm:w-auto flex flex-col justify-center gap-4 sm:gap-8 items-end">
            <div className="w-[100%] sm:w-auto flex justify-between sm:justify-end gap-0 md:gap-6 lg:gap-16 text-[2.5vw] xs:text-xs lg:text-[1vw] 2xl:text-[15px] text-nowrap  tracking-wide">
              <a
                href="https://triggerx.gitbook.io/triggerx-docs/create-your-first-job"
                className="hover:text-gray-400"
                target="blank"
              >
                Build
              </a>
              <a
                href="https://triggerx.gitbook.io/triggerx-docs"
                className="hover:text-gray-400 "
                target="blank"
              >
                Docs
              </a>
              <a
                href="https://t.me/triggerxnetwork"
                className="hover:text-gray-400"
                target="blank"
              >
                Dev Hub
              </a>
            </div>
            <div className="w-[100%] sm:w-auto flex justify-between sm:justify-end gap-3 md:gap-6 lg:gap-10 text-[2.5vw] xs:text-xs lg:text-[1vw] 2xl:text-[15px] text-nowrap tracking-wide">
              <a
                href="https://triggerx.gitbook.io/triggerx-docs/join-as-keeper"
                className="hover:text-gray-400"
                target="blank"
              >
                Join As Keeper
              </a>
              <div href="#" className="hover:text-gray-400">
                Term of Use
              </div>
              <div href="#" className="hover:text-gray-400">
                Privacy Policy
              </div>
            </div>
          </div>
        </div>

        <div className="w-[95%] mx-auto h-max p-5">
          <img src={logo} alt="footer logo" className="w-full h-auto" />
        </div>

        <img
          src={footer1}
          alt=""
          className="absolute left-0 -z-10 bottom-[75%] sm:bottom-[26%] lg:bottom-[40%] w-[80px] sm:w-[130px] lg:w-[150px] 2xl:w-[200px] h-auto"
        />

        <img
          src={footer2}
          alt=""
          className="absolute right-[0%] sm:right-0 -z-10 bottom-[60%] sm:bottom-[50%] lg:bottom-[30%] w-[80px] sm:w-[130px] 2xl:w-[220px] h-auto"
        />
      </div>
    </>
  );
};

export default Footer;
