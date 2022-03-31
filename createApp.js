import { setupClient } from "./adapters/algoD.js";
import fs from "fs";
import {
  getApplicationAddress,
  makeApplicationCreateTxnFromObject,
  makePaymentTxnWithSuggestedParamsFromObject,
  mnemonicToSecretKey,
  OnApplicationComplete,
  waitForConfirmation,
} from "algosdk";

const createApp = async () => {
  try {
    const account = mnemonicToSecretKey(process.env.Mnemo);
    const algodClient = setupClient();
    const suggestedParams = await algodClient.getTransactionParams().do();

    const app = fs.readFileSync(new URL("./contracts/app.teal", import.meta.url), "utf8");
    const compileApp = await algodClient.compile(app).do();

    const clearState = fs.readFileSync(new URL("./contracts/clearProg.teal", import.meta.url), "utf8");
    const compiledClearProg = await algodClient.compile(clearState).do();

    const tx = makeApplicationCreateTxnFromObject({
      suggestedParams,
      from: account.addr,
      approvalProgram: new Uint8Array(Buffer.from(compileApp.result, "base64")),
      clearProgram: new Uint8Array(Buffer.from(compiledClearProg.result, "base64")),
      numGlobalByteSlices: 0,
      numGlobalInts: 0,
      numLocalByteSlices: 0,
      numLocalInts: 0,
      onComplete: OnApplicationComplete.NoOpOC,
    });

    let txSigned = tx.signTxn(account.sk);
    const { txId } = await algodClient.sendRawTransaction(txSigned).do();
    const transactionResponse = await waitForConfirmation(algodClient, txId, 5);
    const appId = transactionResponse["application-index"];
    console.log("Created new app-id: ", appId);

    // we'll send 0.5 algo to the app account to bootstrap it
    const bootstrap = makePaymentTxnWithSuggestedParamsFromObject({
      suggestedParams,
      from: account.addr,
      to: getApplicationAddress(appId),
      amount: 5 * 10 ** 5,
    });

    txSigned = bootstrap.signTxn(account.sk);
    await algodClient.sendRawTransaction(txSigned).do();
  } catch (error) {
    console.error(error.message);
  }
};

export default createApp;
