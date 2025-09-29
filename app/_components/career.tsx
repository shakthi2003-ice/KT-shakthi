/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Cards from "./cards";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

type CareerOptions = {
  id: number;
  Profile: string;
  ExamName: string;
  img: string;
  domain: string;
};

export default function Career() {
  const [data, setData] = useState<CareerOptions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [clickLoading, setClickLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/domains");
        if (!response.ok) {
          throw new Error("Failed to fetch domains");
        }
        const result = await response.json();
        const careers: CareerOptions[] = result.map((domain: any) => ({
          id: domain.id,
          Profile: domain.Profile,
          ExamName: domain.ExamName || "Exam Placeholder",
          img:
            domain.img ||
            "https://prod-files-secure.s3.us-west-2.amazonaws.com/b020cb67-a9a0-4a42-84cd-216945bf98f8/50918ebf-e505-45ab-8810-62cfcffb9058/aviation.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45FSPPWI6X%2F20250124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250124T204905Z&X-Amz-Expires=3600&X-Amz-Signature=ca34e545dda74a7141f07c6c490b6b000ecab6e2d3eb7b4cef3fd5afadbbd0b2&X-Amz-SignedHeaders=host&x-id=GetObject",
          domain: domain.domain || "https://kalvithadam.ignitte.org/",
        }));
        setData(careers);
      } catch (error) {
        console.error("Error fetching career data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const handleCardClick = (url: string) => {
    setClickLoading(true);
    router.push(url);
  };

  if (loading) {
    return (
      <>
        <div className="pt-16 pl-18px mb-2 space-y-2">
          <div className="w-64 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="w-40 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="pb-8 pl-18px pr-18px gap-x-[100px] flex flex-row items-center justify-between animate-pulse">
          <div className="w-72 h-[350px] bg-gray-200 rounded-3xl animate-pulse"></div>
          <div className="w-72 h-[350px] bg-gray-200 rounded-3xl animate-pulse"></div>
          <div className="w-72 h-[350px] bg-gray-200 rounded-3xl animate-pulse"></div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white pb-5 -mt-50 md:-mt-60 lg:-mt-0" id="careerSection">
      {clickLoading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-mainBlue border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-4 text-xl font-semibold text-mainBlue">
            Loading...
          </span>
        </div>
      )}

      <div className="pt-16 pl-18px">
        <div>
          <div className="text-3xl font-Poppins font-bold text-black mb-0">
            Find Your Career
          </div>
          <div className="leading-none -mt-3">
            <span className="text-3xl font-Poppins font-bold text-black">
              Start Your
            </span>
            <span className="text-4xl font-Rochester text-black"> journey</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-[100px] justify-center">
        {(showMore ? data : data.slice(0, 3)).map(
          (item: CareerOptions, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 100 }} // Start with fade and slide up
              whileInView={{ opacity: 1, y: 0 }} // Animate to visible state
              viewport={{ once: true }} // Trigger animation only once
              transition={{ duration: 0.8, delay: index * 0.2 }} // Add delay for a staggered effect
            >
              <Cards
                Profile={item.Profile || ""}
                ExamName={item.ExamName}
                img={item.img}
                URL={item.domain}
                onClick={() => handleCardClick(item.domain)}
              />
            </motion.div>
          )
        )}
      </div>
      <div className="mb-2 flex justify-center mt-8 ">
        <button
          className="flex items-center justify-center bg-mainBlue p-4 rounded-full transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
          onClick={toggleShowMore}
        >
          <div className="text-md md:text-xl font-Poppins text-white font-semibold">
            {showMore ? "Show Less" : "See More"}
          </div>
        </button>
      </div>
    </div>
  );
}
