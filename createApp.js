import { setupClient } from "./adapters/algoD.js";
import fs from "fs";
import algosdk from "algosdk";

const createApp = async () => {
  try {
    const account = algosdk.mnemonicToSecretKey(process.env.Mnemo);
    const algodClient = setupClient();
    const params = await algodClient.getTransactionParams().do();

    const app = fs.readFileSync(new URL("./contracts/app.teal", import.meta.url), "utf8");
    const compileApp = await algodClient.compile(app).do();

    const clearState = fs.readFileSync(new URL("./contracts/clearState.teal", import.meta.url), "utf8");
    const compiledClearProg = await algodClient.compile(clearState).do();

    const tx = algosdk.makeApplicationCreateTxnFromObject({
      suggestedParams: {
        ...params,
      },
      from: account.addr,
      approvalProgram: new Uint8Array(Buffer.from(compileApp.result, "base64")),
      clearProgram: new Uint8Array(Buffer.from(compiledClearProg.result, "base64")),
      numGlobalByteSlices: 0,
      numGlobalInts: 0,
      numLocalByteSlices: 0,
      numLocalInts: 0,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
    });

    const txSigned = tx.signTxn(account.sk);
    const { txId } = await algodClient.sendRawTransaction(txSigned).do();
    
    let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
    let appId = transactionResponse["application-index"];
    console.log("Created new app-id: ", appId);
    
  } catch (error) {
    console.error(error.message);
  }
};

export default createApp;
