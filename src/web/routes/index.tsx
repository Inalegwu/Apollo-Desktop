import { Box, Flex, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Flex grow="1" className="items-center justify-center">
      <Flex direction="column" align="center" className="space-y-2">
        <Box className="w-10 h-10 rounded-full shadow-md cursor-pointer border-1 border-solid border-zinc-400 dark:border-zinc-800" />
        <Text size="3" color="gray">
          You
        </Text>
      </Flex>
    </Flex>
  );
}
