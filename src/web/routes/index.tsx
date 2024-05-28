import { Flex } from "@radix-ui/themes";
import t from "@src/shared/config";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  t.node.listenOnNode.useSubscription(undefined, {
    onStarted: () => {},
    onData: (d) => {},
  });

  return (
    <Flex grow="1" direction="column" gap="4" p="2">
      content
    </Flex>
  );
}
