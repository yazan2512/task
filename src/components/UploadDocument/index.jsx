import { useState, useEffect } from "react";
import apiCLient from "../../API/apiCLient";
import upload from "../../Icons/upload.png";
import "./UploadDocument.css";

function UploadDocument({ uploaded, setCheckUploadFile }) {
  const [file, setFile] = useState(null); // Changed initial value to null

  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile); // Ensure this logs the correct file
      setFile(selectedFile); // Set the selected file
    } else {
      console.error("No file selected.");
    }
  };

  const uploadFile = async () => {
    if (!file) {
      console.error("No file selected.");
      return; // Early return if no file is selected
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    try {
      // Use the API client to upload the file
      const datafile = await apiCLient.users.UploadFile(file); // Pass file directly
      alert("File uploaded successfully!");
      setFile(null); // Reset the file state after upload
    } catch (error) {
      console.error(
        "File upload failed:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to upload the file. Please try again.");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="h2-upload">
        وثيقة إثبات قدرة الموظف من الجهة الحكومية على تمثيلها
      </h2>
      <form
        className="upload-area"
        onClick={() => document.querySelector(".file-input").click()}
      >
        <label className="upload-button">تحميل</label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={handleFileChange}
          className="file-input"
        />
        <div className="file-name">
          <img className="icon-upload" src={upload} alt="Upload Icon" />
          {file ? (
            <span>{file.name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          ) : (
            <span>
              تحميل وثيقة إثبات قدرة الموظف من الجهة الحكومية على
              تمثيلها&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )}
        </div>
      </form>
      <p className="file-info">
        jpeg او jpg او png او PDF السماح بارفاق انواع معينه فقط مثل • <br />
        5MB حجم الملف لا يتجاوز •
      </p>
    </div>
  );
}

export default UploadDocument;
