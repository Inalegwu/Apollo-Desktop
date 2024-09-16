import { computed } from "@legendapp/state";
import { Button, Flex, Popover, Text } from "@radix-ui/themes";
import { peerState } from "@src/shared/state";
import { generateGradientColors, randomNumber } from "@src/shared/utils";
import { Heart, Key, Wifi, WifiOff } from "lucide-react";
import { useCallback, useMemo } from "react";
import type { Node } from "@shared/types";

type Props = {
  node: Node;
};

export default function DeviceInfo({ node }: Props) {
  // const { mutate: sendFiles } = t.node.sendFile.useMutation();

  const sendFiles = () => {};

  const top = useMemo(() => randomNumber(), []);
  const left = useMemo(() => randomNumber(), []);
  const [color1, color2] = useMemo(() => generateGradientColors(), []);

  const isSaved = peerState.favourites.has(node.keychainId);

  const isOnline = computed(() => navigator.onLine);

  const send = useCallback(() => {
    sendFiles();
  }, []);

  const addToFavourites = useCallback(() => {
    if (isSaved) {
      peerState.favourites.delete(node.keychainId);
      return;
    }
    peerState.favourites.get().set(node.keychainId, node);
  }, [node, isSaved]);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div
          style={{
            left: `${left}px`,
            top: `${top}px`,
            background: `linear-gradient(45deg,${color1},${color2})`,
          }}
          className="absolute shadow-xl w-11 h-11 rounded-full cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800 dark:shadow-zinc-300/3"
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
              <Text className="text-[11px] text-zinc-400">Device Name</Text>
              <Text className="text-[12px] font-bold">{node.deviceName}</Text>
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
              <Text className="text-[10px] font-medium">{node.keychainId}</Text>
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
          {[].length > 0 && (
            <Button
              onClick={send}
              variant="soft"
              className="cursor-pointer"
              size="2"
            >
              <Flex align="center" justify="start" gap="5">
                <Text className="text-[11px] font-medium">Send</Text>
              </Flex>
            </Button>
          )}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
