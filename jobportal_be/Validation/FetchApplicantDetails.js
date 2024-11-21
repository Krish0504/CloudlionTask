const service = require('../Service/FetchApplicantDetails.js');


const FetchApplicantValidate = async (req, res) => {
    
    try {
  
      if (!req || !req.userId) {
       return res= { 
          status:400,
          message: "Invalid Request" ,
          data:null
        };
      }
  
      
      const result = await service.FetchApplicantService(req);

      if(!result || result==null || result==undefined){
        return res={status:500, message:"something went wrong",data:null}
      }

      return res={
        status: result.status,
        message: result.message,
        data: result.data,
      };
  
    } catch (error) {
      return res={status:500, 
        error: error.message 
      };
    }
  };
  

module.exports={FetchApplicantValidate}
