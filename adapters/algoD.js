import algosdk from "algosdk";

export function setupClient() {
  const token = "";
  const server = "https://node.testnet.algoexplorerapi.io/";
  const port = "";
  // const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  // const server = "http://localhost";
  // const port = "4001";
  return new algosdk.Algodv2(token, server, port);
}
