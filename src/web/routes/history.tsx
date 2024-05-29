import { Button, Flex, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { Trash } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: History,
});

function History() {
  return (
    <Flex direction="column" className="w-full h-full py-12 px-3">
      <Flex className="w-full" align="center" justify="between">
        <Text weight="bold" size="6">
          Share History
        </Text>
        <Button
          color="tomato"
          variant="soft"
          size="1"
          className="cursor-pointer"
        >
          <Text>Clear Share History</Text>
          <Trash size={11} />
        </Button>
      </Flex>
      <Flex direction="column" className="py-5" align="start" grow="1">
        body
      </Flex>
    </Flex>
  );
}
