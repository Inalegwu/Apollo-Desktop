import { computed } from "@legendapp/state";
import { Avatar, Button, Flex, Popover, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import type { Node } from "@src/shared/types";
import { randomNumber } from "@src/shared/utils";
import { Heart, Key, UserRound, Wifi, WifiOff } from "lucide-react";
import { useCallback, useMemo } from "react";
import { fileTransferState$, globalState$ } from "../../shared/state";

type Props = {
  node: Node;
};

export default function DeviceInfo({ node }: Props) {
  const { mutate: sendFiles } = t.node.sendFile.useMutation();
  const favDevices = globalState$.favouriteDevices.get();

  const top = useMemo(() => randomNumber(), []);
  const left = useMemo(() => randomNumber(), []);

  const isSaved = globalState$.favouriteDevices.has(node);
  const isOnline = computed(() => navigator.onLine);

  const send = useCallback(() => {
    sendFiles({
      destination: node.connectionId,
      filePaths: fileTransferState$.files.get(),
    });
  }, [sendFiles, node]);

  const addToFavourites = useCallback(() => {
    if (isSaved) {
      favDevices.delete(node);
    } else {
      favDevices.add(node);
    }
  }, [node, isSaved, favDevices]);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Avatar
          asChild
          src="https://source.boringavatars.com/"
          variant="soft"
          fallback={<UserRound size={15} />}
          style={{
            left: `${left}px`,
            top: `${top}px`,
          }}
          className="absolute shadow-xl w-11 h-11 rounded-full cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800"
        />
      </Popover.Trigger>
      <Popover.Content size="1">
        <Flex direction="column" className="space-y-2">
          <Flex align="center" justify="between" gap="3">
            <Flex
              direction="column"
              align="start"
              width="100%"
              justify="between"
            >
              <Text className="text-[11.5px] text-zinc-400 tracking-wide">
                Device Name
              </Text>
              <Text className="text-[12px] font-bold">{node.nodeName}</Text>
            </Flex>
            <Flex align="center" justify="end" gap="3">
              <Button
                variant="soft"
                onClick={addToFavourites}
                className="w-7 h-7 rounded-full cursor-pointer transition outline-none"
                color={isSaved ? "ruby" : "gray"}
                size="1"
                radius="full"
              >
                <Heart size={10} />
              </Button>
            </Flex>
          </Flex>
          <Flex className="space-y-1" direction="column" align="start">
            <Flex width="100%" align="center" justify="between" gap="3">
              <Text className="text-[11px] font-medium">
                {node.connectionId}
              </Text>
              <Key size={9} className="text-zinc-400" />
            </Flex>
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text className="text-[11px] font-medium">
                This device is{" "}
                <span
                  className={`${
                    isOnline.get() ? "text-green-500" : "text-red-500"
                  } font-medium`}
                >
                  {isOnline.get() ? "Online" : "Offline"}
                </span>
              </Text>
              {isOnline.get() ? (
                <Wifi size={9} className="text-zinc-400" />
              ) : (
                <WifiOff size={9} className="text-zinc-400" />
              )}
            </Flex>
          </Flex>
          {fileTransferState$.files.get().length > 0 && (
            <Button
              onClick={send}
              variant="soft"
              className="cursor-pointer"
              size="2"
            >
              <Flex align="center" justify="center" gap="5">
                <Text className="text-[11px] font-medium">Send</Text>
              </Flex>
            </Button>
          )}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
