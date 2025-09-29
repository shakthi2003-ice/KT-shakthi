/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ChartDataItem = {
  label: string;
  value: number;
  fill?: string;
};

type Props = {
  data: ChartDataItem[];
  title: string;
};

const colors = ["#082a54", "#e02b35", "#f0c571"];

export function MyPieChart({ data, title }: Props) {
  const id = "pie-interactive";
  const enrichedData = React.useMemo(
    () =>
      data.map((item, idx) => ({
        ...item,
        fill: colors[idx % colors.length],
      })),
    [data]
  );

  const chartConfig: ChartConfig = {
    value: { label: "Value" },
    ...Object.fromEntries(
      enrichedData.map((d) => [
        d.label.toLowerCase(),
        { label: d.label, color: d.fill },
      ])
    ),
  };

  const [activeLabel, setActiveLabel] = React.useState(enrichedData[0].label);

  const activeIndex = React.useMemo(
    () => enrichedData.findIndex((item) => item.label === activeLabel),
    [activeLabel, enrichedData]
  );

  const labels = React.useMemo(
    () => enrichedData.map((item) => item.label),
    [enrichedData]
  );

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
        </div>

        <Select value={activeLabel} onValueChange={setActiveLabel}>
          <SelectTrigger
            className="ml-auto m-2 h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select slice" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {labels.map((key) => {
              const config = chartConfig[key.toLowerCase()];
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: config?.color,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto w-[280px] h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={enrichedData}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {enrichedData[activeIndex].value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Percentage
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
