/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
import { Client } from "@notionhq/client";
import {
  ListBlockChildrenResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import "../globals.css";
import Image from "next/image";
// import MainPageClient from "../_components/MainPageClient";
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const convertToEmbedUrl = (originalUrl: any) => {
  const url = new URL(originalUrl);
  const videoId = url.searchParams.get("v"); // Extract the "v" parameter

  if (!videoId) {
    throw new Error("Invalid YouTube URL or VIDEO_ID not found.");
  }

  return `https://www.youtube.com/embed/${videoId}`;
};

const fetchMapping = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID!;

  const response = await notion.databases.query({
    database_id: databaseId,
  });
  // console.log("Notion Response:", response);

  const mapping = response.results
    .map((page) => {
      if ("properties" in page) {
        const customNameProperty = page.properties["Domain"];
        const pageIdProperty = page.properties["Link"];

        const customName =
          customNameProperty?.type === "title" &&
          Array.isArray(customNameProperty.title) &&
          customNameProperty.title[0]?.plain_text
            ? customNameProperty.title[0].plain_text
            : null;

        const pageId =
          pageIdProperty?.type === "rich_text" &&
          Array.isArray(pageIdProperty.rich_text) &&
          pageIdProperty.rich_text[0]?.plain_text
            ? pageIdProperty.rich_text[0].plain_text
            : null;

        if (customName && pageId) {
          return { customName, pageId };
        }
      }
      return null;
    })
    .filter(Boolean);

  return mapping as { customName: string; pageId: string }[];
};

