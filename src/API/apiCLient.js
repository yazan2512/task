import axios from "axios";


const aps = axios.create({
  baseURL: 'https://jma.api.local.eqratech.com/api/v1', 
  headers: {
    'Content-Type': 'application/json', 
    'Accept': 'application/json, text/plain, */*',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxNCIsImp0aSI6IjU1NDQzMTkyOTIxOTgxNzQyNjU0NjAwZjhkMDc1YmRhNGI4MDkxMmMyOWViN2E2YzA3ZGUwNzIyOTJlYjFlODNkMzRhNDE4MWVhZmZhMzcxIiwiaWF0IjoxNzI3MzQxMzI3LjkwNTY1OCwibmJmIjoxNzI3MzQxMzI3LjkwNTY1OSwiZXhwIjoxNzQyOTc5NzI3Ljg4NjMxMSwic3ViIjoiNDMiLCJzY29wZXMiOlsib2ZmaWNlciJdfQ.vv0CUXJ2zHb1mf5RnTrLQxo_rz1jNIy2Chyu0KgRaI6-XTM3w9hiV5Sr-XCjllCVtkTxEnz70sxPkTinKolfmjFYCVamZZ9_OoITgI3MpsYt77k7gEzX8VWXb1yaoHxqUeAWbzQuG3aKbtkEMEUNxQY9ikmJXbk2lgsqhzWb6VorZ51No_eWziz5a4H6C7Q9uNUKCQMoey81lYue226kdfqANq-nNHgU_P3UolTEX1iV9Ai5iNfLatGdhYH6iHnpQIso6K15YKMubAYxvgekJZrLvIlVOSwI7CXPzYKfBd-0QHcGuYZD2Ay3eaZx08nh-oxFceS-Zm8yMbI22hfPTmon3IfmWHqdkKmOGNa8nXTCBLJQS3MJUFGH8pasa65yzcNu8L-0sjyqtXSVZtIaNnt7GVNImRfB10VUpQbS2jcX8E-9IK2wIfI0kJQV6iI9ectK6WKCARMOHemam8KbY5BLfeYcXGQYQfjEIJY6cqFQSlvrs_FfzwoX-f_NipxwJIGNFYY7klhVunb6Pn1Q0xvp16dZdAJBJR8RjrC9kuWpd2aQ6D4U2d_b36CU699eBQ1rdVvk_PBtaNmKypwR2JsVNCDvRkny6RMnYLdLEJYd7Uas5D2O39YZ7ilqtAE6vZ34shyJzVS398YM8S48xouw-M1xP_oY3NpKVVtVzio' 
  },
});

const apiClent = {
  users: {
    login: async () => {
      const { data } = await aps.post('/unauth/login', {
        username: 'employee2@test.com',
        password: '12345',
      }
    );
      return data;
    },
    register: async (user_profile_id, user_type_id, mobile,email) =>{
      await axios.post(
        '/officer/facility/registerGovFacility',
        {
          applicant_user_profile_id: user_profile_id,
          applicant_user_type_id: user_type_id,
          facility_name: "test",
          phone: "test",
          mobile: mobile,
          email: email,
          attachments: [
            {
              doc_type_id: 1,
              path: "facility_forms/VReT7Ty3nk6vYq0TDtBFcLKoIqFHMemIyT4LFod2.png"
            }
          ]
        }
      );
    },
    getUserByNationalId: async (national_id, birth_date, type = 1) => {
      const { data } = await aps.post('/unauth/user/getUserByNationalId', 
      {
        national_id: Number(national_id),
        birth_date: birth_date,
        type: type,
      });
      return data;
    },
    SendOTPToPhone: async (phone) => {
      const { data } = await aps.post('/unauth/verifyNonUserPhone', 
        {
        phone: phone,
        }
      );
      return data;
    },
    
    verifyCodePhone: async (verification_code, key) => {
      const { data } = await aps.post('/unauth/phone/verifyCode', {
        verification_code: verification_code,
        key: key,
      }
    );
      return data;
    },
    
    SendOTPToEmail: async (email) => {
      const { data } = await aps.post('/unauth/verifyNonUserEmail',
      {
        email: email,
      }
    );
      return data;
    },
    verifyCodeEmail: async (verification_code, code) => {
      const { data } = await aps.post('/unauth/email/verifyCode', {
        verification_code: verification_code,
        key: code,
      }
    );
      return data;
    },
    UploadFile: async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file); // Pass the file directly
    
        // Log the formData contents
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1].name}`); // Log field name and file name
        }
    
        const { data } = await aps.post('/unauth/facility/storeFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        return data; // Return the server response
      } catch (error) {
        console.error("Error uploading file:", error.response ? error.response.data : error.message);
        throw error;
      }
    },   
  },
};

export default apiClent;
