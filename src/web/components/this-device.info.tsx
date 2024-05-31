import { useObservable } from "@legendapp/state/react";
import { Box, Flex, Popover, Text } from "@radix-ui/themes";
import { Folder, Info, Key, Laptop, Phone, Wifi, WifiOff } from "lucide-react";
import defaultImage from "../../assets/images/user_default.jpg";
import { fileTransferState$, globalState$ } from "../../shared/state";

export default function ThisDeviceInfo() {
  const deviceName = globalState$.deviceName.get();
  const deviceID = globalState$.applicationId.get();

  const onlineStatus = useObservable(navigator.onLine);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Box className="w-11 h-11 rounded-full overflow-hidden shadow-xl cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800">
          <img
            src={defaultImage}
            alt="default_image"
            className="object-cover w-full h-full"
          />
        </Box>
      </Popover.Trigger>
      <Popover.Content size="1">
        <Flex direction="column" align="start" className="space-y-2">
          <Flex align="center" width="100%" justify="between" gap="2">
            <Text size="1" className="font-bold">
              This Device
            </Text>
            <Info size={10} className="text-zinc-400" />
          </Flex>
          <Flex direction="column" align="start" className="space-y-1">
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text size="1" className="font-bold">
                {fileTransferState$.files.get().length} selected files
              </Text>
              <Folder size={10} className="text-zinc-400" />
            </Flex>
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text size="1" className="font-bold">
                {deviceName?.slice(0)}
              </Text>
              {globalState$.deviceType.get() === "desktop" ? (
                <Laptop size={9} className="text-zinc-400" />
              ) : (
                <Phone size={9} className="text-zinc-400" />
              )}
            </Flex>
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text size="1" className="font-bold">
                {deviceID?.slice(0, deviceID.length)}
              </Text>
              <Key size={10} className="text-zinc-400" />
            </Flex>
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text size="1" className="font-bold">
                You are{" "}
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
