import { Flex } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/history")({
  component: History,
});

function History() {
  return <Flex className="w-full h-full">history</Flex>;
}
