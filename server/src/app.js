import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Arweave from "arweave";
import * as dotenv from "dotenv";
import uploadFile from "./middleware/uploadFile.js";


dotenv.config();


async function main() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });



  app.post("/api/uploadFile", uploadFile);

  app.listen(4000, () => {
    console.log(`app listening on port 4000`);
  });
}

main();
