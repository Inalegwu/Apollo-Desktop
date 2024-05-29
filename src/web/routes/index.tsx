import { useMount } from "@legendapp/state/react";
import { Box, ContextMenu, Flex, Popover, Text } from "@radix-ui/themes";
import defaultImage from "@src/assets/images/user_default.jpg";
import t from "@src/shared/config";
import { createFileRoute } from "@tanstack/react-router";
import { Info, Lock, RefreshCw } from "lucide-react";
import { fileTransferState$, globalState$ } from "../state";

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
            <Popover.Root>
              <Popover.Trigger>
                <Box className="w-11 h-11 relative rounded-full overflow-hidden shadow-md cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800">
                  <img
                    src={defaultImage}
                    alt="default_image"
                    className="object-cover w-full h-full"
                  />
                </Box>
              </Popover.Trigger>
              <Popover.Content size="1">
                <Flex direction="column" align="start" className="space-y-1.4">
                  <Flex align="center" justify="start" gap="1">
                    <Info size={10} className="text-zinc-400" />
                    <Text size="1" color="gray">
                      Info
                    </Text>
                  </Flex>
                  <Flex direction="column" align="start" className="space-y-1">
                    <Text size="1">
                      Selected Files: {fileTransferState$.files.get().length}
                    </Text>
                    <Text size="1">Device name : {deviceName}</Text>
                    <Text size="1">
                      Connection status :{" "}
                      <span className="text-red-500">Not Connected</span>
                    </Text>
                  </Flex>
                </Flex>
              </Popover.Content>
            </Popover.Root>
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
