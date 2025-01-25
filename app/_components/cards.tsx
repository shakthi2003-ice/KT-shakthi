"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardsProps {
  Profile: string;
  ExamName: string;
  img: string;
  URL: string;
}
export default function Cards({ Profile, ExamName, img, URL }: CardsProps) {
  return (
    <Link
      href={`/${URL}`}
      className="mt-8 w-72 h-[350px] flex flex-col justify-between cursor-pointer items-center rounded-3xl p-6 shadow-xl transform transition-transform duration-200 hover:scale-105 hover:shadow-2xl bg-purple-50"
    >
      <Image src={img} alt={`${Profile} icon`} height={80} width={80} />
      <div className="text-2xl mt-4 font-Poppins font-bold text-black text-center">
        {Profile}
      </div>
      <div className="mt-4 text-sm font-Roboto text-center text-gray-600">
        {ExamName}
      </div>
      <div className="mt-6 text-blue-500 text-lg font-semibold flex items-center">
        Visit Website →
      </div>
    </Link>
  );
}
