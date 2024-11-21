const decryption = require("../Service/encryptDecrypt.js");

const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const uri = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
const dbName = "jobportal";

const GetAllApplicantsService = async (res) => {
  try {
    await client.connect();

    const db = client.db(dbName);


    const result = await db.collection("userDetails").find({active:true,role:"applicant"}).toArray();

    if (!result || result == null || result == undefined) {
      return (res = {
        status: 500,
        message: "unable to fetch data",
        data: null,
      });
    }

    if(result.length == 0){
        return (res = {
            status: 200,
            message: "No active applicants",
            data: [],
          }); 
    }

    
    return (res = {
      status: 200,
      message: "successfully fetched the Data",
      data: result,
    });
  } catch (error) {
    console.error("Error retrieving applicant data:", error.message);
    return (res = {
      status: 500,
      message: "Server Error",
      error: error.message,
    });
  } finally {
    await client.close();
  }
};

module.exports = { GetAllApplicantsService };
