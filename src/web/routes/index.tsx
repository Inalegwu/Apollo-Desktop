import { useMount, useUnmount } from "@legendapp/state/react";
import { Flex } from "@radix-ui/themes";
import t from "@src/shared/config";
import { generateAppId, generateRandomName } from "@src/shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { DeviceInfo, HomeView, ThisDeviceInfo } from "../components";
import { globalState$, peerState$ } from "../state";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mutate: startServer } = t.node.startNode.useMutation();
  const { mutate: stopServer } = t.node.stopNode.useMutation();

  const neighbors = peerState$.neighbors.get();

  const neighborsData = Array.from(neighbors.values());

  useMount(() => {
    startServer();

    if (globalState$.firstLaunch.get()) {
      globalState$.applicationId.set(generateAppId());
      globalState$.deviceName.set(generateRandomName());
      globalState$.firstLaunch.set(false);
    }
  });

  useUnmount(() => {
    stopServer();
  });

  return (
    <HomeView>
      <Flex
        grow="1"
        className="items-center justify-center"
        id={
          globalState$.colorMode.get() === "dark"
            ? "workspace_dark"
            : "workspace"
        }
      >
        {neighborsData.map((v) => (
          <DeviceInfo key={v.connectionId} node={v} />
        ))}
        <ThisDeviceInfo />
      </Flex>
    </HomeView>
  );
}
