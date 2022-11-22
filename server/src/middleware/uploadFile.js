import formidable from "formidable";
import { uploadFileToArweave } from "../utils/uploadFileToArweave.js";

const MAX_SIZE = 600 * 1024 * 1024;

const uploadFile = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.maxFileSize = MAX_SIZE;
  form.parse(req, async function (err, fields, files) {
    if (err) throw new Error("File upload failed");
    try {
    
      var filePath = files.fileUploader.filepath;
      const mimeType = files.fileUploader.mimetype;
      console.log("filepath", filePath);
      console.log("mimeType", mimeType);
      //upload file to arweave here 🗄
      const transactionID = await uploadFileToArweave(filePath, mimeType);
      return res.send(transactionID);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export default uploadFile;
