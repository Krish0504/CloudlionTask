const { MongoClient,ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const uri ="mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
const dbName = "jobportal";


const UpdateStatusService = async (req, res) => {
    try {

        await client.connect();

        const db = client.db(dbName);

        const userId = new ObjectId(req);

        const currentDate = new Date();

        const result = await db.collection("userDetails").updateOne({ "_id": userId} , { $set: { "active": false,"rejectdate":currentDate }});

if (!result || result == null || result == undefined) {
    return (res = {
      status: 500,
      message: "something went wrong",
      data: null,
    });
  }

  if(result.acknowledged == true && result.modifiedCount == 0){
    return (res = {
        status: 400,
        message: "Updation failed for the applicant",
      }); 
  }
  if(result.acknowledged == true && result.modifiedCount != 0){
    return (res = {
        status: 200,
        message: "Updation Success",
      }); 
  }    

    } catch (error) {

        console.error("Error retrieving applicant data:", error.message);
        res={status:500, message: "Server Error", error: error.message };
    } finally {
        await client.close();
    }
};

module.exports={UpdateStatusService}
