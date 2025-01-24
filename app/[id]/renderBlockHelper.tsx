/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// renderBlocksHelper.ts
import { Client } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const convertToEmbedUrl = (originalUrl: any) => {
  const url = new URL(originalUrl);
  const videoId = url.searchParams.get("v"); // Extract the "v" parameter

  if (!videoId) {
    throw new Error("Invalid YouTube URL or VIDEO_ID not found.");
  }

  return `https://www.youtube.com/embed/${videoId}`;
};
export const renderBlocks = (
  blocks: ListBlockChildrenResponse["results"] | null,
  toc: {
    title: string;
    url: string;
    items: { title: string; url: string }[];
  }[] = []
) => {
  const groupedBlocks: JSX.Element[] = [];
  let currentList: JSX.Element[] = [];
  let listType: "ul" | "ol" | null = null;
  let currentH2: {
    title: string;
    url: string;
    items: { title: string; url: string }[];
  } | null = null;

  const renderNestedBlocks = async (block: any) => {
    if (block.has_children) {
      const childBlocks = await notion.blocks.children.list({
        block_id: block.id,
      });
      const { groupedBlocks, toc } = renderBlocks(childBlocks.results);
      return groupedBlocks;
    }
    return null;
  };

  blocks?.forEach((block, index) => {
    if (!("type" in block)) {
      return;
    }

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
          if (currentH2) toc.push(currentH2);
          currentH2 = {
            title: block.heading_2.rich_text
              .map((text) => text.plain_text)
              .join(""),
            url: block.id,
            items: [],
          };
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
          if (currentH2) {
            currentH2.items.push({
              title: block.heading_3.rich_text
                .map((text) => text.plain_text)
                .join(""),
              url: block.id,
            });
          }

          groupedBlocks.push(
            <h3
              id={block.id}
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
                <img src={block.image.external.url} alt="Notion Image" />
              ) : block.image.type === "file" ? (
                <img src={block.image.file.url} alt="Notion Image" />
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
                <span className="flex justify-center items-center">
                  <iframe
                    width="560"
                    height="315"
                    src={convertToEmbedUrl(block.video.external.url)}
                    title="YouTube video player"
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
                    title="YouTube video player"
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

  if (currentH2) toc.push(currentH2);

  return { groupedBlocks, toc };
};
