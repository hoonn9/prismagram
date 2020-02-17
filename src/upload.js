import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS,
  secretAccessKey: process.env.S3_SECRET,
  region: "ap-northeast-2"
});

const uploadMiddleware = () => {
  const upload = multer({
    storage: multerS3({
      s3,
      bucket: "hxxns-prismagram",
      metadata: function(req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function(req, file, cb) {
        cb(null, Date.now().toString());
      }
    })
  });
  return upload.single("file");
};

export const uploadController = (req, res) => {
  const upload = uploadMiddleware();
  upload(req, res, err => {
    if (err) {
      console.log(err);
      return;
    }
    const {
      file: { location }
    } = req;
    res.json({ location });
  });
};
