import { Flex, Text } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <Flex className="w-full h-full py-12 px-3">
      <Text size="6">Settings</Text>
    </Flex>
  );
}
