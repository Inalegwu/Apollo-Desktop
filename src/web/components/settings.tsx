import type {
  ObservablePrimitiveBaseFns,
  ObservablePrimitiveBooleanFns,
} from "@legendapp/state";
import { Switch, useObservable } from "@legendapp/state/react";
import {
  Button,
  Flex,
  Select,
  Switch as SwitchButton,
  Text,
} from "@radix-ui/themes";
import { globalState$ } from "@src/shared/state";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type SettingsProps = {
  settings: ObservablePrimitiveBaseFns<boolean> &
    ObservablePrimitiveBooleanFns<boolean>;
};

export default function Settings({ settings }: SettingsProps) {
  const view = useObservable<"advance" | "transfers">("transfers");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute z-20 w-full h-screen flex items-center justify-center"
    >
      <Flex className="w-5/6 h-4/6 bg-light-1 dark:bg-dark-8 rounded-lg overflow-hidden border-1 border-solid border-zinc-200 dark:border-zinc-800">
        {/* sidebar */}
        <Flex
          direction="column"
          align="start"
          className="w-2/6 h-full bg-white dark:bg-dark-7"
        >
          <Flex align="center" justify="start" className="px-3 py-2">
            <Button
              onClick={() => settings.set(false)}
              variant="ghost"
              color="tomato"
              className="w-2.5 h-4.5 rounded-full cursor-pointer"
            >
              <X />
            </Button>
          </Flex>
          <Flex
            direction="column"
            align="start"
            className="w-full px-2"
            grow="1"
          >
            <Flex
              onClick={() => view.set("transfers")}
              className="w-full px-2 py-2 cursor-pointer hover:bg-zinc-100/40 dark:hover:bg-zinc-800/40 rounded-sm"
            >
              <Text className="font-medium text-[13px]">Transfers</Text>
            </Flex>
            <Flex
              onClick={() => view.set("advance")}
              className="w-full px-2 py-2 cursor-pointer hover:bg-zinc-100/40 dark:hover:bg-zinc-800/40 rounded-sm"
            >
              <Text size="2" className="font-medium text-[13px]">
                Advanced
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex className="w-4/6 h-full px-3 py-3">
          <Switch value={view.get()}>
            {{
              advance: () => <Advance />,
              transfers: () => <Transfers />,
            }}
          </Switch>
        </Flex>
      </Flex>
    </motion.div>
  );
}

function Advance() {
  return <>advanced</>;
}

function Transfers() {
  return (
    <Flex direction="column" align="start" gap="5" className="w-full h-full">
      <Flex className="w-full" align="center" justify="between">
        <Flex direction="column" align="start">
          <Text className="font-bold text-[12px]">Transfer History</Text>
          <Text className="text-zinc-400 text-[11.5px]">
            View transfers both incoming and outgoing to this device
          </Text>
        </Flex>
        <SwitchButton
          color="iris"
          onClick={() =>
            globalState$.transferHistory.set(
              !globalState$.transferHistory.get(),
            )
          }
          checked={globalState$.transferHistory.get()}
        />
      </Flex>
      <Flex className="w-full" align="center" justify="between">
        <Flex direction="column" align="start">
          <Text className="font-bold text-[12px]">Keep Transfer History</Text>
          <Text className="text-zinc-400 text-[11.5px]">
            How long should transfer history be available
          </Text>
        </Flex>
        <Select.Root size="1">
          <Select.Trigger className="bg-light-1 dark:bg-dark-8">
            Duration
          </Select.Trigger>
          <Select.Content
            variant="soft"
            className="flex flex-col items-start bg-light-1 dark:bg-dark-8"
          >
            <Select.Item value="3D">
              <Text>3 Days</Text>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
    </Flex>
  );
}
