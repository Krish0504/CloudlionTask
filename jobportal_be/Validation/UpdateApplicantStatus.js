const service = require('../Service/UpdateApplicantStatus.js');

const UpdateStatusValidate= async (req, res) => {
    
    try {
      const { userId } = req;
  
      if (!userId) {
       return res= { 
          status:400,
          message: "Bad Request, UserId missing" ,
          data:null
        };
      }

  
      const result = await service.UpdateStatusService(userId);

  
      if(!result || result==undefined || result==null){
        return res={status:500, 
            message: "something went wrong" ,
          };
      }

      return res = result;
  
    } catch (error) {
      return res={status:500, 
        error: error.message 
      };
    }
  };
  

module.exports={UpdateStatusValidate}
    


