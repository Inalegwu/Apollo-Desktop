import { useMount, useUnmount } from "@legendapp/state/react";
import { Button, Flex, Link } from "@radix-ui/themes";
import t from "@src/shared/config";
import { Plus, Settings } from "lucide-react";
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
  const { mutate: stopNode } = t.node.stopNode.useMutation();

  useMount(() => startNode());

  useUnmount(() => stopNode());

  const theme = globalState$.colorMode.get();

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const { mutate: selectFiles } = t.files.selectFils.useMutation();

  return (
    <Flex
      width="100%"
      grow="1"
      direction="column"
      className="transition h-screen p-2"
    >
      <Flex
        className="absolute z-10 w-full p-4 top-0 left-0 cursor-grab"
        id="drag-region"
      />
      {children}
      <Flex className="absolute bottom-2 right-2 space-x-3 bg-transparent backdrop-blur-3xl rounded-lg p-3">
        <Button
          variant="soft"
          onClick={() => selectFiles()}
          radius="full"
          className=" w-9 h-9 cursor-pointer"
        >
          <Plus size={13} />
        </Button>
        <Button
          variant="soft"
          radius="full"
          asChild
          className=" w-9 h-9 cursor-pointer rounded-full"
        >
          <Link href="/settings">
            <Settings size={13} />
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
}
