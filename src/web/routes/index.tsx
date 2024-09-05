import { useMountOnce } from "@legendapp/state/react";
import { Flex } from "@radix-ui/themes";
import { globalState$ } from "@shared/state";
import t from "@src/shared/config";
import { generateRandomName } from "@src/shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { v4 } from "uuid";
import { DeviceInfo, ThisDeviceInfo } from "../components";

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
    <Flex
      grow="1"
      className="items-center justify-center"
      id={
        globalState$.colorMode.get() === "dark" ? "workspace_dark" : "workspace"
      }
    >
      <DeviceInfo
        node={{
          connectionId: v4(),
          nodeName: generateRandomName(),
          deviceType: "desktop",
        }}
      />
      <ThisDeviceInfo />
    </Flex>
  );
}
