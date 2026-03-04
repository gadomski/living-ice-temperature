import {
  CloseButton,
  DataList,
  Dialog,
  HStack,
  Link,
  Portal,
} from "@chakra-ui/react";
import type { BoreholeFeature } from "./Borehole";
import DepthChart from "./DepthChart";

interface BoreholeDialogProps {
  borehole: BoreholeFeature | null;
  onClose: () => void;
}

export default function BoreholeDialog({
  borehole,
  onClose,
}: BoreholeDialogProps) {
  const p = borehole?.properties;

  return (
    <Dialog.Root
      open={borehole !== null}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size={"lg"}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{p?.name}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <DataList.Root orientation={"horizontal"}>
                <DataList.Item>
                  <DataList.ItemLabel>Location</DataList.ItemLabel>
                  <DataList.ItemValue>{p?.location}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>Region</DataList.ItemLabel>
                  <DataList.ItemValue>{p?.region}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>Years</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {p?.start_year}–{p?.end_year}
                  </DataList.ItemValue>
                </DataList.Item>
                {p?.ice_thickness && (
                  <DataList.Item>
                    <DataList.ItemLabel>Ice thickness</DataList.ItemLabel>
                    <DataList.ItemValue>{p.ice_thickness} m</DataList.ItemValue>
                  </DataList.Item>
                )}
                {p?.drilled_depth && (
                  <DataList.Item>
                    <DataList.ItemLabel>Drilled depth</DataList.ItemLabel>
                    <DataList.ItemValue>{p.drilled_depth}</DataList.ItemValue>
                  </DataList.Item>
                )}
                <DataList.Item>
                  <DataList.ItemLabel>Original publication</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Link href={p?.original_publication} target="_blank">
                      {p?.original_publication}
                    </Link>
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>
              <HStack flexWrap="wrap" gap={4} mt={4}>
                {p?.temperature_path && (
                  <DepthChart
                    path={p.temperature_path}
                    title="Temperature"
                  />
                )}
                {p?.grain_size_path && (
                  <DepthChart
                    path={p.grain_size_path}
                    title="Grain Size"
                  />
                )}
                {p?.imp_path && (
                  <DepthChart path={p.imp_path} title="Impurity" />
                )}
              </HStack>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size={"sm"} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
