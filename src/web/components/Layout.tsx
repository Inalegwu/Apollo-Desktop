import { computed } from "@legendapp/state";
import { useObserveEffect } from "@legendapp/state/react";
import { Button, Flex } from "@radix-ui/themes";
import { fileTransferState$, globalState$ } from "@shared/state";
import t from "@src/shared/config";
import { Minus, Moon, Plus, Sun, X } from "lucide-react";
import type React from "react";
import { useCallback } from "react";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { mutate: minimizeWindow } = t.window.minimize.useMutation();
  const { mutate: closeWindow } = t.window.closeWindow.useMutation();

  const isDarkMode = computed(() => globalState$.colorMode.get() === "dark");

  useObserveEffect(() => {
    if (globalState$.colorMode.get() === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });

  const toggleColorMode = useCallback(() => {
    if (globalState$.colorMode.get() === "light") {
      document.body.classList.add("dark");
      globalState$.colorMode.set("dark");
    } else {
      document.body.classList.remove("dark");
      globalState$.colorMode.set("light");
    }
  }, []);

  const { mutate: selectFiles } = t.files.selectFiles.useMutation({
    onSuccess: (data) => {
      if (data.cancelled) return;

      fileTransferState$.files.set(data.data);
    },
  });

  return (
    <Flex
      width="100%"
      grow="1"
      direction="column"
      className="transition h-screen transition"
    >
      <Flex
        align="center"
        justify="between"
        gap="4"
        className="absolute z-10 w-full px-4 py-3 top-0 left-0"
      >
        <Button
          variant="ghost"
          color="gray"
          onClick={toggleColorMode}
          className="w-2.5 h-4.5 rounded-full cursor-pointer outline-none"
        >
          {isDarkMode.get() ? <Sun /> : <Moon />}
        </Button>
        <Flex grow="1" id="drag-region" className="p-2" />
        <Flex align="center" justify="end" gap="5">
          <Button
            onClick={() => minimizeWindow()}
            className="w-2.5 h-4.5 rounded-full cursor-pointer outline-none"
            color="gray"
            variant="ghost"
          >
            <Minus />
          </Button>
          <Button
            variant="ghost"
            onClick={() => closeWindow()}
            className="w-2.5 h-4.5 rounded-full cursor-pointer outline-none"
            color="tomato"
          >
            <X />
          </Button>
        </Flex>
      </Flex>
      {children}
      <Flex className="absolute bottom-1 right-1 space-x-3  rounded-lg p-3">
        <Button
          variant="soft"
          onClick={() => selectFiles()}
          radius="full"
          className="w-9 h-9 cursor-pointer"
        >
          <Plus size={13} />
        </Button>
      </Flex>
    </Flex>
  );
}
