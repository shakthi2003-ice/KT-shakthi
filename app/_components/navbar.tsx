"use client";

import Image from "next/image";
import Search from "./Search";
import Link from "next/link";

// import { Link } from "react-scroll";

export default function Navbar() {
  return (
    <nav className="bg-[#74D7FF] h-[54px] flex sticky top-0 z-10">
      <div className="bg-[#74D7FF] h-[54px] w-1/2 flex gap-8">
        <Image src="/logo.png" alt="logo" height={48} width={48} />
        <Search />
      </div>
      <div className="text-lg text-[#0046AF]  font-Inter font-bold h-[54px] w-1/2 flex justify-center gap-[100px] items-center">
        <Link href="/" className="text-xs md:text-sm">
          Home
        </Link>
        <Link href="https://ignitte.org/about" className="text-xs md:text-sm">
          About Us
        </Link>
        <Link href="https://ignitte.org/contact" className="text-xs md:text-sm">
          Contact Us
        </Link>
      </div>
    </nav>
  );
}
