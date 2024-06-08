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
  const view = useObservable<"advanced" | "transfers">("transfers");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute z-20 w-full h-screen flex items-center justify-center shadow-xl"
    >
      <Flex className="w-5/6 h-4/6 bg-light-1 dark:bg-dark-8 rounded-lg overflow-hidden border-1 border-solid border-zinc-200 dark:border-zinc-800">
        {/* sidebar */}
        <Flex
          direction="column"
          align="start"
          className="w-2/6 h-full bg-white dark:bg-dark-7 border-r-1 border-r-solid border-r-zinc-100 dark:border-r-zinc-800"
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
              className="w-full px-2 py-2 cursor-pointer hover:bg-zinc-100/40 dark:hover:bg-zinc-800/40 rounded-lg"
            >
              <Text
                color={view.get() === "transfers" ? "iris" : "gray"}
                weight={view.get() === "transfers" ? "bold" : "regular"}
                className="font-medium text-[12.5px]"
              >
                Transfers
              </Text>
            </Flex>
            <Flex
              onClick={() => view.set("advanced")}
              className="w-full px-2 py-2 cursor-pointer hover:bg-zinc-100/40 dark:hover:bg-zinc-800/40 rounded-lg"
            >
              <Text
                weight={view.get() === "advanced" ? "bold" : "regular"}
                color={view.get() === "advanced" ? "iris" : "gray"}
                size="2"
                className="font-medium text-[12.5px]"
              >
                Advanced
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex className="w-4/6 h-full px-3 py-3">
          <Switch value={view.get()}>
            {{
              advanced: () => <Advanced />,
              transfers: () => <Transfers />,
            }}
          </Switch>
        </Flex>
      </Flex>
    </motion.div>
  );
}

function Advanced() {
  return <>advanced</>;
}

function Transfers() {
  return (
    <Flex direction="column" align="start" gap="5" className="w-full h-full">
      <Flex className="w-full" align="center" justify="between">
        <Flex direction="column" align="start">
          <Text className="font-bold text-[12px]">Transfer history</Text>
          <Text className="text-zinc-400 text-[11.5px]">
            View transfers both incoming and outgoing to this device
          </Text>
        </Flex>
        <SwitchButton
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
          <Text className="font-bold text-[12px]">Save transfer history</Text>
          <Text className="text-zinc-400 text-[11.5px]">
            How long should transfer history be available
          </Text>
        </Flex>
        <Select.Root size="1">
          <Select.Trigger
            radius="large"
            disabled={!globalState$.transferHistory.get()}
            className="bg-light-1 dark:bg-dark-8 cursor-pointer"
          />
          <Select.Content
            variant="soft"
            defaultValue="4D"
            className="flex flex-col items-start bg-light-1 dark:bg-dark-8"
          >
            <Select.Item
              disabled={!globalState$.transferHistory.get()}
              className="cursor-pointer"
              value="none"
            >
              <Text>None</Text>
            </Select.Item>
            <Select.Item
              disabled={!globalState$.transferHistory.get()}
              className="cursor-pointer"
              value="1D"
            >
              <Text>1 Days</Text>
            </Select.Item>
            <Select.Item
              disabled={!globalState$.transferHistory.get()}
              className="cursor-pointer"
              value="2D"
            >
              <Text>2 Days</Text>
            </Select.Item>
            <Select.Item
              disabled={!globalState$.transferHistory.get()}
              className="cursor-pointer"
              value="3D"
            >
              <Text>3 Days</Text>
            </Select.Item>
            <Select.Item
              disabled={!globalState$.transferHistory.get()}
              className="cursor-pointer"
              value="4D"
            >
              <Text>4 Days</Text>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
    </Flex>
  );
}
