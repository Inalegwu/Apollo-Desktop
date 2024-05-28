import { Flex, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recieve")({
  component: Recieve,
});

function Recieve() {
  return (
    <Flex className="w-full h-full">
      <Text>Recieve screen</Text>
    </Flex>
  );
}
