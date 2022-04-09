import { setupClient } from "../adapters/algoD.js";
import {
  encodeUint64,
  getApplicationAddress,
  makeApplicationNoOpTxnFromObject,
  mnemonicToSecretKey,
  waitForConfirmation,
} from "algosdk";
import { appIndex } from "../constants/appIndex.js";

const makeDeposit = async ({ amount, assetID }) => {
  const account = mnemonicToSecretKey(process.env.Mnemo);
  const algodClient = setupClient();
  let suggestedParams = await algodClient.getTransactionParams().do();

  const appAddr = getApplicationAddress(appIndex);
  const appArgs = [encodeUint64(amount)];

  const depositAlgo = makeApplicationNoOpTxnFromObject({
    suggestedParams,
    from: account.addr,
    appIndex,
    foreignAssets: assetID,
    appArgs,
    rekeyTo: appAddr,
  });

  const txSigned = depositAlgo.signTxn(account.sk);
  const { txId } = await algodClient.sendRawTransaction(txSigned).do();
  console.log("transaction ID:", txId);
  const transactionResponse = await waitForConfirmation(algodClient, txId, 5);
  console.log("confirmed in round:", transactionResponse?.["confirmed-round"]);
};

export default makeDeposit;
