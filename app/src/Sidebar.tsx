import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import type { BoreholeFeature } from "./Borehole";

interface SidebarProps {
  boreholes: BoreholeFeature[];
}

export default function Sidebar({ boreholes }: SidebarProps) {
  return (
    <Stack h="100%" gap={4}>
      <Heading>Living Ice Temperature</Heading>
      <Stack overflowY="auto" gap={3}>
        {boreholes.map((feature) => (
          <Box
            key={feature.properties.name}
            p={3}
            borderWidth="1px"
            borderRadius="md"
          >
            <Text fontWeight="bold">{feature.properties.name}</Text>
            <Text fontSize="sm" color="gray.600">
              {feature.properties.location}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {feature.properties.region} &middot;{" "}
              {feature.properties.start_year === feature.properties.end_year
                ? feature.properties.start_year
                : `${feature.properties.start_year}–${feature.properties.end_year}`}
            </Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
