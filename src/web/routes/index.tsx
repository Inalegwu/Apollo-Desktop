import { useMountOnce } from "@legendapp/state/react";
import { Flex } from "@radix-ui/themes";
import { globalState$, peerState$, receiveDirectMessage } from "@shared/state";
import t from "@src/shared/config";
import { generateRandomName } from "@src/shared/utils";
import { createFileRoute } from "@tanstack/react-router";
import { v4 } from "uuid";
import { DeviceInfo, ThisDeviceInfo } from "../components";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mutate: startServer } = t.node.startNode.useMutation({
    onSuccess: (d) => {
      peerState$.applicationId.set(d.id);
      peerState$.deviceName.set(d.name);
    },
  });

  const {mutate:defineDestination}=t.files.defineDestination.useMutation({
    onSuccess:(d)=>{
      globalState$.destinationPath.set(d.path);
    }
  })

  receiveDirectMessage.on(() => {
    console.log("direct message recieved");
  });

  const neighbors = Array.from(peerState$.neighbors.get().values());
  const favouriteDevices = Array.from(
    globalState$.favouriteDevices.get().values(),
  );

  useMountOnce(() => {
    startServer();

    if(globalState$.destinationPath.get()===null){
      defineDestination()
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
      {neighbors.map((v) => (
        <DeviceInfo key={v.connectionId} node={v} />
      ))}
      {favouriteDevices.map((v) => (
        <DeviceInfo key={v.connectionId} node={v} />
      ))}
      <DeviceInfo node={{
        connectionId:v4(),
        nodeName:generateRandomName(),
        deviceType:"desktop"
      }}/>
      <ThisDeviceInfo />
    </Flex>
  );
}
