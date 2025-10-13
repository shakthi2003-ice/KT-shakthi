/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
// import { Link, Element } from "react-scroll";
import { Link as ScrollLink, Element } from "react-scroll";

import React, { useState } from "react";
import Navbar from "./navbar";
import Image from "next/image";
import Navbar_Main from "./navbar_Main";
// import { NavigationMenuDemo } from "./navbar_Main";
interface MainPageClientProps {
  careerName: string;
  domainData: any;
  headingInfo: { id: string; name: string }[];
  groupedBlocks: JSX.Element[];
}
const MainPageClient: React.FC<MainPageClientProps> = ({
  careerName,
  domainData,
  headingInfo,
  groupedBlocks,
}) => {
  const data = {
    Name: domainData?.Profile || "",
    ShortContent: domainData?.ShortContent || "",
    longContent: domainData?.LongContent || "",
    Salary: domainData?.Details?.Salary || "",
    Duration: domainData?.Details?.Duration || "",
    TopCollege: domainData?.Details?.TopCollege || "",
    Overview: domainData?.Overview || "",
    Link: domainData?.YoutubeLink || "",
  };
  const [activeTab, setActiveTab] = useState(
    headingInfo[0].name.split("(")[0].trim()
  );
  console.log(headingInfo[0].name.split("(")[0].trim());
  if (!domainData) {
    return <div>Loading....</div>;
  }
  const convertToEmbedUrl = (originalUrl: any) => {
    try {
      if (!originalUrl) {
        throw new Error("YouTube link is missing");
      }

      const url = new URL(originalUrl);
      const videoId = url.searchParams.get("v");

      if (!videoId) {
        throw new Error("Invalid YouTube URL or VIDEO_ID not found.");
      }

      return `https://www.youtube.com/embed/${videoId}`;
    } catch (err) {
      console.error("Invalid video link:");
      return ""; // Return empty string if invalid
    }
  };
  let idx = -1;
  return (
    <div>
      {/* <Navbar /> */}
      <Navbar_Main />
      <div className="flex flex-col gap-4 bg-[#EBF8FD] px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:pt-10 md:h-[300px]">
        <div className="text-2xl sm:text-3xl md:text-4xl text-[#0D2A57] font-Inter font-bold capitalize">
          {data.Name}
        </div>
        <div className="font-Inter text-base sm:text-lg md:text-xl font-semibold w-full md:w-3/5">
          {data.ShortContent}
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10 md:gap-12 mt-2">
          <div className="flex items-center gap-3">
            <Image src="/Salary.png" alt="salary" height={40} width={40} />
            <div className="font-Inter font-semibold text-sm sm:text-base">
              Avg Salary: {data.Salary}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Image src="/duration.png" alt="duration" height={40} width={40} />
            <div className="font-Inter font-semibold text-sm sm:text-base">
              Duration: {data.Duration}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Image src="/college.png" alt="college" height={40} width={40} />
            <div className="font-Inter font-semibold text-sm sm:text-base">
              Top College: {data.TopCollege}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4 pt-10">
        {/* Video Container */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="aspect-video w-full max-w-[560px]">
            <iframe
              className="w-full h-full rounded-md"
              src={convertToEmbedUrl(data.Link)}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* About Content */}
        <div className="relative w-full lg:w-1/2 bg-white border border-gray-300 shadow-md rounded-xl p-6 pt-10 text-sm text-gray-800">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-400 rounded-full text-base md:text-lg px-4 py-1 text-center font-bold shadow-sm capitalize">
            About {careerName}
          </div>
          <div className="whitespace-pre-line mt-10 text-base md:text-lg font-medium font-Inter">
            {data.longContent}
          </div>
        </div>
      </div>

      <div className="border-b sticky z-10 top-[54px] shadow-sm bg-white mb-4">
        <div className="overflow-x-auto">
          <div className="flex justify-start space-x-6 md:space-x-10 py-2 pl-2 pr-2 font-semibold text-black whitespace-nowrap">
            {headingInfo.length > 0
              ? headingInfo.map((tab: any) => (
                  <ScrollLink
                    to={tab.id}
                    smooth={true}
                    duration={500}
                    key={tab.id}
                    offset={-120}
                    onClick={() => setActiveTab(tab.name.split("(")[0].trim())}
                    className={`relative pb-1 cursor-pointer transition-all duration-200 ${
                      activeTab === tab.name.split("(")[0].trim()
                        ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-black"
                        : "text-gray-600"
                    }`}
                  >
                    {tab.name.split("(")[0].trim()}
                  </ScrollLink>
                ))
              : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row pl-4 pr-4">
        <div className="flex flex-col h-full">
          <div className="w-full">
            {groupedBlocks.map((block, index) => {
              // console.log(block.type);
              if (block.type == "h2") {
                idx++;
                // console.log(headingInfo[idx]); // Log the entire object
                // console.log("ID:", headingInfo[idx].id); // Log the ID
                // console.log("Name:", headingInfo[idx].name); // Log the Name
                return (
                  <Element key={index} name={headingInfo[idx].id}>
                    {block}
                  </Element>
                );
              }
              return block;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageClient;
