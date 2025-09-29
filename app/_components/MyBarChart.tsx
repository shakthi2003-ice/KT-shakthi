"use client";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type ChartData = Record<string, string | number>;

interface MyBarChartProps {
  title: string;
  data: ChartData[];
  keys: string[];
}

export default function MyBarChart({ title, data, keys }: MyBarChartProps) {
  const colors = ["#082a54", "#e02b35", "#f0c571"];

  // build chartConfig with matching colors
  const chartConfig = keys.reduce((acc, key, idx) => {
    acc[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[idx % colors.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} width={500} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={Object.keys(data[0])[0]} // assumes first key is x-axis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {keys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={colors[idx % colors.length]}
                barSize={100}
                radius={idx === keys.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
