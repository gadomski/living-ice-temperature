import { Flex, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AboutDialog from "./AboutDialog";
import AntarcticMap from "./AntarcticMap";
import type { BoreholeCollection, BoreholeFeature } from "./Borehole";
import BoreholeDialog from "./BoreholeDialog";
import Sidebar from "./Sidebar";

export default function App() {
  const [boreholes, setBoreholes] = useState<BoreholeFeature[]>([]);
  const [hoveredBorehole, setHoveredBorehole] = useState<string | null>(null);
  const [selectedBorehole, setSelectedBorehole] =
    useState<BoreholeFeature | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}boreholes.json`)
      .then((res) => res.json())
      .then((data: BoreholeCollection) => setBoreholes(data.features));
  }, []);

  return (
    <Flex direction="column" h="100vh" w="100vw">
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={6}
        py={3}
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
        flexShrink={0}
      >
        <Heading size="lg">Living Ice Temperature</Heading>
        <AboutDialog />
      </Flex>
      <SimpleGrid flex="1" overflow="hidden" columns={3}>
        <GridItem
          colSpan={1}
          boxShadow="4px 0 6px -2px rgba(0, 0, 0, 0.1)"
          overflow={"scroll"}
        >
          <Sidebar
            boreholes={boreholes}
            hoveredBorehole={hoveredBorehole}
            onHoverBorehole={setHoveredBorehole}
            onSelectBorehole={setSelectedBorehole}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <AntarcticMap
            boreholes={boreholes}
            hoveredBorehole={hoveredBorehole}
            onHoverBorehole={setHoveredBorehole}
            onSelectBorehole={setSelectedBorehole}
          />
        </GridItem>
      </SimpleGrid>
      <BoreholeDialog
        borehole={selectedBorehole}
        onClose={() => setSelectedBorehole(null)}
      />
    </Flex>
  );
}
