import { globalState$ } from "../state";
import createP2PNode from "./node";

const node = createP2PNode({
  port: globalState$.port.get(),
});

export default node;
