/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import MainPageClient from "../_components/MainPageClient";
import { Element } from "react-scroll";
import { MyPieChart } from "../_components/MyPieChart";
import MyBarChart from "../_components/MyBarChart";
import { renderNotionText } from "@/hooks/notionRenderer";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Check if the block is a valid BlockObjectResponse
const isBlockObjectResponse = (
  block: ListBlockChildrenResponse["results"][number]
): block is BlockObjectResponse => {
  return "id" in block && "type" in block;
};

// Fetch mapping function
const fetchMapping = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  let allResults: { customName: string; pageId: string }[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    try {
      const response: any = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor || undefined,
      });

      // Process the results of this batch
      const mapping = response.results
        .map((page: any) => {
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
          return null; // Return null for invalid pages
        })
        .filter(
          (item: any): item is { customName: string; pageId: string } =>
            item !== null
        );

      // Add the current batch to the results array
      allResults = [...allResults, ...mapping];

      // Update the cursor and check for more pages
      startCursor = response.next_cursor || undefined;
      hasMore = response.has_more;
    } catch (error) {
      console.error("Error fetching data:", error);
      break; // Break the loop if there's an error
    }
  }

  return allResults;
};

// Function to fetch paginated blocks
const fetchPaginatedBlocks = async (blockId: string, startCursor?: string) => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    start_cursor: startCursor,
  });
  return response;
};

// Function to render blocks
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

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
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
        <li key={`${block.id}-${i}`}>
          {renderNotionText(listItem.rich_text)}
          {children && <ul>{children}</ul>}
        </li>
      );
      continue;
    }

    if (listType) {
      groupedBlocks.push(
        listType === "ul" ? (
          <ul
            key={`${block.id}-ul`}
            className="list-disc ml-4 p-0 [&_ul]:ml-2 [&_ul]:p-0 [&_ol]:ml-2 [&_ol]:p-0"
          >
            {currentList}
          </ul>
        ) : (
          <ol
            key={`${block.id}-ol`}
            className="list-decimal ml-4 p-0 [&_ul]:ml-2 [&_ul]:p-0 [&_ol]:ml-2 [&_ol]:p-0"
          >
            {currentList}
          </ol>
        )
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

      case "heading_3":
        groupedBlocks.push(
          <h3 key={block.id} className="text-2xl font-semibold mt-6 mb-3">
            {block.heading_3.rich_text.map((text) => text.plain_text)}
          </h3>
        );
        break;

      case "paragraph": {
        const paragraphText = block.paragraph.rich_text
          .map((text) => text.plain_text)
          .join("");

        if (paragraphText.includes("[INLINE_PIE_CHART]")) {
          const titleBlock = blocks[i + 1];
          const tableBlock = blocks[i + 2];

          // Default title fallback
          let chartTitle = "Pie Chart";

          // Safely extract chart title from paragraph block
          if (
            titleBlock &&
            "type" in titleBlock &&
            titleBlock.type === "paragraph"
          ) {
            chartTitle = titleBlock.paragraph.rich_text
              .map((text) => text.plain_text)
              .join("");
          }

          if (
            tableBlock &&
            "type" in tableBlock &&
            tableBlock.type === "table"
          ) {
            const tableRowsResponse = await notion.blocks.children.list({
              block_id: tableBlock.id,
            });

            const chartData = tableRowsResponse.results
              .filter((row) => "type" in row && row.type === "table_row")
              .map((row) => {
                const cells = row.table_row.cells;
                const label = cells[0]?.[0]?.plain_text || "";
                const value = parseFloat(cells[1]?.[0]?.plain_text || "0");
                return { label, value };
              });

            groupedBlocks.push(
              <div className="flex flex-wrap gap-4 mt-4 mb-4">
                <MyPieChart
                  key={tableBlock.id}
                  title={chartTitle}
                  data={chartData}
                />
                <MyPieChart
                  key={tableBlock.id}
                  title={chartTitle}
                  data={chartData}
                />
              </div>
            );

            i += 2;
            break;
          }
        } else if (paragraphText.includes("[INLINE_BAR_GRAPH]")) {
          const titleBlock = blocks[i + 1];
          const tableBlock = blocks[i + 2];

          let chartTitle = "Bar Chart";

          if (
            titleBlock &&
            "type" in titleBlock &&
            titleBlock.type === "paragraph"
          ) {
            chartTitle = titleBlock.paragraph.rich_text
              .map((text) => text.plain_text)
              .join("");
          }

          if (
            tableBlock &&
            "type" in tableBlock &&
            tableBlock.type === "table"
          ) {
            const tableRowsResponse = await notion.blocks.children.list({
              block_id: tableBlock.id,
            });

            const tableRows = tableRowsResponse.results.filter(
              (row) => "type" in row && row.type === "table_row"
            );

            if (tableRows.length > 1) {
              const headerCells = tableRows[0].table_row.cells;
              const headers = headerCells.map(
                (cell) => cell[0]?.plain_text.trim() || ""
              );
              const chartData = tableRows.slice(1).map((row) => {
                const cells = row.table_row.cells;
                const rowData: Record<string, string | number> = {};

                headers.forEach((header, index) => {
                  const key = header.toLowerCase();
                  if (index === 0) {
                    rowData[key] = cells[index]?.[0]?.plain_text || "";
                  } else {
                    // Numeric values
                    rowData[key] = parseFloat(
                      cells[index]?.[0]?.plain_text || "0"
                    );
                  }
                });

                return rowData;
              });

              groupedBlocks.push(
                <div className="flex flex-wrap gap-4 mt-4 mb-4">
                  <MyBarChart
                    key={tableBlock.id}
                    title={chartTitle}
                    data={chartData}
                    keys={headers.slice(1).map((h) => h.toLowerCase())} // dynamic keys
                  />
                  {/* hello */}
                </div>
              );
            }

            i += 2;
            break;
          }
        }

        groupedBlocks.push(
          <p key={block.id} className="my-2">
            {renderNotionText(block.paragraph.rich_text)}
          </p>
        );
        break;
      }

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

// MainPage component with pagination
export default async function MainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const mapping = await fetchMapping();
  const { id } = await params;
  const entry = mapping.find((m) => m.customName === id);

  if (!entry) return <div>Page not found</div>;

  const blocks = await fetchPaginatedBlocks(entry.pageId);
  let allBlocks: ListBlockChildrenResponse["results"] = blocks.results;

  // If there are more blocks, fetch additional pages
  let startCursor = blocks.next_cursor;
  while (startCursor) {
    const moreBlocks = await fetchPaginatedBlocks(entry.pageId, startCursor);
    allBlocks = [...allBlocks, ...moreBlocks.results];
    startCursor = moreBlocks.next_cursor;
  }

  // Filter and map heading 2 blocks
  const heading2Info = allBlocks
    .filter(
      (block: ListBlockChildrenResponse["results"][number]) =>
        isBlockObjectResponse(block) && block.type === "heading_2"
    )
    .map((block) => {
      const headingText = block.heading_2.rich_text
        .map((text) => text.plain_text)
        .join(""); // Concatenate all the text parts
      return { id: block?.id, name: headingText || "" };
    });

  const groupedBlocks = await renderBlocks(allBlocks);

  async function getDomainDetails(domainName: string) {
    try {
      const res = await fetch(
        `https://kt.ignitte.org/api/domain?domain=${domainName}`
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

  const domainData = await getDomainDetails(id);
  // console.log(heading2Info);
  return (
    <MainPageClient
      groupedBlocks={groupedBlocks}
      careerName={id}
      domainData={domainData}
      headingInfo={heading2Info} // Pass heading2Info as a prop
    />
  );
}
