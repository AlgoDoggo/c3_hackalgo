import dotenv from "dotenv";
import makeDeposit from "./example/makeDeposit.js";
dotenv.config();

// Comment or uncomment the assetID depending on whether you want to deposit algo or asa
// The logic will of course fail if you do not have the relevant asa in your account
const depositParams = {
  amount: 60,
  //assetID: [54215619],
};

makeDeposit(depositParams).catch((err) => console.error(err.message));
