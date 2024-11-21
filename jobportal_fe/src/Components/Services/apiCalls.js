import axios from "axios";


// api call, once clicked on login
export const getUserId = async (req, res) => {
  try {
    if (!req || typeof req !== "object" || !req.userName || !req.passWord) {
      return (res = { status: 400, message: "invalid Request", data: null });
    }

    const response = await axios.post("http://localhost:5000/validateUser",req);

    if (!response || !response.data) {
      return (res = { status: 500, message: "Server Error", data: null });
    }
    if (response.data.data == null) {
      return (res = {
        status: 200,
        message: response.data.message,
        data: response.data.data,
      });
    }
    if (response.data.data !== null) {
      return (res = {
        status: 200,
        message: response.data.message,
        data: response.data.data,
      });
    }

    return res;
  } catch (error) {
    throw error;
  }
};


//api call once clicked on submit

export const updateUserDetails = async (req, res) => {
  try {
    if (!req || typeof req !== "object") {
      return (res = { status: 400, message: "invalid Request", data: null });
    }

    const formData = new FormData();

  // Append each key in `formData` to the `FormData` instance
  for (const key in req) {
    if (req[key] instanceof File) {
      // Append files directly
      formData.append(key, req[key]);
    } else {
      // Convert non-file fields to strings
      formData.append(key, req[key]);
    }
  }


    const response = await axios.post("http://localhost:5000/updateUserDetails",formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });


    if (!response|| response==undefined || response==null || !response.data) {
      return res = { status: 500, message: "Server Error", data: null };
    }


      return res = {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      };
    
  } catch (error) {
    throw error;
  }
};



// api call, to get UserDetails
export const fetchApplicantDetails = async (req, res) => {
  try {
    if (!req || typeof req !== "object" || !req.userId) {
      return (res = { status: 400, message: "invalid Request", data: null });
    }

    const response = await axios.get("http://localhost:5000/fetchApplicant",{
      params: { userId: req.userId },
    });


    if (!response || response==undefined || response == null || !response.data) {
      return (res = { status: 500, message: "Server Error", data: null });
    }
    
   
      return res = {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      };
    

  } catch (error) {
    throw error;
  }
};


//get all applicants who are active 
export const getAllApplicants = async (res) => {
  try {
    const response = await axios.get("http://localhost:5000/getAllApplicants");


    if (!response || response==undefined || response == null || !response.data || response.data ==undefined || response.data ==null) {
      return (res = { status: 500, message: "Server Error", data: null });
    }

    if(!response.data){
      return res ={status :404, message :"unable to fecth data",data:null} 
    }

    
      return res = {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      };
    

  } catch (error) {
    throw error;
  }
};



export const changeApplicantStatus = async (req,res) => {

  try {
    const response = await axios.post("http://localhost:5000/updateApplicantStatus",req);

    if (!response || response==undefined || response == null) {
      return (res = { status: 500, message: "Server Error", data: null });
    }

    
      return res = {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      };
    

  } catch (error) {
    throw error;
  }
};
