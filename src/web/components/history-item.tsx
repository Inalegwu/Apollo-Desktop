import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import { Trash2 } from "lucide-react";

export default function HistoryItem() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Text>Trigger</Text>
      </ContextMenu.Trigger>
      <ContextMenu.Content size="1" variant="soft">
        <ContextMenu.Item>
          <Flex align="center" justify="start" gap="1">
            <Trash2 size={9} />
            <Text>Delete from history</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
