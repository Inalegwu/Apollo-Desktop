import { useMount } from "@legendapp/state/react";
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

  const neighbors = peerState$.neighbors.get();

  const neighborsData = Array.from(neighbors);

  useMount(() => {
    startServer();

    if (globalState$.firstLaunch.get()) {
      globalState$.applicationId.set(generateAppId());
      globalState$.deviceName.set(generateRandomName());
      globalState$.firstLaunch.set(false);
    }
  });

  return (
    <HomeView>
      <Flex grow="1" className="items-center justify-center" id="workspace">
        {neighborsData.map((v) => (
          <DeviceInfo key={v[0]} node={v[1]} />
        ))}
        <ThisDeviceInfo />
      </Flex>
    </HomeView>
  );
}
