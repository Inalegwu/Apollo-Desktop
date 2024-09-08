import { createServer, type Socket } from "node:net";
import CORE from "@shared/core/core-message";

type ServerStartResponse = Readonly<{
  address: string;
}>;

type ConnectionMessage=Readonly<{
  nodeName:string;
  nodeKeychainID:string;
}>

const handleSocket = (socket: Socket) => {
  CORE.on("server-start", ({ serverAddr }) => {
    console.log(`Server start event sent with address ${serverAddr}`);
    socket.write(
      JSON.stringify({
        address: serverAddr,
      } as const satisfies ServerStartResponse),
    );
  });

  // when receiver mode is enabled, we send the required data
  // to receive the server-address
  CORE.on("receiver-mode-enable",({nodeName,nodeKeychainID})=>{
    socket.write(JSON.stringify({
      nodeName,
      nodeKeychainID
    } as const satisfies ConnectionMessage))
  })

  socket.on("data",(data)=>{
    try{
      const result=JSON.parse(data.toString());

      console.log(result);

    }catch(e){
      console.error(e)
    }
  })

};

const server = createServer(handleSocket);

server.listen(43357);
