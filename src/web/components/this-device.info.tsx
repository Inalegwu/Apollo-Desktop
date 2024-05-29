import { useObservable } from "@legendapp/state/react";
import { Box, Flex, Popover, Text } from "@radix-ui/themes";
import { Info, Laptop, Phone, Wifi, WifiOff } from "lucide-react";
import defaultImage from "../../assets/images/user_default.jpg";
import { fileTransferState$, globalState$ } from "../state";

export function ThisDeviceInfo() {
  const deviceName = globalState$.deviceName.get();
  const deviceID = globalState$.applicationId.get();

  const onlineStatus = useObservable(navigator.onLine);

  return (
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
        <Flex direction="column" align="start" className="space-y-2">
          <Flex align="center" justify="start" gap="1">
            <Info size={10} />
            <Text size="1">Info</Text>
          </Flex>
          <Flex direction="column" align="start" className="space-y-1">
            <Text size="1">
              {fileTransferState$.files.get().length} selected files
            </Text>
            <Flex width="100%" align="center" justify="between">
              <Text size="1">{deviceName?.slice(0)}</Text>
            </Flex>
            <Flex width="100%" align="center" justify="between">
              <Text size="1">Keychain ID : {deviceID?.slice(0, 23)}...</Text>
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
  );
}
