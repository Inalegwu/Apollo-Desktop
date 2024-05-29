import { ContextMenu, Flex, Text } from "@radix-ui/themes";
import { generateAppId, generateRandomName } from "@src/shared/utils";
import { Lock, RefreshCw } from "lucide-react";
import { useCallback } from "react";
import { globalState$ } from "../state";

type Props = {
  children: React.ReactNode;
};

export default function HomeView({ children }: Props) {
  const changeDeviceName = useCallback(() => {
    const newName = generateRandomName();

    globalState$.deviceName.set(newName);
  }, []);

  const changeKeyChainId = useCallback(() => {
    const newId = generateAppId();

    globalState$.applicationId.set(newId);
  }, []);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Content size="1" variant="soft">
        <ContextMenu.Item onClick={changeDeviceName} className="cursor-pointer">
          <Flex align="center" justify="start" gap="1">
            <RefreshCw size={10} />
            <Text size="1">Change Device Name</Text>
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item onClick={changeKeyChainId} className="cursor-pointer">
          <Flex align="center" justify="start" gap="1">
            <Lock size={10} />
            <Text size="1">Change Keychain ID</Text>
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