export default async function MainContentDuplicate(props: {
  params: Promise<{ id: string }>;
}) {
  const mapping = await fetchMapping();
  const result = await props.params;
  const { id } = result;
  const entry = mapping.find((m) => m.customName === id);

  if (!entry) {
    return <div>Page not found</div>;
  }

  try {
    const page = (await notion.pages.retrieve({
      page_id: entry.pageId,
    })) as PageObjectResponse;

    const blocks = await notion.blocks.children.list({
      block_id: entry.pageId,
    });

    const titleProperty = page.properties["Name"];
    const title =
      titleProperty?.type === "title" &&
      Array.isArray(titleProperty.title) &&
      titleProperty.title[0]?.plain_text
        ? titleProperty.title[0].plain_text
        : "Untitled";
    const { groupedBlocks } = renderBlocks(blocks.results);
    return (
      <>
        {/* <MainPageClient careerName={id} /> */}
        <div className="flex flex-col md:flex-row pl-4 pr-4">
          <div className="flex flex-col h-full">
            <div className="w-full">{groupedBlocks}</div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    // console.error("Error fetching Notion page:", error);
    return <div>Error loading page</div>;
  }
}

function renderBlocks(blocks: ListBlockChildrenResponse["results"] | null) {
  const groupedBlocks: JSX.Element[] = [];
  let currentList: JSX.Element[] = [];
  let listType: "ul" | "ol" | null = null;

  const renderNestedBlocks = async (block: any) => {
    if (block.has_children) {
      const childBlocks = await notion.blocks.children.list({
        block_id: block.id,
      });
      const { groupedBlocks } = renderBlocks(childBlocks.results);
      return groupedBlocks;
    }
    return null;
  };

  blocks?.forEach((block, index) => {
    if (!("type" in block)) return;

    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const isBulleted = block.type === "bulleted_list_item";
      if (!listType) {
        listType = isBulleted ? "ul" : "ol";
      } else if (
        (listType === "ul" && !isBulleted) ||
        (listType === "ol" && isBulleted)
      ) {
        groupedBlocks.push(
          listType === "ul" ? (
            <ul key={`ul-${index}`}>{currentList}</ul>
          ) : (
            <ol key={`ol-${index}`}>{currentList}</ol>
          )
        );
        currentList = [];
        listType = isBulleted ? "ul" : "ol";
      }

      const listItem =
        block.type === "bulleted_list_item"
          ? block.bulleted_list_item
          : block.numbered_list_item;

      currentList.push(
        <li key={block.id}>
          {listItem.rich_text.map((text, i) => (
            <span
              key={i}
              style={{
                fontWeight: text.annotations.bold ? "bold" : undefined,
                fontStyle: text.annotations.italic ? "italic" : undefined,
                textDecoration: text.annotations.underline
                  ? "underline"
                  : text.annotations.strikethrough
                  ? "line-through"
                  : undefined,
                color:
                  text.annotations.color !== "default"
                    ? text.annotations.color
                    : undefined,
              }}
            >
              {text.plain_text}
            </span>
          ))}
          {block.has_children && <ul>{renderNestedBlocks(block)}</ul>}
        </li>
      );
    } else {
      if (listType) {
        groupedBlocks.push(
          listType === "ul" ? <ul>{currentList}</ul> : <ol>{currentList}</ol>
        );
        currentList = [];
        listType = null;
      }

      switch (block.type) {
        case "heading_1":
          groupedBlocks.push(
            <h1
              id={block.id}
              key={block.id}
              className="text-3xl font-Inter mt-[30px] mb-[15px] font-extrabold text-black"
            >
              {block.heading_1.rich_text.map((text) => text.plain_text)}
            </h1>
          );
          break;

        case "heading_2":
          groupedBlocks.push(
            <h2
              id={block.id}
              key={block.id}
              className="text-2xl font-Inter mt-[25px] mb-[10px] font-extrabold text-black"
            >
              {block.heading_2.rich_text.map((text) => text.plain_text)}
            </h2>
          );
          break;

        case "heading_3":
          groupedBlocks.push(
            <h3
              key={block.id}
              className="text-xl font-Inter mt-[20px] mb-[10px] font-bold text-black"
            >
              {block.heading_3.rich_text.map((text) => text.plain_text)}
            </h3>
          );
          break;

        case "paragraph":
          groupedBlocks.push(
            <p key={block.id}>
              {block.paragraph.rich_text.map((text, i) => (
                <span
                  key={i}
                  style={{
                    fontWeight: text.annotations.bold ? "bold" : undefined,
                    fontStyle: text.annotations.italic ? "italic" : undefined,
                    textDecoration: text.annotations.underline
                      ? "underline"
                      : text.annotations.strikethrough
                      ? "line-through"
                      : undefined,
                    color:
                      text.annotations.color !== "default"
                        ? text.annotations.color
                        : undefined,
                  }}
                >
                  {text.plain_text}
                </span>
              ))}
            </p>
          );
          break;

        case "quote":
          groupedBlocks.push(
            <blockquote key={block.id} className="notion-quote">
              {block.quote.rich_text.map((text) => text.plain_text)}
            </blockquote>
          );
          break;

        case "code":
          groupedBlocks.push(
            <pre key={block.id} className="bg-gray-100 p-4 rounded">
              <code>{block.code.rich_text.map((text) => text.plain_text)}</code>
            </pre>
          );
          break;

        case "image":
          groupedBlocks.push(
            <div key={block.id} className="notion-image">
              {block.image.type === "external" ? (
                <Image src={block.image.external.url} alt="Notion Image" />
              ) : block.image.type === "file" ? (
                <Image src={block.image.file.url} alt="Notion Image" />
              ) : null}
            </div>
          );
          break;

        case "divider":
          groupedBlocks.push(
            <div key={block.id}>
              <hr />
            </div>
          );
          break;

        case "video":
          groupedBlocks.push(
            <div key={block.id} className="notion-video">
              {block.video.type === "external" ? (
                <span className="flex justify-center items-center m-4">
                  <iframe
                    width="560"
                    height="315"
                    src={convertToEmbedUrl(block.video.external.url)}
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </span>
              ) : block.video.type === "file" ? (
                <span className="flex justify-center items-center">
                  <iframe
                    width="560"
                    height="315"
                    src={convertToEmbedUrl(block.video.file.url)}
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                  Your browser does not support the video tag.
                </span>
              ) : null}
            </div>
          );
          break;

        default:
          groupedBlocks.push(
            <div key={block.id}>
              <p>Unsupported block type: {block.type}</p>
            </div>
          );
      }
    }
  });

  if (listType) {
    groupedBlocks.push(
      listType === "ul" ? <ul>{currentList}</ul> : <ol>{currentList}</ol>
    );
  }

  return { groupedBlocks };
}
