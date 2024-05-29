import { useMount } from "@legendapp/state/react";
import { Box, ContextMenu, Flex, Text, Tooltip } from "@radix-ui/themes";
import defaultImage from "@src/assets/images/user_default.jpg";
import t from "@src/shared/config";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, RefreshCw } from "lucide-react";
import { globalState$ } from "../state";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const deviceName = globalState$.deviceName.get();

  const { mutate: startServer } = t.node.startNode.useMutation();

  useMount(() => startServer());

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Flex grow="1" className="items-center justify-center">
          <Flex direction="column" align="center" className="space-y-2">
            <Tooltip content={deviceName}>
              <Box className="w-11 h-11 rounded-full overflow-hidden shadow-md cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800">
                <img
                  src={defaultImage}
                  alt="default_image"
                  className="object-cover w-full h-full"
                />
              </Box>
            </Tooltip>
          </Flex>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content size="1" variant="soft">
        <ContextMenu.Item className="cursor-pointer">
          <Flex align="center" justify="start" gap="1">
            <RefreshCw size={10} />
            <Text size="1">Change Device Name</Text>
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item className="cursor-pointer">
          <Flex align="center" justify="start" gap="1">
            <Lock size={10} />
            <Text size="1">Change Keychain ID</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
