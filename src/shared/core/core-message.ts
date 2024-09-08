// The core of message passing between the file-server
// and tcp node discovery
// CoreMessageTypes are the events that can possibly
// be sent and received on this emitter channel
import {TypedEventEmitter} from "@shared/emitter";


type CoreMessageTypes=Readonly<{
   connect:{
       // a connection request is received in order
       // to establish a connection.
       // a connection response is sent when a server
       // address has been provided
       // connection responses won't be handled by
       // the file server
       type:"CONNECTION_REQUEST"|"CONNECTION_RESPONSE";
       nodeName:string;
       nodeKeychainID:string;
   };
   "server-start":{
       serverAddr:string;
   }
}>

const CORE=new TypedEventEmitter<CoreMessageTypes>();


export default CORE