import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import uploadFile from "./middleware/uploadFile.js";


dotenv.config();


async function main() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.post("/api/uploadFile", uploadFile);

  app.listen(4000, () => {
    console.log(`app listening on port 4000`);
  });
}

main();
