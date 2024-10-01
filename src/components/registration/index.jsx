import { useState } from 'react';
import apiCLient from "../../API/apiCLient";
import SignupForm from "../SignupForm";
import ContactInformation from "../ContactInformation";
import UploadDocument from "../UploadDocument";
import './Registration.css';

const Registration = () => {
  const [checkPhone, setCheckPhone] = useState('successfully');
  const [checkEmail, setCheckEmail] = useState('successfully');
  const [checkUploadFile, setCheckUploadFile] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [dataInfoConPhone, setDataInfoConPhone] = useState('');
  const [dataInfoConEmail, setDataInfoConEmail] = useState('');

  const reg = async () => {
    try {
      const dataRegister = await apiCLient.users.register(
        dataUser.id,
        dataUser.user_profile_type_id,
        dataInfoConPhone,
        dataInfoConEmail
      );
      console.log('Registration Successful:', dataRegister);
    } catch (error) {
      console.error('Error registering user:', error);
      alert("User registration failed");
    }
  };

  const handleCreate = () => {
    if (dataUser && checkPhone==='successfully' && checkEmail==='successfully' && checkUploadFile) {
      reg();  
    } else {
      alert("Please complete all steps before creating an account.");
    }
  };

  return (
    <div className="registration">
      <div className="top_page"></div>
      <h3 className="h3-registration">تسجيل جهة حكومية</h3>
      <p className="p-registration">يرجى ملء المعلومات الآتية للتسجيل</p>
      <div className="content-registration">
        <div className='title-registration'>تسجيل حساب جهة حكومية</div>
        <SignupForm setDataUser={setDataUser} />
        <ContactInformation
          setCheckPhone={setCheckPhone}
          setCheckEmail={setCheckEmail}
          setDataInfoConPhone={setDataInfoConPhone}
          setDataInfoConEmail={setDataInfoConEmail}
        />
        <UploadDocument 
        uploaded={(dataUser && checkPhone==='successfully' && checkEmail==='successfully') ? true : false } 
        setCheckUploadFile={setCheckUploadFile}
        />
      </div>
      <div className="all-button">
        <button
          type="button"
          className="button-exit"
          onClick={() => console.log('Exit clicked')} 
        >
          خروج
        </button>
        <button
          type="button"
          className="button-create"
          onClick={handleCreate}
        >
          انشاء حساب
        </button>
      </div>
    </div>
  );
};

export default Registration;
