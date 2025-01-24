/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
// import  from 'react-anchor-link-smooth-scroll'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import dynamic from "next/dynamic";

const ScrollLink = dynamic(
  () => import("react-scroll").then((mod) => mod.Link),
  {
    ssr: false,
  }
);

export function AppSidebar({
  toc,
  title,
  ...props
}: { toc: any } & { title: string } & React.ComponentProps<typeof Sidebar>) {
  function capitalizeFirstLetter(str: string) {
    if (!str) return ""; // Handle empty strings or null values
    // Remove ':' and ';', then capitalize
    str = str.replace(/[:;]/g, ""); // Remove all occurrences of ':' and ';'
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <ScrollLink
                smooth={true}
                duration={500}
                className="hover:underline md:me-6 cursor-pointer"
                to="secretTitle"
                // containerId="scrollable-container"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/worker.png"
                    alt="worker"
                    height={100}
                    width={100}
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{title}</span>
                  <span>Find Your Career</span>
                </div>
              </ScrollLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* Dynamically generate the sidebar from the TOC data */}
            {toc?.map((item: any) => (
              <SidebarMenuItem key={item.title}>
                {/* Apply distinct styling for main headings */}
                <SidebarMenuButton asChild>
                  <ScrollLink
                    to={item.url}
                    // onClick={() => scrollToSection(item.url)}
                    className="hover:underline me-4 md:me-6 cursor-pointer font-semibold text-lg text-sidebar-primary" // Different styles for main heading
                    smooth={true}
                    duration={500}
                    // containerId="scrollable-container"
                  >
                    {item.title.toUpperCase()}
                  </ScrollLink>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <SidebarMenuSub className="">
                    {item.items.map((subItem: any) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        {/* Apply distinct styling for subheadings */}
                        <SidebarMenuSubButton asChild>
                          <ScrollLink
                            to={item.url}
                            className="hover:underline me-4 md:me-6 cursor-pointer font-normal text-sm text-sidebar-secondary" // Different styles for subheading
                            smooth={true}
                            duration={500}
                            spy={true}
                            // containerId="scrollable-container"
                          >
                            {capitalizeFirstLetter(subItem.title)}
                          </ScrollLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
