import React, { useState, useEffect } from "react";
import "../Styles/style.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateUserDetails,
  fetchApplicantDetails,
  changeApplicantStatus
} from "./Services/apiCalls.js";
import PopUp from "./PopUp.js";
import DownloadLink from "./DownloadLink.js";
import HeaderComponent from "./Header.js";

export default function Registration() {
  const { id, role } = useParams();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const [error, setError] = useState({
    pronoun: false,
    fullName: false,
    contactNumber: false,
    email: false,
    pin: false,
    permanentPin: false,
    resume: false,
    certificate: false,
    password: false,
    username:false
  });

  const [userError, setUserError] = useState("");

  const [formData, setFormData] = useState({
    pronoun: "",
    fullName: "",
    dob: "",
    contactNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    permanentAddressLine1: "",
    permanentAddressLine2: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permanentPin: "",
    resume: null,
    certificate: null,
    username: "",
    password: "",
    isAddressSame: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const [navigateUrl,setNavigateUrl]=useState({url:"",type:"submit"});

  useEffect(() => {
    if (id) {
      setIsEditMode(true);

      fetchApplicantDetails({ userId: id })
        .then((res) => {
          if (!res || res.status == 500) {
            setUserError(res.message);
          }

          if (res.status == 400) {
            setUserError(res.message);
          }

          if (res.status == 200) {
            const respData = res.data;

            setFormData({
              pronoun: respData.pronoun,
              fullName: respData.fullName,
              dob: respData.dob,
              contactNumber: respData.contactNumber,
              email: respData.email,
              addressLine1: respData.addressLine1,
              addressLine2: respData.addressLine2,
              city: respData.city,
              state: respData.state,
              country: respData.country,
              pin: respData.pin,
              permanentAddressLine1: respData.permanentAddressLine1,
              permanentAddressLine2: respData.permanentAddressLine2,
              permanentCity: respData.permanentCity,
              permanentState: respData.permanentState,
              permanentCountry: respData.permanentCountry,
              permanentPin: respData.permanentPin,
              resume: respData.resume,
              certificate: respData.certificate,
              username: respData.username,
              password: null,
              isAddressSame: respData.isAddressSame,
            });
          }
        })
        .catch((err) => {
          console.error("Error submitting the form:", err);
        });
    } else {
      setIsEditMode(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked, files } = e.target;

    setFormData({ ...formData, [name]: value });
    

    // Validate Pronoun
    if (
      name === "pronoun" &&
      ["mr", "mrs", "miss"].includes(value.toLowerCase())
    ) {
      setError({ ...error, [name]: false });
    } else if (name === "pronoun") {
      setError({ ...error, [name]: true });
    }

    // Validate Full Name
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (name === "fullName" && nameRegex.test(value.trim())) {
      setError({ ...error, [name]: false });
    } else if (name === "fullName") {
      setError({ ...error, [name]: true });
    }

    // Validate Contact Number
    const phoneRegex = /^\d{10}$/;
    if (name === "contactNumber" && phoneRegex.test(value)) {
      setError({ ...error, [name]: false });
    } else if (name === "contactNumber") {
      setError({ ...error, [name]: true });
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === "email" && emailRegex.test(value)) {
      setError({ ...error, [name]: false });
    } else if (name === "email") {
      setError({ ...error, [name]: true });
    }

    // Validate PIN
    const pinRegex = /^\d{6}$/;

    if ((name === "pin" || name === "permanentPin") && pinRegex.test(value)) {
      setError({ ...error, [name]: false });
    } else if (name === "pin" || name === "permanentPin") {
      setError({ ...error, [name]: true });
    }

    if (name === "isAddressSame") {
      // If checkbox is checked, copy current address to permanent address
      if (checked) {
        setFormData((prevState) => ({
          ...prevState,
          isAddressSame: true,
          permanentAddressLine1: prevState.addressLine1,
          permanentAddressLine2: prevState.addressLine2,
          permanentCity: prevState.city,
          permanentState: prevState.state,
          permanentCountry: prevState.country,
          permanentPin: prevState.pin,
        }));
      } else {
        // If unchecked, clear permanent address fields
        setFormData((prevState) => ({
          ...prevState,
          isAddressSame: false,
          permanentAddressLine1: "",
          permanentAddressLine2: "",
          permanentCity: "",
          permanentState: "",
          permanentCountry: "",
          permanentPin: "",
        }));
      }
    }

    if (name === "resume" || name === "certificate") {
      const file = files[0];
      if (file) {
        const isPdf = file.type === "application/pdf";
        if (isPdf) {
          setFormData({ ...formData, [name]: file });
          setError({ ...error, [name]: false });
        } else {
          setError({ ...error, [name]: true });
        }
      }
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/; 
    if (name=="username" && usernameRegex.test(value)) {
      setError({ ...error, [name]: false });
      
    } else if (name === "username") {
      setError({ ...error, [name]: true });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;
    if (name === "password" && passwordRegex.test(value)) {
      setError({ ...error, [name]: false });
    } else if (name === "password") {
      setError({ ...error, [name]: true });
    }
  };

  const validateForm = () => {
    const {
      fullName,
      dob,
      contactNumber,
      email,
      addressLine1,
      city,
      state,
      country,
      pin,
      permanentAddressLine1,
      permanentCity,
      permanentState,
      permanentCountry,
      permanentPin,
      username,
      password,
    } = formData;
    const isValid =
      fullName &&
      dob &&
      contactNumber &&
      email &&
      addressLine1 &&
      city &&
      state &&
      country &&
      pin &&
      permanentAddressLine1 &&
      permanentCity &&
      permanentState &&
      permanentCountry &&
      permanentPin &&
      username &&
      password;

    const isError = Object.values(error).every((value) => value === false);
    setIsFormValid(isValid && isError);
  };

  useEffect(() => {
    validateForm();
  }, [formData, error]);

  function handleSubmit() {
    const req = formData;
    // Send the form data via the API call
    updateUserDetails(req)
      .then((res) => {
        if (
          !res ||
          res == undefined ||
          res == null ||
          res.status == 500 ||
          res.status == 400
        ) {
          setUserError(res.message);
        } else {
          setUserError("");
          setNavigateUrl({...navigateUrl,url:"/",type:"submit"});
          setShowPopup(true);
        }
      })
      .catch((err) => {
        console.error("Error submitting the form:", err);
      });
  }

const handleReject=()=>{
  const req={userId: id};
  changeApplicantStatus(req)
      .then((res) => {

        if (
          !res ||
          res == undefined ||
          res == null ||
          res.status == 500 ||
          res.status == 400
        ) {
          setUserError(res.message);
        } else {
          setUserError("");
          setNavigateUrl({...navigateUrl,url:"/review",type:"reject"});
          setShowPopup(true);
        }
      })
      .catch((err) => {
        console.error("Error submitting the form:", err);
      });
}

  return (
    <div className={`login-container ${showPopup ? "disabled-overlay" : ""}`}>
      <HeaderComponent id={id} role={role} page="registration" name={formData.fullName}/>
      {!showPopup && (
        
        <section>
          <div className="container">
            <h2 className="text-center">
              {!id ? "Please Fill Out the details" : "Applicant Details"}
            </h2>

            {/* Pronoun */}
            <div className="input-group mt-3">
              <span className="input-group-text">Pronoun</span>
              <input
                type="text"
                className="form-control"
                name="pronoun"
                value={formData.pronoun}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            {error.pronoun ? (
              <div className="text-danger mt-1">
                The Pronoun should be Mr/Mrs/Miss
              </div>
            ) : (
              <div>{""}</div>
            )}

            {/* Full Name */}
            <div className="input-group mt-3">
              <span className="input-group-text">Full Name</span>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            {error.fullName ? (
              <div className="text-danger mt-1">Enter a valid Name</div>
            ) : (
              <div>{""}</div>
            )}

            {/* DOB */}
            <div className="input-group mt-3">
              <span className="input-group-text">DOB</span>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>

            {/* Contact Number */}
            <div className="input-group mt-3">
              <span className="input-group-text">Contact Number</span>
              <input
                type="text"
                className="form-control"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            {error.contactNumber ? (
              <div className="text-danger mt-1">
                Enter a valid contactNumber
              </div>
            ) : (
              <div>{""}</div>
            )}

            {/* Email */}
            <div className="input-group mt-3">
              <span className="input-group-text">Email</span>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            {error.email ? (
              <div className="text-danger mt-1">Enter a valid email</div>
            ) : (
              <div>{""}</div>
            )}

            {/* Current Address */}
            <label className="mt-3">Current address</label>
            <div className="input-group mt-3">
              <span className="input-group-text">Address Line1</span>
              <input
                type="text"
                className="form-control"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">Address Line2</span>
              <input
                type="text"
                className="form-control"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">City</span>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">State</span>
              <input
                type="text"
                className="form-control"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">Country</span>
              <input
                type="text"
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">Pin</span>
              <input
                type="text"
                className="form-control"
                name="pin"
                value={formData.pin}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            {error.pin ? (
              <div className="text-danger mt-1">Enter a valid pin</div>
            ) : (
              <div>{""}</div>
            )}

            {/* Address Same Checkbox */}
            {!isEditMode && (
              <div className="input-group mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="isAddressSame"
                  checked={formData.isAddressSame}
                  onChange={handleInputChange}
                />
                <label className="form-check-label">
                  Permanent address is same as current address
                </label>
              </div>
            )}

            {/* Permanent Address */}

            <label className="mt-3">Permanent address</label>
            <div className="input-group mt-3">
              <span className="input-group-text">Address Line1</span>
              <input
                type="text"
                className="form-control"
                name="permanentAddressLine1"
                value={formData.permanentAddressLine1}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">Address Line2</span>
              <input
                type="text"
                className="form-control"
                name="permanentAddressLine2"
                value={formData.permanentAddressLine2}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">City</span>
              <input
                type="text"
                className="form-control"
                name="permanentCity"
                value={formData.permanentCity}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">State</span>
              <input
                type="text"
                className="form-control"
                name="permanentState"
                value={formData.permanentState}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">Country</span>
              <input
                type="text"
                className="form-control"
                name="permanentCountry"
                value={formData.permanentCountry}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">Pin</span>
              <input
                type="text"
                className="form-control"
                name="permanentPin"
                value={formData.permanentPin}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>
            {error.permanentPin ? (
              <div className="text-danger mt-1">Enter a valid pin</div>
            ) : (
              <div>{""}</div>
            )}

            {!isEditMode ? (
              <>
                {/* Resume & Certificate Upload */}
                <label className="mt-3">Upload your Resume</label>
                <div className="input-group mt-3">
                  <input
                    type="file"
                    className="form-control"
                    name="resume"
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  />
                </div>
                {error.resume ? (
                  <div className="text-danger mt-1">
                    Only pdf files are allowed
                  </div>
                ) : (
                  <div>{""}</div>
                )}

                <label className="mt-3">Upload your Certificate</label>
                <div className="input-group mt-3">
                  {/* <span className="input-group-text">Upload</span> */}
                  <input
                    type="file"
                    className="form-control"
                    name="certificate"
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  />
                </div>
                {error.certificate ? (
                  <div className="text-danger mt-1">
                    Only pdf files are allowed
                  </div>
                ) : (
                  <div>{""}</div>
                )}
              </>
            ) : (
              <>
                {/* download link */}

                <DownloadLink fileBuffer={formData.resume} fileName="Resume" role={role}/>

                <DownloadLink
                  fileBuffer={formData.certificate}
                  fileName="Certificate"
                  role={role}
                />
              </>
            )}

            {!isEditMode && (
              <>
                {/* Username & Password */}
                <div className="input-group mt-3">
                  <span className="input-group-text">Username</span>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  />
                </div>
                {error.username ? (
                  <div className="text-danger mt-1">Invalid UserName</div>
                ) : (
                  <div>{""}</div>
                )}
                <div className="input-group mt-3">
                  <span className="input-group-text">Password</span>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  />
                </div>
                {error.password ? (
                  <div className="text-danger mt-1">Invalid passWord</div>
                ) : (
                  <div>{""}</div>
                )}
              </>
            )}
            <div className="text-danger">{userError}</div>

            {/* Submit Button */}
            {!id ? (
              <button
                type="submit"
                className="btn btn-primary mt-4"
                onClick={handleSubmit}
                disabled={!isFormValid || isEditMode}
              >
                Submit
              </button>
            ) : (
              <></>
            )}

            {role == "admin" ? (
              <>
                <button className="btn btn-danger m-4" onClick={handleReject}>Reject</button>
                <button className="btn btn-success m-4">Accept</button>
              </>
            ) : (
              <></>
            )}
          </div>
        </section>
      )}

      {/* Show Popup */}
      {showPopup && <PopUp okUrl={navigateUrl}/>}
    </div>
  );
}




