const service = require('../Service/RegisterApplicant.js');

const ApplicantDetailsValidate = async (req,res) => {
    try {

      const {
        pronoun,
        fullName,
        dob,
        contactNumber,
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        pin,
        permanentAddressLine1,
        permanentAddressLine2,
        permanentCity,
        permanentState,
        permanentCountry,
        permanentPin,
        username,
        password,
        isAddressSame,
      } = req.fields;

      const {resume, certificate}= req.files;

      // functions for validations
      const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== "";
      const isValidDateFormat = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
      const isValidDate = (value) => {
        if (!isValidDateFormat(value)) return false;
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(`${year}-${month}-${day}`);
        return (
          date.getFullYear() === year &&
          date.getMonth() + 1 === month &&
          date.getDate() === day
        );
      };
      const isValidPinCode = (value) => /^[0-9]{6}$/.test(value);
      const isValidContactNumber = (value) => /^[0-9]{10}$/.test(value);
      const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isValidPDF = (file) => file && file[0].mimetype === "application/pdf";
  
      // Validate each field
      if (!isNonEmptyString(pronoun)) return { status: 400, message: "Pronoun is required and must be a non-empty string.", data: null };
      if (!isNonEmptyString(fullName)) return { status: 400, message: "Full name is required and must be a non-empty string.", data: null };
      if (!isValidDate(dob)) return { status: 400, message: "Date of birth must be in the format yyyy/mm/dd and valid.", data: null };
      if (!isValidContactNumber(contactNumber)) return { status: 400, message: "Contact number must be a 10-digit number.", data: null };
      if (!isValidEmail(email)) return { status: 400, message: "Email must be a valid email address.", data: null };
      if (!isNonEmptyString(addressLine1)) return { status: 400, message: "Address Line 1 is required and must be a non-empty string.", data: null };
      if (!isNonEmptyString(city)) return { status: 400, message: "City is required and must be a non-empty string.", data: null };
      if (!isNonEmptyString(state)) return { status: 400, message: "State is required and must be a non-empty string.", data: null };
      if (!isNonEmptyString(country)) return { status: 400, message: "Country is required and must be a non-empty string.", data: null };
      if (!isValidPinCode(pin)) return { status: 400, message: "Pin code must be a 6-digit number.", data: null };
      if (!isNonEmptyString(permanentAddressLine1)) return { status: 400, message: "Permanent Address Line 1 is required and must be a non-empty string.", data: null };
      if (!isNonEmptyString(permanentCity)) return { status: 400, message: "Permanent City is required and must be a non-empty string.", data: null };
      if (!isNonEmptyString(permanentState)) return { status: 400, message: "Permanent State is required and must be a non-empty string.", data: null };
      if (!isNonEmptyString(permanentCountry)) return { status: 400, message: "Permanent Country is required and must be a non-empty string.", data: null };
      if (!isValidPinCode(permanentPin)) return { status: 400, message: "Permanent Pin code must be a 6-digit number.", data: null };
      if (!isValidPDF(resume)) return { status: 400, message: "Resume must be a valid PDF file.", data: null };
      if (!isValidPDF(certificate)) return { status: 400, message: "Certificate must be a valid PDF file.", data: null };
  
      // Validate username and password
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(username)) return res= { status: 400, message: "Username must contain only letters and numbers.", data: null };
  
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;
      if (!passwordRegex.test(password)) {
        return res= {
          status: 400,
          message: "Password must be at least 12 characters long, contain uppercase, lowercase letters, a number, and a special character.",
          data: null,
        };
      }
  
const request ={
    fileds:req.fields,
    resume:resume[0],
    certificate:certificate[0]
}

      const result = await service.ApplicantDetailsService(request);

      if(!result || result==undefined || result==null){
        return res ={status:500, message:"something went wrong",data:null}
      }
  
        return res={
          status: result.status,
          message: result.message,
          data: result.data,
        };
      
  
    
    } catch (error) {
      return res={
        status: 500,
        message: "An error occurred during validation.",
        error: error.message,
      };
    }
  };
    

module.exports={ApplicantDetailsValidate}
    


