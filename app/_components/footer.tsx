"use client";

import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white rounded-lg ">
      <div className="w-full max-w-screen-xl md:py-4">
        <div className="flex gap-10 items-center justify-between">
          <a
            href="https://ignitte.org/"
            className="flex mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/footerLogo.png"
              alt="Flowbite Logo"
              width={40}
              height={70}
              className="ml-3"
            />
            <span className="hidden md:flex self-center text-2xl font-Inter font-bold tracking-wider whitespace-nowrap">
              IGNITTE
            </span>
          </a>
          <ul className="flex justify-between items-end text-sm font-medium text-gray-500 sm:mb-0">
            <li>
              <a
                href="https://ignitte.org/about/"
                className="hover:underline me-4 md:me-6"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="https://ignitte.org/team/"
                className="hover:underline me-4 md:me-6"
              >
                Meet our Team
              </a>
            </li>
            <li>
              <a
                href="https://ignitte.org/contact/"
                className="hover:underline mr-4"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
        <div className="flex items-center justify-center">
          <span className="block text-sm text-gray-500 sm:text-center">
            © 2022{" "}
            <a href="https://ignitte.com/" className="hover:underline">
              IGNITTE™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
