import React, { useState, useEffect } from "react";
import apiCLient from "../../API/apiCLient";
import "./SignupForm.css";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"; // Import dayjs for date formatting
import Alert from '@mui/material/Alert';


function SignupForm({ setDataUser }) {
  const [userDataByNationalId, setUserDataByNationalId] = useState(null);
  const [value, setValue] = useState(null); // Updated for date handling
  const [Data, setData] = useState({
    national_id: "",
    birth_date: "",
  });
   const [alertMessage, setAlertMessage] = useState("");
  useEffect(() => {
    if (userDataByNationalId) {
      setDataUser(userDataByNationalId);
    }
  }, [userDataByNationalId, setDataUser]);

  const handleData = (event) => {
    const { name, value } = event.target; // Handles input changes
    setData((old) => ({ ...old, [name]: value }));
  };

  const handleDateChange = (newValue) => {
    const formattedDate = newValue ? dayjs(newValue).format("DD-MM-YYYY") : "";
    setData((old) => ({ ...old, birth_date: formattedDate }));
    setValue(newValue);
  };

  const handleGetUserByNationalId = async () => {
    try {
      const userdata = await apiCLient.users.getUserByNationalId(
        Data.national_id.trim(),
        Data.birth_date // Send the formatted date as "DD-MM-YYYY"
      );
      setUserDataByNationalId(userdata);
      setAlertMessage(" "); // Clear alert if user is found
    } catch (error) {
      setAlertMessage("يرجى التأكد من ادخال الرقم الوطني و تاريخ الميلاد بشكل صحيح");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form className="SignupForm">
        <div className="form-group-SignupForm">
          <div className="input-style-SignupForm">
            <label className="label-SignupForm">الرقم الوطني</label>
            <TextField
            required
              dir="rtl"
              placeholder="مثال"
              id="outlined-basic"
              variant="outlined"
              type="number"
              name="national_id"
              value={Data.national_id}
              onChange={handleData} // Handle text input change
            />
            {alertMessage && ( // Properly wrap the conditional rendering
            <Alert severity="error" style={{ marginTop: "10px" }}>
            {alertMessage}
                </Alert>
                      )}
          </div>
          <div className="input-style-SignupForm">
            <label className="label-SignupForm">تاريخ الميلاد</label>
            <DatePicker
              required
              
              name="birth_date"
              value={value}
              onChange={handleDateChange} // Handle date change and format
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <Button
            style={{ marginTop: "35px" }}
            className="submit-button-SignupForm"
            variant="contained"
            onClick={handleGetUserByNationalId}
          >
            استعلام
          </Button>
        </div>

        <div className="form-group-SignupForm">
          <div className="input-style-SignupForm">
            <label className="label-SignupForm">
              الاسم الكامل (بالإنجليزية)
            </label>
            <TextField
            placeholder="مثال"
              id="outlined-read-only-input"
              variant="filled"
              disabled
              value={
                userDataByNationalId
                  ? userDataByNationalId.data.full_name_en
                  : ""
              }
            />
          </div>
          <div className="input-style-SignupForm">
            <label className="label-SignupForm">الاسم الكامل (بالعربية)</label>
            <TextField
              placeholder="مثال"
              dir="rtl"
              id="outlined-read-only-input"
              variant="filled"
              disabled
              value={
                userDataByNationalId ? userDataByNationalId.data.full_name : ""
              }
            />
          </div>
          <div className="input-style-SignupForm">
            <label className="label-SignupForm">رقم الهوية</label>
            <TextField
            dir="rtl"
            placeholder="مثال"
              id="outlined-read-only-input"
              variant="filled"
              disabled
              value={
                userDataByNationalId ? userDataByNationalId.data.id_number : ""
              }
            />
          </div>
        </div>

        <div className="form-group-SignupForm">
          <div className="input-style-SignupForm">
            <label className="label-SignupForm">*اسم الجهة الحكومية</label>
            <TextField id="outlined-basic" variant="outlined" dir="rtl" required placeholder="ادخل"/>
          </div>
          <div className="input-style-SignupForm">
            <label className="label-SignupForm">رقم الهاتف الارضي</label>
            <TextField id="outlined-basic" variant="outlined" type="number" dir="rtl" placeholder="ادخل" />
          </div>
          <div className="input-style-SignupForm">
            <label className="label-SignupForm">
              الرقم التعريفي للجهة الحكومية
            </label>
            <TextField id="outlined-basic" variant="outlined" dir="rtl" required placeholder="587794"/>
          </div>
        </div>
      </form>
    </LocalizationProvider>
  );
}

export default SignupForm;
