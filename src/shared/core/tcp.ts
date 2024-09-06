// TODO: a simple TCP server that listens on a particular
// port which will handle establishing connections.
import {createServer, type Socket} from "node:net";

const handleSocket=(socket:Socket)=>{
    return ()=>{
        socket.on("data",console.log);
    }
}

const server=createServer(handleSocket)


server.listen(43357);