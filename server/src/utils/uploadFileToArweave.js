import Arweave from "arweave";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { kty, n, e, d, p, q, dp, dq, qi } = process.env

const ARWEAVE_KEY = { kty, n, e, d, p, q, dp, dq, qi };

console.log("Arweave key", ARWEAVE_KEY);

//initialize arweave
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function getWalletAddress(key) {
  const walletAddress = await arweave.wallets.jwkToAddress(key);
  console.log("wallet address is ", walletAddress);
  return walletAddress;
}

async function getWalletBalance(address) {
  const balance = await arweave.wallets.getBalance(address);
  let winston = balance;
  let ar = arweave.ar.winstonToAr(balance);
  console.log(winston);
  console.log(ar);
  return winston;
}

const uploadFileToArweave = async (filePath, mimetype) => {
  try {
    //check if we have a balance in wallet
    const walletAddress = await getWalletAddress(ARWEAVE_KEY);
    const balance = await getWalletBalance(walletAddress);

    if (balance < 5000) {
      //contact admin to top up the balance
      console.log("The balance is getting low");
    }
    //create a transaction:
    console.log("1");
    let data = fs.readFileSync(filePath);
    console.log("2");
    let transaction = await arweave.createTransaction(
      { data: data },
      ARWEAVE_KEY
    );
    transaction.addTag("Content-Type", mimetype);
    //sign the transaction
    console.log("3");
    await arweave.transactions.sign(transaction, ARWEAVE_KEY);
    console.log("4");
    let uploader = await arweave.transactions.getUploader(transaction);
    console.log("5");
    while (!uploader.isComplete) {
      console.log("6");
      await uploader.uploadChunk();
      console.log("7");
      console.log(
        `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      );
    }
    //we Successfully uploaded the file if we get here
    console.log("transaction ID", transaction.id);
    return transaction.id;
  } catch (error) {
    console.log("error uploading file", error);
  }
};

export { uploadFileToArweave };
