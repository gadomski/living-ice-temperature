import { GridItem, SimpleGrid } from "@chakra-ui/react";
import AntarcticMap from "./AntarcticMap";
import Sidebar from "./Sidebar";

export default function App() {
  return (
    <SimpleGrid h="100vh" w="100vw" columns={3}>
      <GridItem colSpan={1} p={4}>
        <Sidebar />
      </GridItem>
      <GridItem colSpan={2}>
        <AntarcticMap />
      </GridItem>
    </SimpleGrid>
  );
}
