"use client";
import Image from "next/image";
import React from "react";

export default function Search() {
  return (
    <button className="flex items-center">
      <input
        type="text"
        placeholder="Search Career"
        className="h-[33px] font-Inter bg-white rounded-tl-lg rounded-bl-lg p-2"
      />
      <div className="h-[33px] rounded-tr-lg rounded-br-lg w-[40px] bg-[#0046AF] flex items-center justify-center p-1">
        <Image alt="search" src="/search.png" height={25} width={25} />
      </div>
    </button>
  );
}
