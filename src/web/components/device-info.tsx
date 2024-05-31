import { useObservable } from "@legendapp/state/react";
import { Box, Button, Flex, Popover, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import type { Node } from "@src/shared/types";
import { randomNumber } from "@src/shared/utils";
import { Heart, Key, Laptop, Pen, Phone, Send, Wifi } from "lucide-react";
import { useCallback } from "react";
import { fileTransferState$ } from "../state";

type Props = {
  node: Node;
};

// x axis: 5-180
// y axis: 5-130

const top = randomNumber();
const left = randomNumber();

export default function DeviceInfo({ node }: Props) {
  const isSaved = useObservable(true);

  const { mutate: sendFiles } = t.node.sendFile.useMutation();

  const send = useCallback(() => {
    sendFiles({
      files: fileTransferState$.files.get(),
      destinationId: node.connectionId,
    });
  }, [sendFiles, node]);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Box
          className="w-11 h-11 absolute rounded-full overflow-hidden shadow-xl cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800"
          style={{
            top: `${top}px`,
            left: `${left}px`,
          }}
        >
          <img
            src="https://source.boringavatars.com/"
            alt="default_image"
            className="object-cover w-full h-full"
          />
        </Box>
      </Popover.Trigger>
      <Popover.Content size="1">
        <Flex direction="column" className="space-y-2">
          <Flex align="center" justify="between">
            <Flex align="center" justify="between" gap="2">
              <Text size="1" className="font-bold">
                Info
              </Text>
            </Flex>
            <Flex align="center" justify="end" gap="3">
              {isSaved.get() && (
                <Button
                  variant="soft"
                  className="w-7 h-7 rounded-full cursor-pointer transition outline-none"
                  size="1"
                  color="gray"
                  radius="full"
                >
                  <Pen />
                </Button>
              )}
              <Button
                variant="soft"
                onClick={() => isSaved.set(!isSaved.get())}
                className="w-7 h-7 rounded-full cursor-pointer transition outline-none"
                color={isSaved.get() ? "ruby" : "gray"}
                size="1"
                radius="full"
              >
                <Heart size={11} />
              </Button>
            </Flex>
          </Flex>
          <Flex className="space-y-1" direction="column" align="start">
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text size="1" className="font-bold">
                {node.nodeName?.slice(0)}
              </Text>
              {node.deviceType === "desktop" ? (
                <Laptop size={9} className="text-zinc-400" />
              ) : (
                <Phone size={9} className="text-zinc-400" />
              )}
            </Flex>
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text size="1" className="font-bold">
                {node.connectionId?.slice(0, node.connectionId?.length)}...
              </Text>
              <Key size={9} className="text-zinc-400" />
            </Flex>
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text size="1" className="font-bold">
                This device is <span className="text-green-500">Online</span>
              </Text>
              <Wifi size={9} className="text-zinc-400" />
            </Flex>
          </Flex>
          {fileTransferState$.files.get().length > 0 && (
            <Button
              onClick={send}
              variant="soft"
              className="cursor-pointer"
              size="1"
            >
              <Flex align="center" justify="center" gap="1">
                <Text size="1" className="font-bold">
                  Send
                </Text>
                <Send size={10} />
              </Flex>
            </Button>
          )}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
