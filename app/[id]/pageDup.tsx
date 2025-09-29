/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import MainPageClient from "../_components/MainPageClient";
import MainContent from "./MainContent";
import { Element } from "react-scroll";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const fetchMapping = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const response = await notion.databases.query({ database_id: databaseId });

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

const renderBlocks = async (
  blocks: ListBlockChildrenResponse["results"]
): Promise<JSX.Element[]> => {
  const groupedBlocks: JSX.Element[] = [];
  let currentList: JSX.Element[] = [];
  let listType: "ul" | "ol" | null = null;

  const renderNestedBlocks = async (block: any) => {
    if (block.has_children) {
      const childBlocks = await notion.blocks.children.list({
        block_id: block.id,
      });
      return await renderBlocks(childBlocks.results);
    }
    return null;
  };

  for (const block of blocks) {
    if (!("type" in block)) continue;

    // handle lists
    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const isBulleted = block.type === "bulleted_list_item";
      if (!listType || listType !== (isBulleted ? "ul" : "ol")) {
        if (currentList.length) {
          groupedBlocks.push(
            listType === "ul" ? (
              <ul key={block.id}>{currentList}</ul>
            ) : (
              <ol key={block.id}>{currentList}</ol>
            )
          );
          currentList = [];
        }
        listType = isBulleted ? "ul" : "ol";
      }

      const listItem = isBulleted
        ? block.bulleted_list_item
        : block.numbered_list_item;

      const children = block.has_children
        ? await renderNestedBlocks(block)
        : null;

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
          {children && <ul>{children}</ul>}
        </li>
      );
      continue;
    }

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
          <h1 key={block.id} className="text-3xl font-bold mt-8 mb-4">
            {block.heading_1.rich_text.map((text) => text.plain_text)}
          </h1>
        );
        break;
      case "heading_2":
        groupedBlocks.push(
          <h2 key={block.id} className="text-2xl font-semibold mt-6 mb-3">
            {block.heading_2.rich_text.map((text) => text.plain_text)}
          </h2>
        );
        break;
      case "paragraph":
        groupedBlocks.push(
          <p key={block.id} className="my-2">
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
      // case "video":
      //   groupedBlocks.push(
      //     <div key={block.id} className="flex justify-center my-4">
      //       <iframe
      //         width="560"
      //         height="315"
      //         src={convertToEmbedUrl(
      //           block.video.external?.url || block.video.file?.url
      //         )}
      //         title="Embedded Video"
      //         allowFullScreen
      //       />
      //     </div>
      //   );
      //   break;
      case "divider":
        groupedBlocks.push(
          <hr key={block.id} className="my-6 border-t border-gray-300" />
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

  if (listType) {
    groupedBlocks.push(
      listType === "ul" ? <ul>{currentList}</ul> : <ol>{currentList}</ol>
    );
  }

  return groupedBlocks;
};

export default async function MainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const mapping = await fetchMapping();
  const { id } = await params;
  const entry = mapping.find((m) => m.customName === id);
  console.log(id);
  if (!entry) return <div>Page not found</div>;

  const blocks = await notion.blocks.children.list({
    block_id: entry.pageId,
  });
  async function getDomainDetails(domainName: string) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/domain?domain=${domainName}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch domain details");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching domain details:", error);
      return null; // Handle the error case as needed
    }
  }
  const groupedBlocks = await renderBlocks(blocks.results);
  const domainData = await getDomainDetails(id);

  // Type guard to check if a block is a BlockObjectResponse (which has the `type` property)
  function isBlockObjectResponse(block: any): block is BlockObjectResponse {
    return block && "type" in block;
  }

  const heading2Info = blocks.results
    .filter(
      (block: ListBlockChildrenResponse["results"][number]) =>
        isBlockObjectResponse(block) && block.type === "heading_2"
    )
    .map((block) => {
      const headingText = block.heading_2.rich_text
        .map((text) => text.plain_text)
        .join(""); // Concatenate all the text parts
      return { id: block.id, name: headingText };
    });

  return (
    <>
      <MainPageClient
        groupedBlocks={groupedBlocks}
        headingInfo={heading2Info}
        careerName={id}
        domainData={domainData}
      />
      {/* <MainContent groupedBlocks={groupedBlocks} /> */}
    </>
  );
}
