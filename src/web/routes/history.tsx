import { Button, Flex, Text, Tooltip } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { Trash } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: History,
});

function History() {
  return (
    <Flex direction="column" className="w-full h-full py-12 px-3">
      <Flex className="w-full" align="center" justify="between">
        <Text weight="bold" size="7">
          Share History
        </Text>
      </Flex>
      <Flex direction="column" className="py-5" align="start" grow="1">
        body
      </Flex>
      <Tooltip content="Clear share history">
        <Button
          color="tomato"
          variant="soft"
          className="cursor-pointer absolute bottom-3.5 left-3 w-9 h-9 rounded-full"
        >
          <Trash size={12} />
        </Button>
      </Tooltip>
    </Flex>
  );
}
