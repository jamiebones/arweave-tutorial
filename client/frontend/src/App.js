import "./App.css";
import { useState, useRef } from "react";
import axios from "axios";
import Arweave from "arweave";

const arweave = Arweave.init({});

function App() {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0);

  const fileRef = useRef();

  // async function getData(transactionId) {
  //   try {
  //     let data = await arweave.transactions.getData(transactionId, {
  //       decode: true,
  //       string: true,
  //     });
  //     console.log("data", data);
  //     data = JSON.parse(data);
  //     setData(data);
  //   } catch (error) {
  //     console.log("error message", error);
  //   }
  // }

  // async function getStatus(transactionId) {
  //   try {
  //     let data = await arweave.transactions.getStatus(transactionId);
  //     console.log("data", data);
  //   } catch (error) {
  //     console.log("error message", error);
  //   }
  // }

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
        onUploadProgress: (ProgressEvent) => {
          setProgressStatus(
            parseFloat(
              (ProgressEvent.loaded / ProgressEvent.total) * 100
            ).toFixed(2)
          );
        },
      });
      setSubmitted(false);
      fileRef.current.value = "";
      setFile(null);

      const jsonData = res.data;

      console.log("json data", jsonData);

      //const { response, transactionId } = jsonData;
    } catch (error) {
      console.log("error message", error);
    }
  };

  // const getTransactionData = async () => {
  //   await getData(transID);
  // };

  // const getTransactionStatus = async () => {
  //   await getStatus(transID);
  // };

  return (
    <div className="App">
      <div className="div">
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
          {submitted && (
            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: progressStatus + "%" }}
                aria-valuenow={progressStatus}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          )}

          <button type="submit">Upload File</button>
        </form>

        <div className="result"></div>
      </div>
    </div>
  );
}

export default App;
