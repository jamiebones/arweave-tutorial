import "./App.css";
import { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [transactionID, setTransactionID] = useState("");

  const fileRef = useRef();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const extention = ["jpg", "jpeg", "png", "gif", "mp4", "pdf"];
    //check for the type of image we are uploading
    //check extension
    const position = file.name.lastIndexOf(".");
    const fileExt = file.name.substr(position + 1, file.name.length);
    const index = extention.indexOf(fileExt);
    if (index == -1) {
      window.alert(`file extension not supported.`);
      fileRef.current.value = "";
      return;
    }
    //save the file here
    setFile(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fileUploader", file);
      setSubmitted(true);

      const res = await axios.request({
        method: "post",
        url: "http://localhost:4000/api/uploadFile",
        data: formData,
      });

      setSubmitted(false);
      fileRef.current.value = "";
      setFile(null);

      const transID = res.data;
      setTransactionID(transID);
      console.log("transaction ID 🏹 ", transID);
    } catch (error) {
      console.log("error message", error);
    }
  };

  return (
    <div className="App">
      <div className="div">
        <h1>Select a File to Upload To Arweave</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            type="file"
            name="fileUploader"
            onChange={onFileChange}
            id="fileInput"
            ref={fileRef}
          />
          <br />
          <br />

          <button type="submit" disabled={submitted}>
            Upload File to Arweave
          </button>
        </form>

        {transactionID && (
          <div className="result">
            <p>Transaction ID : {transactionID}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
