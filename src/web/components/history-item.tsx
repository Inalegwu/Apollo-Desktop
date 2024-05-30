import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import { Laptop, Trash2 } from "lucide-react";

export default function HistoryItem() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Flex
          className="border-b-1 border-b-solid border-b-zinc-200 cursor-pointer w-full py-4 px-3"
          align="center"
          justify="between"
        >
          <Flex direction="column" align="start" justify="center">
            <Text size="2" weight="bold">
              full-device-name
            </Text>
            <Text size="1" className="text-zinc-400">
              date-goes-here
            </Text>
          </Flex>
          <Flex align="center" justify="end">
            <Laptop size={13} className="text-green-500" />
          </Flex>
        </Flex>
      </ContextMenu.Trigger>
      <ContextMenu.Content size="1" variant="soft">
        <ContextMenu.Item className="cursor-pointer">
          <Flex align="center" justify="start" gap="1">
            <Trash2 size={10} />
            <Text>Delete from history</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
