import { useMount, useObservable } from "@legendapp/state/react";
import {
  ArrowsOutSimple,
  DownloadSimple,
  Gear,
  Info,
  Minus,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { Button, Flex, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { useEffect } from "react";
import { globalState$ } from "../state";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { mutate: minimizeWindow } = t.window.minimize.useMutation();
  const { mutate: maximizeWindow } = t.window.maximize.useMutation();
  const { mutate: closeWindow } = t.window.closeWindow.useMutation();

  const { mutate: startNode } = t.node.startNode.useMutation();

  useMount(() => startNode());

  const theme = globalState$.colorMode.get();

  const settingsVisible = useObservable(false);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Flex
      width="100%"
      grow="1"
      direction="column"
      className="transition h-screen bg-light-5 dark:bg-dark-8"
    >
      <Flex className="px-4 py-2.4" align="center" justify="between">
        <Text size="1" color="gray">
          Apollo
        </Text>
        <Flex grow="1" className="p-1" id="drag-region" />
        <Flex align="center" justify="end" gap="4">
          <Button
            variant="ghost"
            color="gray"
            onClick={() => minimizeWindow()}
            className="w-2 h-4 rounded-full cursor-pointer"
          >
            <Minus />
          </Button>
          <Button
            variant="ghost"
            color="gray"
            onClick={() => maximizeWindow()}
            className="w-2 h-4 rounded-full cursor-pointer"
          >
            <ArrowsOutSimple />
          </Button>
          <Button
            variant="ghost"
            color="tomato"
            onClick={() => closeWindow()}
            className="w-2 h-4 rounded-full cursor-pointer"
          >
            <X />
          </Button>
        </Flex>
      </Flex>
      <Flex grow="1" className="h-full">
        <Flex
          direction="column"
          className="w-[7%] py-3"
          align="center"
          justify="between"
        >
          <Flex direction="column" align="center" justify="start" gap="4">
            <Button
              variant="ghost"
              color="gray"
              className="w-4 h-6 rounded-full cursor-pointer"
              asChild
            >
              <Link href="/">
                <UploadSimple />
              </Link>
            </Button>
            <Button
              variant="ghost"
              color="gray"
              className="w-4 h-6 rounded-full cursor-pointer"
              asChild
            >
              <Link href="/">
                <DownloadSimple />
              </Link>
            </Button>
          </Flex>
          <Flex direction="column" align="end" gap="4">
            <Button
              variant="ghost"
              className="w-4 h-6 rounded-full cursor-pointer"
            >
              <Info />
            </Button>
            <Button
              variant="ghost"
              onClick={() => settingsVisible.set(true)}
              className="w-4 h-6 rounded-full cursor-pointer"
            >
              <Gear />
            </Button>
          </Flex>
        </Flex>
        <Flex className="w-[93%] border-1 border-solid border-zinc-400/50 dark:border-zinc-800 rounded-tl-lg bg-light-4 dark:bg-dark-7">
          {children}
        </Flex>
      </Flex>
      {settingsVisible.get() && (
        <Flex
          align="center"
          justify="center"
          className="absolute z-10 w-full h-full bg-black/20"
        >
          <Flex className="shadow-md px-4 py-5 w-4/6 h-3/6 rounded-xl border-1 border-solid border-zinc-400/50 dark:border-zinc-800">
            <Button
              variant="ghost"
              className="w-3 h-5 rounded-full cursor-pointer"
              onClick={() => settingsVisible.set(false)}
            >
              <X />
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
