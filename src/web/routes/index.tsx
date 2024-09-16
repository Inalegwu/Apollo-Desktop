import { useMountOnce } from "@legendapp/state/react";
import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import { globalState$ } from "@shared/state";
import t from "@src/shared/config";
import { generateRandomName } from "@src/shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { v4 } from "uuid";
import { DeviceInfo, ThisDeviceInfo } from "../components";
import { Lock, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mutate: defineDestination } = t.files.defineDestination.useMutation({
    onSuccess: (d) => {
      globalState$.destinationPath.set(d.path);
    },
  });

  useMountOnce(() => {
    if (globalState$.destinationPath.get() === null) {
      defineDestination();
    }
  });

  return (
    <ContextWrapper>
      <Flex
        grow="1"
        className="items-center justify-center"
        id={
          globalState$.colorMode.get() === "dark"
            ? "workspace_dark"
            : "workspace"
        }
      >
        <DeviceInfo
          node={{
            keychainId: v4(),
            deviceName: generateRandomName(),
            deviceType: "desktop",
          }}
        />
        <ThisDeviceInfo />
      </Flex>
    </ContextWrapper>
  );
}

const ContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const newAppName = () => globalState$.deviceName.set(generateRandomName());

  const newKeychainId = () => globalState$.applicationId.set(v4());

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content size="1" variant="soft">
        <ContextMenu.Item onClick={newKeychainId} className="cursor-pointer">
          <Flex align="center" justify="between" gap="2">
            <Text className="text-[11px]">New Keychain ID</Text>
            <RefreshCw size={9} />
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item onClick={newAppName} className="cursor-pointer">
          <Flex align="center" justify="between" gap="2">
            <Text className="text-[11px]">New Device Name</Text>
            <Lock size={9} />
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
