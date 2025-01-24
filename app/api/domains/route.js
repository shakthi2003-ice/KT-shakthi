/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const NOTION_API_KEY = "secret_o9Xxhf8GQq5NUCJkw1WKlDkMrvNVNogPIATPkOppmhn";
const DOM_DB = "18443df6abb780dc9bb0f06344c8af2a";
const notion = new Client({ auth: NOTION_API_KEY });

const getDomains = async () => {
  try {
    const response = await notion.databases.query({ database_id: DOM_DB });

    console.log("Raw Notion Response:", JSON.stringify(response, null, 2));

    if (!response.results || response.results.length === 0) {
      throw new Error("No domains found in the database.");
    }

    const domains = response.results.map((row, index) => {
      const profileText = row.properties.Title?.rich_text?.[0]?.plain_text;
      const examNameText = row.properties.Exam?.rich_text?.[0]?.plain_text;
      const imageUrl = row.properties.Image?.files?.[0]?.file?.url;

      return {
        id: index,
        Profile: profileText,
        ExamName: examNameText,
        img: imageUrl,
      };
    });

    console.log("Mapped Domains:", JSON.stringify(domains, null, 2));
    return domains;
  } catch (error) {
    console.error("Error fetching data from Notion:", error);
    throw new Error("Failed to fetch domains");
  }
};

export async function GET() {
  try {
    const domains = await getDomains();
    // Return the JSON response with status 200
    return NextResponse.json(domains, { status: 200 });
  } catch (error) {
    // If there is an error, return the error message with status 500
    return NextResponse.json(
      { error: "Failed to fetch domains" },
      { status: 500 }
    );
  }
}
