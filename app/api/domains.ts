/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from "@notionhq/client";

// import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const NOTION_API_KEY = "secret_o9Xxhf8GQq5NUCJkw1WKlDkMrvNVNogPIATPkOppmhn";
const DOM_DB = "18443df6abb780dc9bb0f06344c8af2a";
const notion = new Client({ auth: NOTION_API_KEY });

const getDomains = async () => {
  const response = await notion.databases.query({ database_id: DOM_DB });
  response.results.sort((a: any, b: any) => {
    return a.properties.Priority.number - b.properties.Priority.number;
  });
  const domains = new Array(response.results.length);
  // log(response.results);
  response.results.forEach((row: any, index: number) => {
    domains[index] = {
      id: index,
      Profile: row.properties.Title.title[0]?.plain_text,
      ExamName: row.properties.Exam.rich_text[0]?.plain_text,
      img: row.properties.Image.files[0]?.file.url,
      // url: row.properties.Domain.title[0]?.plain_text,
    };
  });
  return domains;
};

export async function GET() {
  try {
    const domains = await getDomains();
    NextResponse.json(domains);
    // return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch domains" },
      { status: 500 }
    );
  }
}
// export default async function handler(req: any, res: any) {
//   try {
//     // const domains = await getDomains();
//     res.status(200).send("Hello World");
//   } catch (error) {
//     console.error("Error fetching domains:", error);
//     res.status(500).json({ error: "Failed to fetch domains" });
//   }
// }
