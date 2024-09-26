import { computed } from "@legendapp/state";
import { Box, Flex, Popover, Text } from "@radix-ui/themes";
import t from "@shared/config";
import { globalState$ } from "@shared/state";
import { generateGradientColors, generateRandomName } from "@src/shared/utils";
import { Folder, Key, Laptop, Phone, Wifi, WifiOff } from "lucide-react";
import { useEffect, useMemo } from "react";
import { v4 } from "uuid";

export default function ThisDeviceInfo() {
  const deviceName = globalState$.deviceName.get();
  const deviceID = globalState$.applicationId.get();

  const [color1, color2] = useMemo(() => generateGradientColors(), []);

  const onlineStatus = computed(() => navigator.onLine);
  t.platform.useQuery(undefined, {
    onSuccess: (data) => {
      if (data === "android") {
        globalState$.deviceType.set("mobile");
        return;
      }
      if (data === "darwin") {
        globalState$.deviceType.set("desktop");
        return;
      }
      if (data === "linux") {
        globalState$.deviceType.set("desktop");
        return;
      }
      if (data === "win32") {
        globalState$.deviceType.set("desktop");
        return;
      }
    },
  });

  const isDesktop = computed(
    () => globalState$.deviceType.get() === "desktop",
  ).get();

  useEffect(() => {
    if (globalState$.applicationId.get() === null) {
      globalState$.applicationId.set(v4());
    }

    if (globalState$.deviceName.get() === null) {
      globalState$.deviceName.set(generateRandomName());
    }
  }, []);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Box
          style={{
            background: `linear-gradient(45deg,${color1},${color2})`,
          }}
          className="w-11 h-11 rounded-full overflow-hidden shadow-xl cursor-pointer border-1 border-solid border-zinc-200 dark:border-zinc-800"
        />
      </Popover.Trigger>
      <Popover.Content size="1">
        <Flex direction="column" align="start" className="space-y-1">
          <Flex align="start" direction="column" width="100%">
            <Text className="text-[11px] text-zinc-400">This Device</Text>
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
                <Wifi size={9} className="text-green-500" />
              ) : (
                <WifiOff size={9} className="text-red-500" />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
