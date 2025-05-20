
import React, { useState } from "react";
import logo from "../assets/footer svgs/footerLogo.svg";
import footer1 from "../assets/footer svgs/footer1.png";
import footer2 from "../assets/footer svgs/footer2.png";
import { Tooltip } from "antd";
import github from "../assets/footer svgs/github.svg"
import githubdark from "../assets/footer svgs/githubdark.svg";

import twitter from "../assets/footer svgs/twitter.svg";
import twitterdark from "../assets/footer svgs/twitterdark.svg";
import telegram from "../assets/footer svgs/telegram.svg";
import telegramdark from "../assets/footer svgs/telegramdark.svg";
import gitbook from "../assets/footer svgs/gitbook.svg";
import gitbookdark from "../assets/footer svgs/gitbookdark.svg";
import mirror from "../assets/footer svgs/mirror.svg";
import mirrordark from "../assets/footer svgs/mirrordark.svg";
import medium from "../assets/footer svgs/medium.svg";
import mediumdark from "../assets/footer svgs/mediumdark.svg";
import youtube from "../assets/footer svgs/youtube.svg";
import youtubedark from "../assets/footer svgs/youtubedark.svg";

const socialLinks = [
  {
    title: "Github",
    href: "https://github.com/trigg3rX",
    icon: github,
    iconDark: githubdark,
    border: true,
    alt: "GitHub",
  },
  {
    title: "Twitter",
    href: "https://x.com/TriggerXnetwork",
    icon: twitter,
    iconDark: twitterdark,
    border: true,
    alt: "Twitter",
  },
  {
    title: "Telegram",
    href: "https://t.me/triggerxnetwork",
    icon: telegram,
    iconDark: telegramdark,
    border: true,
    alt: "Telegram",
  },
  {
    title: "Gitbook",
    href: "https://triggerx.gitbook.io/triggerx-docs",
    icon: gitbook,
    iconDark: gitbookdark,
    border: true,
    alt: "GitBook",
  },
  {
    title: "Mirror",
    href: "https://mirror.xyz/0x0255F7A175f73a05765719c165445F63155aF8E9",
    icon: mirror,
    iconDark: mirrordark,
    border: true,
    alt: "Mirror",
  },
  {
    title: "Medium",
    href: "https://medium.com/@triggerx",
    icon: medium,
    iconDark: mediumdark,
    border: true,
    alt: "Medium",
  },
  {
    title: "Youtube",
    href: "https://www.youtube.com/@triggerxnetwork",
    icon: youtube,
    iconDark: youtubedark,
    border: true,
    alt: "YouTube",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center gap-[5px] md:gap-[90px] lg:gap-[120px] 2xl:gap-[120px]">
        <div className="flex mt-20 flex-col-reverse md:flex-row items-start md:items-end justify-between gap-5 w-[88%] md:w-[80%] xl:w-[70%] mx-auto">
          <div className="flex flex-col gap-4 w-[100%] md:w-auto mx-auto">
            <div className="flex space-x-2 xs:space-x-3 lg:space-x-4 items-center mr-auto">
              {socialLinks.map(
                ({ title, href, icon, iconDark, border, alt }) => (
                  <Tooltip
                    key={title}
                    title={title}
                    styles={{
                      body: { background: "#141414" },
                    }}
                  >
                    <a
                      href={href}
                      className={`hover:text-gray-300 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 overflow-hidden rounded-full ${border ? "border hover:bg-white" : ""
                        }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`TriggerX on ${title}`}
                      onMouseEnter={() => setHovered(title)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <img
                        src={hovered === title && iconDark ? iconDark : icon}
                        alt={alt}
                        width={24}
                        height={24}
                        className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
                      />
                    </a>
                  </Tooltip>
                )
              )}
            </div>
            <h4 className="text-start text-[10px] xs:text-[12px] lg:text-[13px] 2xl:text-[15px] text-nowrap">
              © {currentYear} TriggerX. All rights reserved.
            </h4>
          </div>

          <div className="w-[100%] md:w-auto mx-auto flex flex-col justify-center gap-4 md:gap-8 items-end">
            <div className="w-[100%] md:w-auto flex justify-between md:justify-end gap-0 md:gap-7 lg:gap-12 text-[10px] xs:text-[12px] lg:text-[14px] 2xl:text-[15px] text-nowrap tracking-wide">
              <a
                href="https://app.triggerx.network/"
                className="hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Build
              </a>
              <a
                href="https://triggerx.gitbook.io/triggerx-docs"
                className="hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
              <a
                href="https://app.triggerx.network/devhub"
                className="hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dev Hub
              </a>
            </div>
            <div className="w-[100%] md:w-auto flex justify-between md:justify-end gap-3 md:gap-5 lg:gap-8 text-[10px] xs:text-[12px] lg:text-[14px] 2xl:text-[15px] text-nowrap tracking-wide">
              <a
                href="https://triggerx.gitbook.io/triggerx-docs/join-as-keeper"
                className="hover:text-gray-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join As Keeper
              </a>
              <div className="hover:text-gray-400" title="Available Soon">
                Term of Use
              </div>
              <div className="hover:text-gray-400" title="Available Soon">
                Privacy Policy
              </div>
            </div>
          </div>
        </div>

        <div className="w-[95%] mx-auto h-max p-5">
          <img src={logo} alt="footer" className="w-full h-auto" />
        </div>

        <div className="absolute left-0 -z-10 bottom-[68%] md:bottom-[26%] lg:bottom-[40%] w-[80px] sm:w-[130px] lg:w-[150px] 2xl:w-[200px] h-max overflow-hidden">
          <img
            src={footer1}
            alt=""
            className="w-full h-auto relative -left-5 md:left-0"
          />
        </div>

        <div className="absolute right-0 -z-10 bottom-[53%] md:bottom-[50%] lg:bottom-[30%] w-[80px] sm:w-[130px] 2xl:w-[220px] h-max overflow-hidden">
          <img
            src={footer2}
            alt=""
            className="w-full h-auto relative left-5 md:left-0"
          />
        </div>
      </div>
    </>
  );
};

export default Footer;