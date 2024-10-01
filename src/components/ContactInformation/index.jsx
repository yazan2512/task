import { useState, useEffect } from "react";
import apiCLient from "../../API/apiCLient";
import OTPVerification from "../OTPVerification";
import correct from "../../Icons/correct.png";
import "./ContactInformation.css";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

function ContactInformation({
  setCheckPhone,
  setCheckEmail,
  setDataInfoConPhone,
  setDataInfoConEmail,
}) {
  const [verification_code_phone, setVerificationCodePhone] = useState("");
  const [verification_code_email, setVerificationCodeEmail] = useState("");
  const [checkAlertPhone, setCheckAlertPhone] = useState("none");
  const [checkAlertEmail, setCheckAlertEmail] = useState("none");
  const [action, setAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    phone: "",
    email: "",
    countryCode: "",
  });
  useEffect(() => {
    if (!action && verification_code_phone) {
      setVerificationCodePhone("");
    } else if (!action && verification_code_email) {
      setVerificationCodeEmail("");
    }
  }, [action, verification_code_phone, verification_code_email]);
  useEffect(() => {
    if (verification_code_phone) {
      setDataInfoConPhone(data.phone);
    }
  }, [verification_code_phone, data.phone, setDataInfoConPhone]);

  useEffect(() => {
    if (verification_code_email) {
      setDataInfoConEmail(data.email);
    }
  }, [verification_code_email, data.email, setDataInfoConEmail]);

  useEffect(() => {
    if (checkAlertPhone !== "none") {
      setCheckPhone(checkAlertPhone);
    }
  }, [checkAlertPhone, setCheckPhone]);

  useEffect(() => {
    if (checkAlertEmail !== "none") {
      setCheckEmail(checkAlertEmail);
    }
  }, [checkAlertEmail, setCheckEmail]);

  useEffect(() => {
    if (verification_code_phone) {
      setAction("phone");
    } else if (verification_code_email) {
      setAction("email");
    }
  }, [verification_code_phone, verification_code_email]);

  const handleData = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendOTPToPhone = async () => {
    setIsLoading(true);
    const countryCode =
      typeof data.countryCode === "string" ? data.countryCode.trim() : "";
    try {
      let phoneNum = data.phone.trim().startsWith("0")
        ? data.phone.slice(1)
        : data.phone.trim();

      const response = await apiCLient.users.SendOTPToPhone(
        countryCode + phoneNum
      );

      console.log("response :", response);

      // Check if response contains key and message
      if (response.key) {
        setVerificationCodePhone(response.key);
        setCheckAlertPhone("successfully");
      } else {
        setCheckAlertPhone("error");
      }
    } catch (error) {
      console.error(error);
      setCheckAlertPhone("error");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTPToEmail = async () => {
    if (!isValidEmail(data.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await apiCLient.users.SendOTPToEmail(data.email.trim());
      if (response.key) {
        setVerificationCodeEmail(response.key);
        setCheckAlertEmail("successfully");
      } else {
        setCheckAlertEmail("error");
        alert("Email not found. Please check if the email is registered.");
      }
    } catch (error) {
      console.error("Error sending OTP to email:", error);
      alert("An error occurred while sending the OTP. Please try again later.");
    }
  };

  const handleSendOTPToPhone = () => {
    if (data.phone && data.countryCode) {
      sendOTPToPhone();
    }
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendOTPToEmail = () => {
    if (data.email && isValidEmail(data.email)) {
      sendOTPToEmail();
    } else {
      alert("Please enter a valid email address.");
    }
  };
  const rendervalidVerificationPhone = () => {
    if (checkAlertPhone === "successfully") {
      return (
        <div className="alert-box_con">
          <img className="icon-warning" src={correct} alt="Correct Icon" />
          <span className="alert-text_con">
            <strong>تنبيه!</strong> تم تأكيد رقم الهاتف
          </span>
        </div>
      );
    } else {
      <FormHelperText error>
        Verification failed. Please try again.
      </FormHelperText>;
    }
  };
  const rendervalidVerificationEmail = () => {
    if (checkAlertEmail === "successfully") {
      return (
        <div className="alert-box_con">
          <img className="icon-warning" src={correct} alt="Correct Icon" />
          <span className="alert-text_con">
            <strong>تنبيه!</strong> تم تأكيد بريدك الإلكتروني
          </span>
        </div>
      );
    }
  };

  return (
    <div className="contact-form">
      <div className="title">معلومات الاتصال</div>
      <form className="form-ContactInformation">
        <div className="form-group">
          <div className="input-style">
            <label className="label-ContactInformation">*الرمز الدولي</label>
            {/* <select
              id="country-code"
              dir="rtl"
              name="countryCode"
              onChange={handleData}
              required
            >
              <option value="">اختر</option>
              <option value="+962">+962</option>
            </select> */}
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <Select
                name="countryCode"
                onChange={handleData}
                required
                inputProps={{ "aria-label": "Without label" }}
                value={data.countryCode} // Add this to control the value
              >
                <MenuItem value="">اختر</MenuItem> {/* Adjust this value */}
                <MenuItem value="+962">+962</MenuItem>{" "}
                {/* Use a string instead of a number */}
              </Select>
            </FormControl>
          </div>
          <div className="input-style">
            <label className="label-ContactInformation">*الهاتف النقال</label>
            {/* <input
              type="text"
              id="phone"
              name="phone"
              placeholder="ادخل رقم الهاتف"
              className="input-ContactInformation"
              value={data.phone}
              onChange={handleData}
              required
            /> */}
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="phone"
              type="number"
              placeholder="ادخل رقم الهاتف"
              value={data.phone}
              onChange={handleData} // Handle text input change
            />
          </div>
          <button
            type="button"
            className="verify-button"
            onClick={handleSendOTPToPhone}
            disabled={isLoading || !data.phone || !data.countryCode} // Disable button if loading or missing input
            style={{ display: "flex", alignItems: "center" }}
          >
            {isLoading ? (
              <span>Loading...</span> // This can be a spinner or text
            ) : (
              <>
                <LocalPhoneIcon />
                <span style={{ marginLeft: "10px" }}>تحقق من رقم الهاتف</span>
              </>
            )}
          </button>
          {rendervalidVerificationPhone()}
        </div>

        <div className="form-group">
          <div className="input-style">
            <label className="label-ContactInformation">
              *البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ادخل البريد الإلكتروني"
              className="input-ContactInformation"
              value={data.email}
              onChange={handleData}
              required
            />
          </div>
          <button
            type="button"
            className="verify-button"
            onClick={handleSendOTPToEmail}
            style={{ display: "flex", alignItems: "center" }} // Added flexbox styling
          >
            <EmailIcon />
            <span style={{ marginLeft: "10px" }}>
              تحقق من البريد الإلكتروني
            </span>
          </button>
          {rendervalidVerificationEmail()}
        </div>
        {action && (
          <div className="OTPCheck">
            <OTPVerification
              setAction={setAction}
              Resend={action === "phone" ? sendOTPToPhone : sendOTPToEmail}
              keys={
                action === "phone"
                  ? verification_code_phone
                  : verification_code_email
              }
              data={data}
              action={action}
              setCheckAlertPhone={setCheckAlertPhone}
              setCheckAlertEmail={setCheckAlertEmail}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default ContactInformation;
