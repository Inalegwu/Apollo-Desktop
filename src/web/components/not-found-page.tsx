import { Flex, Text } from "@radix-ui/themes";

export default function NotFoundPage() {
  return (
    <Flex className="w-full h-screen flex flex-col items-center justify-start px-15 py-15">
      <Text size="6" className="font-bold" color="tomato">
        Page Not Found
      </Text>
    </Flex>
  );
}
