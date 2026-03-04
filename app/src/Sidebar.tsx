import { Card, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import type { BoreholeFeature } from "./Borehole";

interface SidebarProps {
  boreholes: BoreholeFeature[];
  hoveredBorehole: string | null;
  onHoverBorehole: (name: string | null) => void;
  onSelectBorehole: (borehole: BoreholeFeature) => void;
}

export default function Sidebar({
  boreholes,
  hoveredBorehole,
  onHoverBorehole,
  onSelectBorehole,
}: SidebarProps) {
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (hoveredBorehole) {
      const el = itemRefs.current.get(hoveredBorehole);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [hoveredBorehole]);

  return (
    <Stack h="100%" gap={4} p={4}>
      <Heading>Living Ice Temperature</Heading>
      <Stack overflowY="auto">
        {boreholes.map((feature) => {
          const name = feature.properties.name;
          const isHovered = hoveredBorehole === name;
          return (
            <Card.Root
              key={name}
              ref={(el: HTMLDivElement | null) => {
                if (el) {
                  itemRefs.current.set(name, el);
                } else {
                  itemRefs.current.delete(name);
                }
              }}
              variant={"outline"}
              mr={4}
              size={"sm"}
              cursor={"pointer"}
              borderColor={isHovered ? "red.400" : undefined}
              bg={isHovered ? "red.50" : undefined}
              onClick={() => onSelectBorehole(feature)}
              onMouseEnter={() => onHoverBorehole(name)}
              onMouseLeave={() => onHoverBorehole(null)}
            >
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Description>
                  {feature.properties.location}
                </Card.Description>
              </Card.Body>
              <Card.Footer fontSize={"sm"}>
                {feature.properties.region} &middot;{" "}
                {feature.properties.start_year === feature.properties.end_year
                  ? feature.properties.start_year
                  : `${feature.properties.start_year}–${feature.properties.end_year}`}
              </Card.Footer>
            </Card.Root>
          );
        })}
      </Stack>
    </Stack>
  );
}
