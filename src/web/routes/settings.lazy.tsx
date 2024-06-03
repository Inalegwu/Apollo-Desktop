import { computed } from "@legendapp/state";
import { Flex, Heading, Switch, Text } from "@radix-ui/themes";
import { globalState$ } from "@shared/state";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const isDarkMode = computed(() => globalState$.colorMode.get() === "dark");

  console.log(isDarkMode.get());

  const toggleColorMode = useCallback(() => {
    if (globalState$.colorMode.get() === "dark") {
      globalState$.colorMode.set("light");
      document.body.classList.remove("dark");
    } else {
      globalState$.colorMode.set("dark");
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <Flex direction="column" className="w-full h-full py-12 px-3" gap="5">
      <Heading size="7">Settings</Heading>
      <Flex direction="column" gap="4" align="start" width="100%">
        <Text weight="bold" size="2" color="gray">
          Apperance
        </Text>
        <Flex align="center" justify="between" width="100%">
          <Flex direction="column" align="start">
            <Text weight="bold" size="2">
              Dark Mode
            </Text>
            <Text size="1" color="gray">
              Light or Dark mode, your choice, we don't judge
            </Text>
          </Flex>
          <Switch onClick={toggleColorMode} checked={isDarkMode.get()} />
        </Flex>
      </Flex>
      {/* network settings */}
      {/* <Flex direction="column" gap="4" align="start" width="100%">
        <Text weight="bold" size="2" color="gray">
          Network
        </Text>
        <Flex align="center" justify="between" width="100%">
          <Flex direction="column" align="start">
            <Text weight="bold" size="2">
              Port
            </Text>
            <Text size="1" color="gray">
              What port should this device listen too
            </Text>
          </Flex>
          <TextField.Root size="2" className="w-1/6">
            <TextField.Slot>
              <Search size={12} className="text-zinc-400" />
            </TextField.Slot>
            <TextField.Input value={42069} />
          </TextField.Root>
        </Flex>
      </Flex> */}
    </Flex>
  );
}
