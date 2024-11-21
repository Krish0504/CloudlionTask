const service = require('../Service/GetAllApplicants');


const GetAllApplicantValidate = async (res) => {
    
    try {
  
      const result = await service.GetAllApplicantsService();

      if(!result || result==null || result==undefined){
        return res={status:500, message:"unable to fecth data",data:null}
      }

      if(result.data.length==0){
        return res={status:200, message:"No active applicants",data:null}
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
  

module.exports={GetAllApplicantValidate}
