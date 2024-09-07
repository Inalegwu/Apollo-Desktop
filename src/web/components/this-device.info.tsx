import { computed } from "@legendapp/state";
import { Box, Flex, Popover, Text } from "@radix-ui/themes";
import { globalState$ } from "@shared/state";
import defaultImage from "@src/assets/images/user_default.jpg";
import { generateRandomName } from "@src/shared/utils";
import { Folder, Key, Laptop, Phone, Wifi, WifiOff } from "lucide-react";
import { useEffect } from "react";
import { v4 } from "uuid";
import t from "@shared/config";

export default function ThisDeviceInfo() {
  const deviceName = globalState$.deviceName.get();
  const deviceID = globalState$.applicationId.get();

  console.log({ deviceName, deviceID });

  const onlineStatus = computed(() => navigator.onLine);
  const { data: deviceType } = t.platform.useQuery();
  const type =
    deviceType === "linux" || deviceType === "win32" || deviceType === "darwin"
      ? "desktop"
      : "mobile";
  const isDesktop = computed(
    () => globalState$.deviceType.get() === "desktop",
  ).get();

  console.log({ deviceType, type });

  useEffect(() => {
    if (globalState$.applicationId.get() === null) {
      globalState$.applicationId.set(v4());
    }

    if (globalState$.deviceName.get() === null) {
      globalState$.deviceName.set(generateRandomName());
    }

    if (globalState$.deviceType.get() === null) {
      globalState$.deviceType.set(type);
    }
  }, [type]);

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
        <Flex direction="column" align="start" className="space-y-1">
          <Flex align="start" direction="column" width="100%">
            <Text className="text-[9px] font-light text-zinc-400">
              This Device
            </Text>
            <Flex align="center" justify="between" width="100%">
              <Text className="text-[12px] font-bold">{deviceName}</Text>
              <span className="text-zinc-400">
                {isDesktop ? (
                  <>
                    <Laptop size={9} />
                  </>
                ) : (
                  <>
                    <Phone size={9} />
                  </>
                )}
              </span>
            </Flex>
          </Flex>
          <Flex direction="column" align="start" className="space-y-1">
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text className="text-[11px] font-medium">
                {[].length} selected files
              </Text>
              <Folder size={10} className="text-zinc-400" />
            </Flex>
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text className="text-[10px] font-medium">
                {deviceID?.slice(0, deviceID.length)}
              </Text>
              <Key size={10} className="text-zinc-400" />
            </Flex>
            <Flex width="100%" align="center" justify="between" gap="2">
              <Text className="text-[10px] font-medium">
                You are{" "}
                <span
                  className={`text-[10px] ${
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
