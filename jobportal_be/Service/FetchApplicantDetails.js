const decryption = require("../Service/encryptDecrypt.js");

const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const uri = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
const dbName = "jobportal";

const FetchApplicantService = async (req, res) => {
  try {

    await client.connect();

    const db = client.db(dbName);
    const id = req.userId;

    const userId = new ObjectId(id);

    const result = await db
      .collection("applicantDetails")
      .findOne({ id: userId });

    if (!result || result == null || result == undefined) {
      return (res = {
        status: 400,
        message: "unable to fetch data",
        data: null,
      });
    }

    const encryptedResume = result.resume;
    const encryptedCertificate = result.certificate;

    const respData = {
      pronoun: result.pronoun,
      fullName: result.fullName,
      dob: result.dob,
      contactNumber: result.contactNumber,
      email: result.email,
      addressLine1: result.addressLine1,
      addressLine2: result.addressLine2,
      city: result.city,
      state: result.state,
      country: result.country,
      pin: result.pin,
      permanentAddressLine1: result.permanentAddressLine1,
      permanentAddressLine2: result.permanentAddressLine2,
      permanentCity: result.permanentCity,
      permanentState: result.permanentState,
      permanentCountry: result.permanentCountry,
      permanentPin: result.permanentPin,
      isAddressSame: result.isAddressSame,
      resume: {
        decryptedFileBuffer: decryption.decryptFiles(
          encryptedResume.encryptedFile,
          encryptedResume.iv,
          encryptedResume.secretKey
        ),
      },
      certificate: {
        decryptedFileBuffer: decryption.decryptFiles(
          encryptedCertificate.encryptedFile,
          encryptedCertificate.iv,
          encryptedCertificate.secretKey
        ),
      },
    };

    return (res = {
      status: 200,
      message: "successfully fetched the user",
      data: respData,
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

module.exports = { FetchApplicantService };
