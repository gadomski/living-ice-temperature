import { Box, Spinner, Text } from "@chakra-ui/react";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface DepthChartProps {
  path: string;
  title: string;
}

interface ParsedData {
  depthLabel: string;
  columns: { label: string; values: number[] }[];
  depths: number[];
}

const MARGIN = { top: 20, right: 20, bottom: 40, left: 60 };
const HEIGHT = 300;
const COL_WIDTH = 200;

function parseCsv(raw: d3.DSVRowArray): ParsedData {
  const depthLabel = raw.columns[0]!;
  const colNames = raw.columns.slice(1);
  const depths: number[] = raw.map((d) => +(d[depthLabel] ?? 0));
  const columns = colNames.map((name) => ({
    label: name,
    values: raw.map((d) => +(d[name] ?? 0)),
  }));
  return { depthLabel, columns, depths };
}

export default function DepthChart({ path, title }: DepthChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(null);
    setError(null);
    d3.csv(`/${path}`)
      .then((rows) => setData(parseCsv(rows)))
      .catch(() => setError("Failed to load data"));
  }, [path]);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { depths, columns, depthLabel } = data;

    const totalWidth = MARGIN.left + COL_WIDTH * columns.length + MARGIN.right;

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(depths) ?? 0, d3.max(depths) ?? 1])
      .range([MARGIN.top, HEIGHT - MARGIN.bottom]);

    svg.attr("width", totalWidth).attr("height", HEIGHT);

    const colors = d3.schemeTableau10;

    columns.forEach((col, i) => {
      const xMin = d3.min(col.values);
      const xMax = d3.max(col.values);
      const x0 = MARGIN.left + i * COL_WIDTH + 10;
      const x1 = MARGIN.left + (i + 1) * COL_WIDTH - 10;
      const xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 1])
        .range([x0, x1]);

      const g = svg.append("g");

      const line = d3
        .line<[number, number]>()
        .x((d) => xScale(d[0]))
        .y((d) => yScale(d[1]));

      const paired: [number, number][] = col.values.map((v, idx) => [
        v,
        depths[idx]!,
      ]);

      g.append("path")
        .datum(paired)
        .attr("fill", "none")
        .attr("stroke", colors[i % colors.length]!)
        .attr("stroke-width", 1.5)
        .attr("d", line as unknown as string);

      const xAxis = d3.axisBottom(xScale).ticks(3);
      g.append("g")
        .attr("transform", `translate(0,${HEIGHT - MARGIN.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("x", (x0 + x1) / 2)
        .attr("y", 30)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .text(col.label);
    });

    const yAxis = d3.axisLeft(yScale);
    svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(MARGIN.top + HEIGHT - MARGIN.bottom) / 2)
      .attr("y", -45)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .text(depthLabel);
  }, [data]);

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!data) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="sm" />
      </Box>
    );
  }

  return (
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={1}>
        {title}
      </Text>
      <Box overflowX="auto">
        <svg ref={svgRef} />
      </Box>
    </Box>
  );
}
