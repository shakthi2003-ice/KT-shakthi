/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require("@notionhq/client");

const NOTION_API_KEY =
  process.env.NOTION_API_KEY ||
  "secret_o9Xxhf8GQq5NUCJkw1WKlDkMrvNVNogPIATPkOppmhn";
const DOM_DB = process.env.DOM_DB || "757ece9dcd764ffb9396af8851e3525f";
const notion = new Client({ auth: NOTION_API_KEY });

const getDomains = async () => {
  const response = await notion.databases.query({ database_id: DOM_DB });
  return response.results.map((page) => {
    const obj = page.properties;
    return {
      Profile: obj.Profile.title[0]?.plain_text,
      Database: obj.Database.rich_text[0]?.plain_text,
    };
  });
};

export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  try {
    const domains = await getDomains();
    let DOMAIN_DB = false;

    domains.forEach((obj) => {
      if (obj.Profile.toLowerCase() === domain.toLowerCase()) {
        DOMAIN_DB = obj.Database;
      }
    });

    if (!DOMAIN_DB) {
      return res.status(404).json({ error: "Domain not found" });
    }

    const response = await notion.databases.query({ database_id: DOMAIN_DB });
    const obj = response.results[0].properties;

    const result = {
      mainHeading: obj.MainHeading.title[0]?.plain_text,
      subHeading: obj.SubHeading.rich_text[0]?.plain_text,
      content: obj.Content.rich_text[0]?.plain_text.split("\n"),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching domain:", error);
    res.status(500).json({ error: "Failed to fetch domain details" });
  }
}
