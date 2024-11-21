import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/style.css";
import User from "../Images/userImage.png";
import {getUserId} from './Services/apiCalls.js';

export default function LoginPage() {

  const [inputValues,setInputValues] = useState({userName:"",password:""});
  const [error, setError] = useState({errorId:"",errorString:""});
  const navigate = useNavigate();
  
  const onInputChange = (e) => {
    if(e.target.id=="userName"){
      const newUsername = e.target.value;
      setInputValues({...inputValues,userName:newUsername});
      validateUsername(newUsername); 
    }

    if(e.target.id=="passWord"){
      const newPassword = e.target.value;
      setInputValues({...inputValues,password:newPassword});
      validatePassword(newPassword);
    }
    
  };

  

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/; 
    if (!username || !usernameRegex.test(username)) {
      setError({errorId:"nameErr",errorString:"Username cannot be empty or contain special characters."});
      return false;
    } else {
      setError({errorId:"",errorString:""});
      return true;
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;
    if (!password || !passwordRegex.test(password)) {
      setError({errorId:"passErr",errorString:"Password must be at least 12 characters long, and contain uppercase, lowercase, a number, and a special character."});
      return false;
    } else {
      setError({errorId:"",errorString:""});
      return true;
    }
  };

  function onLogin(){
    if (validatePassword(inputValues.password) && validateUsername(inputValues.userName) ){
      const req={userName:inputValues.userName,passWord:inputValues.password};
      getUserId(req).then((res) => 
        {

          if(res.status ==200 && res.data==null){
            setError({errorId:"loginErr",errorString:res.message});
          }
          if(res.status ==200 && res.data!==null && res.data.role == "admin"){
            const navigateUrl = `/review`;
            navigate(navigateUrl);
          }
          if(res.status ==200 && res.data!==null && res.data.role == "applicant"){
            if(res.data.active==true){
            const navigateUrl = `/registration/${res.data._id}/${res.data.role}`;
            navigate(navigateUrl);}
            if(res.data.active == false){
              setError({errorId:"loginErr",errorString:"Your application got rejected,please Register to continue"});
            }
            
          }
          
          
        })

    }
    else{
      setError({errorId:"loginErr",errorString:"Username Or Password is invalid"});
    }
  }

  function onRegister(){
    navigate("/registration");
  }

  return (
    <>
      <main>
        <div className="card cardWidth">
          <div className="card-body">
            <div className="d-flex justify-content-center">
              <img src={User} alt="userImage" className="userImage" />
            </div>
            {/* Username */}
            <label className="form-label alignText">Username</label>
            <input type="text" className="form-control" value={inputValues.userName} onChange={onInputChange} id="userName"/>
            {error.errorId=="nameErr" ? <div className="text-danger w-75 p-1">{error.errorString}</div>:<div></div>}
            
            {/* Password */}
            <label className="form-label">password</label>
            <input type="password" className="form-control" value={inputValues.password} onChange={onInputChange} id="passWord"/>
            {error.errorId=="passErr" ? <div className="text-danger text-wrap">{error.errorString}</div>:<div></div>}

            <div className="d-flex justify-content-center">
              <button className="btn btn-primary mt-4" onClick={onLogin}> Login </button>
            </div>
            {error.errorId=="loginErr" ? <div className="text-danger text-wrap">{error.errorString}</div>:<div></div>}

            <div className="mt-4">
              <label className="form-label mt-1">New to Job Portal?</label>{" "}
              <button className="btn btn-success" onClick={onRegister}>Click to Register</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
