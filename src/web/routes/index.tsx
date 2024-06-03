import { useMountOnce } from "@legendapp/state/react";
import { Flex } from "@radix-ui/themes";
import { globalState$, peerState$ } from "@shared/state";
import t from "@src/shared/config";
import { createFileRoute } from "@tanstack/react-router";
import { DeviceInfo, HomeView, ThisDeviceInfo } from "../components";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mutate: startServer } = t.node.startNode.useMutation({});

  const neighbors = peerState$.neighbors.get();

  const neighborsData = Array.from(neighbors.values());

  useMountOnce(() => {
    startServer();
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
