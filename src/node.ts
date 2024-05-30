import createP2PNode from "./peer";

const node = createP2PNode({
  port: 42069,
});

export default node;
