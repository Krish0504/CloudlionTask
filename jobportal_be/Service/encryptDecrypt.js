const crypto = require('crypto');

const encryptFiles = (req) => {
  try {
    console.log("Request received:", req);

    function encryptFile(fileBuffer) {
      const algorithm = 'aes-256-cbc'; 
      const secretKey = crypto.randomBytes(32); 
      const iv = crypto.randomBytes(16); 
      const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
      let encrypted = cipher.update(fileBuffer);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return { encryptedFile: encrypted, iv, secretKey };
    }

    if (!req.resume || !req.resume.buffer || !req.certificate || !req.certificate.buffer) {
      throw new Error("Resume or certificate file is missing in the request.");
    }

    const encryptedResume = encryptFile(req.resume.buffer);
    const encryptedCertificate = encryptFile(req.certificate.buffer);

    const encryptedFilesData = {
      resume: {
        encryptedFile: encryptedResume.encryptedFile.toString('base64'),
        iv: encryptedResume.iv.toString('base64'),
        secretKey: encryptedResume.secretKey.toString('base64'), 
      },
      certificate: {
        encryptedFile: encryptedCertificate.encryptedFile.toString('base64'),
        iv: encryptedCertificate.iv.toString('base64'),
        secretKey: encryptedCertificate.secretKey.toString('base64'), 
      },
    };


    return encryptedFilesData; 
  } catch (error) {
    console.error("Error during encryption:", error.message);
    throw error; 
  }
};


const decryptFiles = (encryptedFile, iv, secretKey) => {
  const algorithm = 'aes-256-cbc';
  const encryptedBuffer = Buffer.from(encryptedFile, 'base64');
  const ivBuffer = Buffer.from(iv, 'base64');
  const keyBuffer = Buffer.from(secretKey, 'base64');

  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
};

module.exports = { encryptFiles,decryptFiles };
