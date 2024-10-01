import { useState ,useEffect } from 'react';
import apiCLient from "../../API/apiCLient";
import warning from "../../Icons/warning.png";
import correct from "../../Icons/correct.png";
import './OTPVerification.css';
const OTPVerification = ({ setAction, Resend, keys, data, action, setCheckAlertPhone, setCheckAlertEmail }) => {
  const [code, setCode] = useState('');
  const [dataVerifyPhone, setDataVerifyPhone] = useState('');
  const [dataVerifyEmail, setDataVerifyEmail] = useState('');
  const [timer, setTimer] = useState(298);

  const title = action === 'phone' ? "تأكيد رقمك" : "تأكيد بريدك الإلكتروني";
  const actionEnterCode = code || !timer ? "اعد ارسال الرمز" : "حاول مجدداً";
  
  const button1Style = {
    backgroundColor: code ? '#004a99' : '#ccc',
  };
  
  const button3Style = {
    backgroundColor: timer ? '#ccc' : '#004a99',
  };
  
  const timerStyle = {
    marginBottom: (dataVerifyPhone === "Invalid" || dataVerifyEmail === "Invalid") ? '0px' : '70px',
  };
  
  const notFoundInputStyle = {
    color: (dataVerifyPhone === "Invalid" || dataVerifyEmail === "Invalid") ? 'red' : 'inherit',
    border: (dataVerifyPhone === "Invalid" || dataVerifyEmail === "Invalid") ? '1px solid red' : 'inherit',
  };
 
  const colorCorrect = {
    color: (dataVerifyPhone === "successfully" || dataVerifyEmail === "successfully") && '#83ff00' 
  }

  const coloeBorderCorrect = {
    border: (dataVerifyPhone === "Invalid" || dataVerifyEmail === "Invalid") & '1px solid #83ff00' 
  }

  useEffect(() => {
    if (dataVerifyPhone) {
      setCheckAlertPhone(dataVerifyPhone === "Invalid" ? "Invalid" : "successfully");
    }
  }, [dataVerifyPhone, setCheckAlertPhone]);

  useEffect(() => {
    if (dataVerifyEmail) {
      setCheckAlertEmail(dataVerifyEmail === "Invalid" ? "Invalid" : "successfully");
    }
  }, [dataVerifyEmail, setCheckAlertEmail]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const verifyCodePhone = async () => {
    try {
      await apiCLient.users.verifyCodePhone(keys.trim(), code.trim());
      setDataVerifyPhone('successfully');
    } catch (error) {
      setDataVerifyPhone('Invalid');
    }
  };

  const verifyCodeEmail = async () => {
    try {
      await apiCLient.users.verifyCodeEmail(keys.trim(), code.trim());
      setDataVerifyEmail('successfully');
    } catch (error) {
      setDataVerifyEmail('Invalid');
    }
  };

  const handelVerification = () =>{
    action==='phone' ? verifyCodePhone() :  verifyCodeEmail() ;
   }
  const handelClose  = () => {
    setAction('');
  }
  const handelResend = () =>{
   !timer && Resend();
  }
  const renderInvalidVerification = () => {
    if (dataVerifyPhone === "Invalid" || dataVerifyEmail === "Invalid") {
      return (
        <div className="alert-box">
          <img className="icon-warning" src={warning} alt="Warning Icon" />
          <span className="alert-text">
            <strong>تنبيه!</strong> رقم التأكيد غير صحيح
          </span>
        </div>
      );
    } else if (dataVerifyPhone === "successfully") {
      return (
        <div className="alert-box" style={coloeBorderCorrect}>
          <img className="icon-warning" src={correct} alt="Correct Icon" />
          <span className="alert-text" style={colorCorrect}>
            <strong>تنبيه!</strong> تم تأكيد رقم الهاتف
          </span>
        </div>
      );
    } else if (dataVerifyEmail === "successfully") {
      return (
        <div className="alert-box" style={coloeBorderCorrect}>
          <img className="icon-warning" src={correct} alt="Correct Icon" />
          <span className="alert-text"style={colorCorrect}>
            <strong>تنبيه!</strong> تم تأكيد بريدك الإلكتروني
          </span>
        </div>
      );
    }
  };

  const renderButtons = () => {
    if (action === 'phone') {
      if (dataVerifyPhone === "successfully") {
        return (
          <div className="otp-buttons">
            <button className="otp-button4" onClick={handelClose}>الصفحة الرئيسية</button>
            <button className="otp-button1" disabled>التحقق من الصحة</button>
          </div>
        );
      } else {
        return (
          <div className="otp-buttons">
            <button className="otp-button1" style={button1Style} onClick={handelVerification}>التحقق من الصحة</button>
            <button className="otp-button2" onClick={handelClose}>السابق</button>
            <button className="otp-button3" style={button3Style} onClick={handelResend}>أعد إرسال الرمز</button>
          </div>
        );
      }
    } else {
      return (
        <div className="otp-buttons">
          <button className="otp-button1" style={button1Style} onClick={handelVerification}>التحقق من الصحة</button>
          <button className={dataVerifyEmail === "successfully" ? "otp-button4" : "otp-button2"} onClick={handelClose}>
            {dataVerifyEmail === "successfully" ? 'الصفحة الرئيسية' : 'السابق'}
          </button>
          <button className="otp-button3" style={button3Style} onClick={handelResend}>أعد إرسال الرمز</button>
        </div>
      );
    }
  };

  return (
    <div className="otp-container">
      <h2 className="otp-title">{title}</h2>
      <hr />
      {!(dataVerifyPhone === "successfully") && !(dataVerifyEmail === "successfully")
      &&  
      (
        <>
          <p className="otp-instruction">
            <span className="otp-phone">{action === 'phone' ? '0' + data.phone.slice(0, 3) + 'xxxxxxx' : data.email}</span> : ادخل الرمز الذي ارسلناه للتو الى
          </p>
          <input
            type="text"
            name='code'
            placeholder="أدخل الرمز"
            className="otp-input"
            style={notFoundInputStyle}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <p className="otp-timer" style={timerStyle}>
            لم يصلك الرمز؟ انتظر بضع دقائق <span className="otp-countdown">{formatTime(timer)}</span> و  <span h className="otp-resend" >{actionEnterCode}</span>
          </p>
        </>
      )
      }
      {renderInvalidVerification()}
      {renderButtons()}
    </div>
  );
};

export default OTPVerification;
