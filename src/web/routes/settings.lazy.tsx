import { computed } from "@legendapp/state";
import { Box, Flex, Switch, Tabs, Text } from "@radix-ui/themes";
import { globalState$ } from "@src/web/state";
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
    <Flex className="w-full h-full py-12 px-2">
      <Tabs.Root className="w-full flex-1 px-1">
        <Tabs.List defaultValue="appearance" size="2">
          <Tabs.Trigger className="cursor-pointer" value="appearance">
            Appearance
          </Tabs.Trigger>
          <Tabs.Trigger className="cursor-pointer" value="network">
            Network
          </Tabs.Trigger>
        </Tabs.List>
        <Box className="pt-5">
          <Tabs.Content value="appearance">
            <Flex align="center" justify="between">
              <Flex direction="column" align="start">
                <Text size="2">Dark Theme</Text>
                <Text size="1" className="text-zinc-400">
                  Light or dark mode, the choice is yours, we definitely don't
                  judge
                </Text>
              </Flex>
              <Switch
                onClick={toggleColorMode}
                size="2"
                checked={isDarkMode.get()}
              />
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
}
