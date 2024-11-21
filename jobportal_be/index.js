const express = require("express");
const app = express();
const PORT = 5000;

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const uri = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
const dbName = "jobportal";
const getApplicantValidate = require("./Validation/GetApplicantId.js");

const updateUserValidate = require("./Validation/RegisterApplicant.js");

const fetchApplicantValidate =require ("./Validation/FetchApplicantDetails.js");

const getAllApplicantValidate = require("./Validation/GetAllApplicants.js");
const updateApplicantValidate = require("./Validation/UpdateApplicantStatus.js");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (request, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Headers", "content-type");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});

async function connect() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.collections();
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

connect();

app.post("/validateUser", async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Request body is missing.", data: null });
    }

    const request = {
      userName: req.body.userName,
      passWord: req.body.passWord,
    };

    const result = await getApplicantValidate.GetApplicantIdValidate(request);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error: err.message,
    });
  }
});

app.post(
  "/updateUserDetails",upload.fields([{ name: "resume", maxCount: 1 },{ name: "certificate", maxCount: 1 },]),async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: "Request body is missing or empty.",
          data: null,
        });
      }

      // Validate each field in req.body is not empty
      for (const [key, value] of Object.entries(req.body)) {
        if (value === undefined || value === null || value === "") {
          return res.status(400).json({
            message: `Field "${key}" is missing or empty.`,
            data: null,
          });
        }
      }

      
      const request = { fields: req.body, files: req.files };

      const result = await updateUserValidate.ApplicantDetailsValidate(request);
      
      return res.json(result);
    } catch (err) {
      return res.status(500).json({
        message: "An error occurred while processing your request.",
        error: err.message,
      });
    }
  }
);

app.get("/fetchApplicant", async (req, res) => {
  try {    
    const result = await fetchApplicantValidate.FetchApplicantValidate(req.query);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error: err.message,
    });
  }
});

app.get("/getAllApplicants", async (req,res) => {
  try {    
    const result = await getAllApplicantValidate.GetAllApplicantValidate();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error: err.message,
    });
  }
});

app.post("/updateApplicantStatus", async (req,res) => {
  try {   
    console.log("req in reject",req.body); 
    const result = await updateApplicantValidate.UpdateStatusValidate(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error: err.message,
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
