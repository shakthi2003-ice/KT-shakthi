"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar_Main() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-indigo-700 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-between items-center p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="/logo.png"
            alt="Kalvithadam Logo"
            width={30}
            height={250}
            className="h-8"
          />
          <span className="text-2xl font-Inter font-bold text-white">
            Kalvithadam
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link
            href="/"
            className="text-white font-bold hover:text-[#1A1A1A] transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="https://ignitte.org/about"
            className="text-white font-bold hover:text-[#1A1A1A] transition-colors duration-300"
          >
            About Us
          </Link>
          <Link
            href="https://www.youtube.com/@IGNITTETeachingClubofNITT"
            className="text-white font-bold hover:text-[#1A1A1A] transition-colors duration-300"
          >
            Youtube
          </Link>
          <Link
            href="https://ignitte.org/contact"
            className="text-white font-bold hover:text-[#1A1A1A] transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-white hover:text-[#1A1A1A] focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-600 border-t border-indigo-700">
          <ul className="flex flex-col p-4 space-y-4">
            <li>
              <Link
                href="/"
                className="text-white font-bold hover:text-[#1A1A1A] transition-colors duration-300 block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="https://ignitte.org/about"
                className="text-white font-bold hover:text-[#1A1A1A] transition-colors duration-300 block"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/@IGNITTETeachingClubofNITT"
                className="text-white font-bold hover:text-[#1A1A1A] transition-colors duration-300 block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Youtube
              </Link>
            </li>
            <li>
              <Link
                href="https://ignitte.org/contact"
                className="text-white font-bold hover:text-[#1A1A1A] transition-colors duration-300 block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
