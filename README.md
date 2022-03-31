## Single Transaction Deposit

This smart contract lets an app-call rekeyed to the app withdraw assets from the sender account and rekey the sender account back to it once it's done.

I have commented every part of the TEAL to explain the contract in detail.

### High-level understanding of this contract

The contract is able to withdraw Algos or ASA from the sender account as well as opt-in those ASA if it needs to.

The structure of the app call is as follows:  
appArgs = [amount || assetAmount]  
foreignAssets = [undefined || assetID]  

The contract assumes that an empty foreignAssets array means an Algo deposit.  
On the other hand if a value is present in the foreignAssets array it will be treated as an asset deposit.