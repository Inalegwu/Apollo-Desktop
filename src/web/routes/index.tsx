import { Box, Flex, Tooltip } from "@radix-ui/themes";
import defaultImage from "@src/assets/images/user_default.jpg";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Flex grow="1" className="items-center justify-center">
      <Flex direction="column" align="center" className="space-y-2">
        <Tooltip content="You">
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
  );
}
