const service = require('../Service/GetApplicantId.js');

const GetApplicantIdValidate = async (req, res) => {
    
    try {
      const { userName, passWord } = req;
  
      if (!userName || !passWord) {
       return res= { 
          status:400,
          message: "Both username and password are required." ,
          data:null
        };
      }
  
      const userNameRegex = /^[a-zA-Z0-9]+$/;
      if (!userNameRegex.test(userName)) {
        return res={ 
          status: 400, 
          message: "Username must contain only letters and numbers." ,
          data:null
        };
      }
  
      const passWordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;
      if (!passWordRegex.test(passWord)) {
        return res={ 
          status: 400, 
          message: "Password must be at least 12 characters long, contain uppercase, lowercase letters, a number, and a special character." ,
          data:null
        };
      }
  
      const result = await service.GetApplicantIdService({ userName, passWord });

  
      if (result.data==null) {
        return res={ 
          status: 400, 
          message: result.message , 
          data:null
        };
      }
  
      return res={ 
        status: 200, 
        message: "User validated successfully", 
        data: result.data 
      };
  
    } catch (error) {
      return res={status:500, 
        error: error.message 
      };
    }
  };
  

module.exports={GetApplicantIdValidate}
    


