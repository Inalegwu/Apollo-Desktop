import { createServer, type Socket } from "node:net";
import CORE from "@shared/core/core-message";

type ServerStartResponse = Readonly<{
  address: string;
}>;

const handleSocket = (socket: Socket) => {
  CORE.on("server-start", ({ serverAddr }) => {
    console.log(`Server start event sent with address ${serverAddr}`);
    socket.write(
      JSON.stringify({
        address: serverAddr,
      } as const satisfies ServerStartResponse),
    );
  });

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
