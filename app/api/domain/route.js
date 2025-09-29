/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const NOTION_API_KEY = "secret_o9Xxhf8GQq5NUCJkw1WKlDkMrvNVNogPIATPkOppmhn";
const DOM_DB = "18443df6abb780dc9bb0f06344c8af2a";
const notion = new Client({ auth: NOTION_API_KEY });

// Function to get details of a specific domain based on domain name
const getDomainDetails = async (domainName) => {
  try {
    const response = await notion.databases.query({ database_id: DOM_DB });

    if (!response.results || response.results.length === 0) {
      throw new Error("No domains found in the database.");
    }

    // Filter the results based on the domain name
    const domain = response.results.find((row) => {
      const domainText = row.properties.Domain?.title?.[0]?.plain_text;
      return (
        domainText && domainText.toLowerCase() === domainName.toLowerCase()
      );
    });

    if (!domain) {
      throw new Error(`Domain "${domainName}" not found.`);
    }
    // Extract the necessary properties from the domain
    const profileText = domain.properties.Title?.rich_text?.[0]?.plain_text;
    const examNameText = domain.properties.Exam?.rich_text?.[0]?.plain_text;
    const imageUrl = domain.properties.Image?.files?.[0]?.file?.url;
    const domainText = domain.properties.Domain?.title?.[0]?.plain_text;
    const short = domain.properties.ShortContent?.rich_text?.[0]?.plain_text;
    const long = domain.properties.LongContent?.rich_text?.[0]?.plain_text;
    const YTLink = domain.properties.YoutubeLink?.url;
    const overviewRaw =
      domain.properties.Overview?.rich_text?.[0]?.plain_text || "";
    const detailRaw =
      domain.properties.Details?.rich_text?.[0]?.plain_text || "";
    const overviewArray = overviewRaw
      .split("\n") // split by newline
      .map((line) => line.replace(/^•\s*/, "")) // remove leading bullet point and space
      .filter((line) => line.trim() !== ""); // remove empty lines (if any)
    const detailArray = detailRaw
      .split("\n")
      .map((line) => line.replace(/^•\s*/, ""))
      .filter((line) => line.trim() !== "");
    const details = {};
    if (detailArray[0]) details.Salary = detailArray[0];
    if (detailArray[1]) details.Duration = detailArray[1];
    if (detailArray[2]) details.TopCollege = detailArray[2];

    return {
      id: domain.id,
      Profile: profileText,
      ExamName: examNameText,
      img: imageUrl,
      domain: domainText,
      ShortContent: short,
      LongContent: long,
      YoutubeLink: YTLink,
      Overview: overviewArray,
      Details: details,
    };
  } catch (error) {
    // console.error("Error fetching domain details from Notion:", error);
    throw new Error("Failed to fetch domain details");
  }
};

export async function GET(req) {
  try {
    // Extract the domain name from the query parameter
    // console.log(req);
    const domainName = req.nextUrl.searchParams.get("domain");

    if (!domainName) {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 }
      );
    }

    // Get the details of the domain
    const domainDetails = await getDomainDetails(domainName);

    if (!domainDetails) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Return the domain details as a JSON response
    return NextResponse.json(domainDetails, { status: 200 });
  } catch (error) {
    // If there is an error, return the error message with status 500
    return NextResponse.json(
      { error: error.message || "Failed to fetch domain details" },
      { status: 500 }
    );
  }
}
