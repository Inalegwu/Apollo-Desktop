import { useMount, useObservable } from "@legendapp/state/react";
import { Box, Flex, Popover, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { generateAppId, generateRandomName } from "@src/shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Info, Laptop, Phone, Wifi, WifiOff } from "lucide-react";
import { useCallback } from "react";
import defaultImage from "../../assets/images/user_default.jpg";
import { HomeView } from "../components";
import { fileTransferState$, globalState$ } from "../state";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const deviceName = globalState$.deviceName.get();
  const deviceID = globalState$.applicationId.get();

  const { mutate: startServer } = t.node.startNode.useMutation();

  const onlineStatus = useObservable(navigator.onLine);

  const changeDeviceName = useCallback(() => {
    const newName = generateRandomName();

    globalState$.deviceName.set(newName);
  }, []);

  const changeKeyChainId = useCallback(() => {
    const newId = generateAppId();

    globalState$.applicationId.set(newId);
  }, []);

  useMount(() => {
    startServer();

    if (globalState$.firstLaunch.get()) {
      globalState$.applicationId.set(generateAppId());
      globalState$.deviceName.set(generateRandomName());
      globalState$.firstLaunch.set(false);
    }
  });

  return (
    <HomeView>
      <Flex grow="1" className="items-center justify-center" id="workspace">
        <Popover.Root>
          <Popover.Trigger>
            <Box className="w-11 h-11 rounded-full overflow-hidden shadow-xl cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800">
              <img
                src={defaultImage}
                // TODO avatars
                // src="https://source.boringavatars.com/"
                alt="default_image"
                className="object-cover w-full h-full"
              />
            </Box>
          </Popover.Trigger>
          <Popover.Content size="1">
            <Flex direction="column" align="start" className="space-y-1.4">
              <Flex align="center" justify="start" gap="1">
                <Info size={10} />
                <Text size="1">Info</Text>
              </Flex>
              <Flex direction="column" align="start" className="space-y-1">
                <Text size="1">
                  {fileTransferState$.files.get().length} selected files
                </Text>
                <Flex width="100%" align="center" justify="between">
                  <Text size="1">{deviceName.slice(0)}</Text>
                </Flex>
                <Flex width="100%" align="center" justify="between">
                  <Text size="1">Keychain ID : {deviceID.slice(0, 23)}...</Text>
                  {globalState$.deviceType.get() === "desktop" ? (
                    <Laptop size={9} className="text-zinc-400" />
                  ) : (
                    <Phone size={9} className="text-zinc-400" />
                  )}
                </Flex>
                <Flex width="100%" align="center" justify="between">
                  <Text size="1">
                    Online status :{" "}
                    <span
                      className={`${
                        onlineStatus.get() ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {onlineStatus.get() ? "Online" : "Offline"}
                    </span>
                  </Text>
                  {onlineStatus.get() ? (
                    <Wifi size={9} className="text-zinc-400" />
                  ) : (
                    <WifiOff size={9} className="text-zinc-400" />
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </HomeView>
  );
}
