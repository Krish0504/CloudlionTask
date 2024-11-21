const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const uri = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
const dbName = "jobportal";
const encryptions = require("./encryptDecrypt.js");

const ApplicantDetailsService = async (req, res) => {
  try {
    await client.connect();

    const db = client.db(dbName);
    const userName = req.fileds.username;
    const email = req.fileds.email;
    const password = req.fileds.password;

    const pdfFiles = {
      resume: req.resume,
      certificate: req.certificate,
    };

    const applicantInfo = await db
      .collection("userDetails")
      .findOne({ userName });

    if (applicantInfo !== null && applicantInfo.email === email && applicantInfo.rejectdate == null) {
      return (res = { status:400,message: "User already exists", data: null });
    }

    if (applicantInfo !== null && applicantInfo.userName === userName) {
      return (res = { status:400,message: "choose other username", data: null });
    }

    if (applicantInfo == null || applicantInfo==undefined) {
      //encrypt password
      const saltRounds = 10;
     
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const document = {
        userName: userName,
        passWord: hashedPassword,
        role: "applicant",
        active: true,
        email: email,
        rejectdate: "null",
      };

      const insertUser = await db.collection("userDetails").insertOne(document);

      if (!insertUser) {
        return (res = {
          status: 500,
          message: "unexpected error occured while creating the user",
          data: null,
        });
      }

      if (insertUser && insertUser.insertedId) {
        const pdfEncrypted = encryptions.encryptFiles(pdfFiles);
        const applicantDetails = {
          id: insertUser.insertedId,
          pronoun: req.fileds.pronoun,
          fullName: req.fileds.fullName,
          dob: req.fileds.dob,
          contactNumber: req.fileds.contactNumber,
          email: req.fileds.email,
          addressLine1: req.fileds.addressLine1,
          addressLine2: req.fileds.addressLine2,
          city: req.fileds.city,
          state: req.fileds.state,
          country: req.fileds.country,
          pin: req.fileds.pin,
          permanentAddressLine1: req.fileds.permanentAddressLine1,
          permanentAddressLine2: req.fileds.permanentAddressLine2,
          permanentCity: req.fileds.permanentCity,
          permanentState: req.fileds.permanentState,
          permanentCountry: req.fileds.permanentCountry,
          permanentPin: req.fileds.permanentPin,
          resume: pdfEncrypted.resume,
          certificate: pdfEncrypted.certificate,
          isAddressSame: req.fileds.isAddressSame,
          isRejected :false
        };

        const insertNewApplicant = await db
          .collection("applicantDetails")
          .insertOne(applicantDetails);

        if (!insertNewApplicant || insertNewApplicant == null) {
          await collection.deleteOne({ _id: insertUser.insertedId });
          return (res = {
            status: 500,
            message: "Error occured while creating the user try again",
            data: null,
          });
        }

        if (insertNewApplicant != null && insertNewApplicant != undefined) {
          if (insertNewApplicant.acknowledged == true) {
            return (res = {
              status: 200,
              message: "User Created successfully",
              data: insertNewApplicant,
            });
          } else {
            return (res = {
              status: 500,
              message: "Error occured while creating the user try again",
              data: null,
            });
          }
        } else {
          return (res = {
            status: 500,
            message: "Error occured while creating the user try again",
            data: null,
          });
        }
      }
    }
    
  } catch (error) {
    res = { status: 500, message: "Server Error", error: error.message };
  } finally {
    await client.close();
  }
};

module.exports = { ApplicantDetailsService };
