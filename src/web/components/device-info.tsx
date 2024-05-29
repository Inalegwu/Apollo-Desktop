import { useObservable } from "@legendapp/state/react";
import { Box, Button, Flex, Popover, Text, Tooltip } from "@radix-ui/themes";
import { Heart, HeartOff, Pen } from "lucide-react";

export default function DeviceInfo() {
  const isSaved = useObservable(true);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Box className="w-11 h-11 absolute top-30 left-40 rounded-full overflow-hidden shadow-xl cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800">
          <img
            // TODO figure CSP FOR THIS...
            src="https://source.boringavatars.com/"
            alt="default_image"
            className="object-cover w-full h-full"
          />
        </Box>
      </Popover.Trigger>
      <Popover.Content size="1" className="max-w-[14rem]">
        <Flex direction="column" className="space-y-2">
          <Flex align="center" justify="end" gap="3">
            <Tooltip content="Edit saved device">
              <Button
                variant="soft"
                className="w-7 h-7 rounded-full cursor-pointer transition outline-none"
                size="1"
                color="gray"
                radius="full"
              >
                <Pen />
              </Button>
            </Tooltip>
            <Tooltip content="Save device">
              <Button
                variant="soft"
                onClick={() => isSaved.set(!isSaved.get())}
                className="w-7 h-7 rounded-full cursor-pointer transition outline-none"
                color={isSaved.get() ? "ruby" : "gray"}
                size="1"
                radius="full"
              >
                {isSaved.get() ? <HeartOff size={11} /> : <Heart size={11} />}
              </Button>
            </Tooltip>
          </Flex>
          <Flex direction="column" align="start">
            <Text size="1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              possimus id recusandae ea illo fuga, odio laudantium cumque
              perspiciatis assumenda nihil est? Dolor maxime, accusamus sequi
              consequuntur autem facere fuga?
            </Text>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
