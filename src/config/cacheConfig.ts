import NodeCache from "node-cache";

const webSocketCache = new NodeCache({ stdTTL: 1200 });

export { webSocketCache };
