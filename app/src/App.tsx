import { useEffect, useState } from "react";
import { GridItem, SimpleGrid } from "@chakra-ui/react";
import AntarcticMap from "./AntarcticMap";
import Sidebar from "./Sidebar";
import type { BoreholeCollection, BoreholeFeature } from "./Borehole";

export default function App() {
  const [boreholes, setBoreholes] = useState<BoreholeFeature[]>([]);

  useEffect(() => {
    fetch("/boreholes.json")
      .then((res) => res.json())
      .then((data: BoreholeCollection) => setBoreholes(data.features));
  }, []);

  return (
    <SimpleGrid h="100vh" w="100vw" columns={3}>
      <GridItem colSpan={1} p={4} boxShadow="4px 0 6px -2px rgba(0, 0, 0, 0.1)">
        <Sidebar boreholes={boreholes} />
      </GridItem>
      <GridItem colSpan={2}>
        <AntarcticMap boreholes={boreholes} />
      </GridItem>
    </SimpleGrid>
  );
}
