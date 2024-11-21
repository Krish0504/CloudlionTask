const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const uri ="mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
const dbName = "jobportal";

const GetApplicantIdService = async (req, res) => {
    try {
        const { userName, passWord } = req;

        await client.connect();

        const db = client.db(dbName);


        const applicantInfo = await db.collection("userDetails").findOne({ userName });


        if (!applicantInfo) {
            return res={message:"Invalid User",data:null};
        }

        const checkPassWord = await bcrypt.compare(passWord, applicantInfo.passWord);

        if (!checkPassWord) {
            return res={message: "Invalid password",data:null };
        }

        return res={message:"Valid User",data:applicantInfo};

    } catch (error) {

        console.error("Error retrieving applicant data:", error.message);
        res={status:500, message: "Server Error", error: error.message };
    } finally {
        await client.close();
    }
};

module.exports={GetApplicantIdService}
