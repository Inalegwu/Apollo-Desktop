import { Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { Info, X } from "lucide-react";

export default function About() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          variant="ghost"
          className="w-2.5 h-4.5 rounded-full cursor-pointer"
        >
          <Info />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size="2">
        <Flex direction="column" align="start" gap="2">
          <Flex align="center" className="w-full" justify="end">
            <Dialog.Close>
              <Button
                variant="ghost"
                color="gray"
                className="w-3 h-5 rounded-full cursor-pointer"
              >
                <X />
              </Button>
            </Dialog.Close>
          </Flex>
          <Flex direction="column" gap="1" align="start">
            <Heading size="5" color="gray">
              About
            </Heading>
            <Text size="3" className="font-medium" color="gray">
              Apollo is a product of{" "}
              <Text size="2" className="font-bold cursor-pointer" color="iris">
                DisgruntledDevs &copy; 2024
              </Text>{" "}
              as a part of the apps from the future suite, designed to provide
              productivity and lifestyle tools for all users, Securely and
              Localy on all devices.
            </Text>
            <Text size="3" className="font-medium" color="gray">
              Apollo is a completely private and local-first application,
              meaning none of your information ever leaves your devices and user
              accounts aren't necessary.
            </Text>
            <Flex align="start" direction="column">
              <Text size="3" color="gray">
                For more information, visit us{" "}
                <Text size="3" color="iris" className="cursor-pointer">
                  @apollo.share
                </Text>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
