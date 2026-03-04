import { CloseButton, Dialog, Link, Portal, Text } from "@chakra-ui/react";

export default function AboutDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Link variant="underline" cursor="pointer">
          About
        </Link>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>About Living Ice Temperature</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text mb={4}>
                Living Ice Temperature is an interactive tool for exploring
                borehole temperature profiles from ice sheets and glaciers
                across Antarctica. It brings together measurements from
                published scientific studies into a single, accessible
                interface.
              </Text>
              <Text mb={4}>
                This project was built by{" "}
                <Link
                  href="https://developmentseed.org"
                  target="_blank"
                  variant="underline"
                >
                  Development Seed
                </Link>{" "}
                in collaboration with researchers studying ice sheet dynamics.
                The data presented here is drawn from peer-reviewed publications
                and publicly available datasets.
              </Text>
              <Text>
                The source code is available on{" "}
                <Link
                  href="https://github.com/developmentseed/living-ice-temperature"
                  target="_blank"
                  variant="underline"
                >
                  GitHub
                </Link>
                .
              </Text>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
