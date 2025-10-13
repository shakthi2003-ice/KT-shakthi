"use client";

import React, { useEffect, useState } from "react";

import { Link as ScrollLink } from "react-scroll";

export default function Main() {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const videoUrl = "https://www.youtube.com/embed/9FMnyBv9x2c";

  return (
    <main className="bg-white font-inter">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row bg-white">
        {/* Left Column: Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <div
            className="max-w-xl text-center md:text-left"
            style={{
              transform: hasAnimated ? "translateX(0)" : "translateX(-50px)",
              opacity: hasAnimated ? 1 : 0,
              transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
            }}
          >
            <div className="text-lg md:text-xl font-semibold uppercase text-indigo-600 mb-2">
              The Next Step Is Clear
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              Empowering Your <br className="hidden md:inline" />
              <span className="text-indigo-600">Career Journey</span>
            </div>
            <div className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-600 max-w-2xl">
              Navigate your next steps, discover opportunities, and move forward
              with confidence and clarity.
            </div>

            <div className="mt-6 md:mt-8">
              <ScrollLink
                to="career"
                smooth={true}
                duration={800} // Increased duration for a smoother feel
                offset={-80} // Adjust offset if you have a sticky header
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-full shadow-xl transition duration-300 transform hover:scale-105 hover:shadow-2xl inline-block cursor-pointer"
              >
                Start Exploring
              </ScrollLink>
            </div>
          </div>
        </div>

        {/* Right Column: Video */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-10 lg:px-16 py-12 md:py-16 bg-gray-50">
          <div
            className="shadow-2xl rounded-2xl overflow-hidden max-w-lg w-full"
            style={{
              transform: hasAnimated ? "translateX(0)" : "translateX(50px)",
              opacity: hasAnimated ? 1 : 0,
              transition:
                "transform 1s ease-out 0.2s, opacity 1s ease-out 0.2s",
            }}
          >
            <iframe
              className="w-full aspect-video border-4 border-gray-200 rounded-2xl"
              src={videoUrl}
              title="Career Journey Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
            <div className="p-4 bg-white text-gray-700 font-semibold text-sm">
              Watch our introduction to understand the opportunities ahead.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
