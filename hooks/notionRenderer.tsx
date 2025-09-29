/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export function renderNotionText(richText: any[]) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return richText.map((rt, i) => {
    // Use href if available
    const link = rt.href || rt.plain_text.match(urlRegex)?.[0];

    if (link) {
      if (rt.plain_text.includes(link)) {
        const parts = rt.plain_text.split(link);
        return (
          <React.Fragment key={i}>
            {parts[0]}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {link}
            </a>
            {parts[1]}
          </React.Fragment>
        );
      }

      return (
        <a
          key={i}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {rt.plain_text}
        </a>
      );
    }

    return (
      <span
        key={i}
        style={{
          fontWeight: rt.annotations?.bold ? "bold" : undefined,
          fontStyle: rt.annotations?.italic ? "italic" : undefined,
          textDecoration: rt.annotations?.underline
            ? "underline"
            : rt.annotations?.strikethrough
            ? "line-through"
            : undefined,
          color:
            rt.annotations?.color !== "default"
              ? rt.annotations.color
              : undefined,
        }}
      >
        {rt.plain_text}
      </span>
    );
  });
}
