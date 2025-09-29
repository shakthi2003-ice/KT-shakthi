"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar_Main() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#74D7FF] sticky top-0 z-10 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap justify-between items-center mx-auto p-4 bg-[#74D7FF]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="/logo.png"
            className="h-8"
            alt="Flowbite Logo"
            height={100}
            width={33}
          />
          <span className="self-center text-2xl font-Inter font-bold whitespace-nowrap dark:text-white">
            Kalvithadam
          </span>
        </Link>

        <div className="hidden md:flex justify-center md:w-auto md:order-1">
          <ul className="flex flex-col list-none p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-[#74D7FF] md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-[#74D7FF] dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <div>
              <Link
                href="#"
                className="block py-2 px-3 font-Inter font-bold text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                aria-current="page"
              >
                Home
              </Link>
            </div>
            <div>
              <Link
                href="https://ignitte.org/about"
                className="block py-2 px-3 font-Inter font-bold text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                About Us
              </Link>
            </div>
            <div>
              <Link
                href="https://www.youtube.com/@IGNITTETeachingClubofNITT"
                className="block py-2 px-3 font-Inter font-bold text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Youtube
              </Link>
            </div>
            <div>
              <Link
                href="https://ignitte.org/contact"
                className="block py-2 px-3 font-Inter font-bold text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact Us
              </Link>
            </div>
          </ul>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-black hover:bg-blue-600 focus:outline-none"
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
        <div className="md:hidden bg-[#74D7FF] border-t border-gray-200">
          <ul className="flex flex-col p-4 space-y-4 font-medium list-none">
            <li>
              <Link
                href="#"
                className="block py-2 px-3 font-Inter font-bold text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="https://ignitte.org/about"
                className="block py-2 px-3 font-Inter font-bold text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="https://ignitte.org/contact"
                className="block py-2 px-3 font-Inter font-bold text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
