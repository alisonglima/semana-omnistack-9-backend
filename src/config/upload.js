const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const s3Storage = require("multer-sharp-s3");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_DEFAULT_REGION,
});

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, "..", "..", "uploads"));
    },
    filename: (req, file, callback) => {
      const newFile = file;
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err);

        newFile.key = `${hash.toString("hex")}-${file.originalname.replace(
          /\s/g,
          ""
        )}`;

        callback(null, newFile.key);
      });
    },
  }),
  s3: s3Storage({
    s3: new aws.S3(),
    Bucket: "semana-omnistack-9",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    resize: {
      width: 555,
      height: 360,
    },
    toFormat: "jpeg",
    Key: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err);

        const fileName = `${hash.toString("hex")}-${file.originalname.replace(
          /\s/g,
          ""
        )}`;

        callback(null, fileName);
      });
    },
  }),
};

module.exports = {
  destination: path.resolve(__dirname, "..", "..", "uploads"),
  storage: storageTypes.s3,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  },
};

// module.exports = {
//   storage: multer.diskStorage({
//     destination: path.resolve(__dirname, "..", "..", "uploads"),
//     filename: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       const name = path.basename(file.originalname.replace(/\s/g, ""), ext);

//       cb(null, `${name}-${Date.now()}${ext}`);
//     },
//   }),
// };
