/** __________ Errors __________ */
import { NotAcceptableException } from "../errors/notAcceptableException.error.js";

/** __________ Core Modules __________ */
import multer from "multer";
import fs from "fs";
import path from "path";

/**
 * Storage
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    if (!fs.existsSync("public/uploads")) {
      fs.mkdirSync("public/uploads");
    }
    cb(null, "public/uploads");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtention = path.extname(file.originalname);
    cb(null, `${file.originalname}_${uniqueSuffix}${fileExtention}`);
  },
});

/**
 * File Filter
 */
const fileFilter = (req, file, cb) => {
  const extention = path.extname(file.originalname);

  if (extention !== ".jpg" && extention !== ".jpeg" && extention !== ".png") {
    return cb(
      new NotAcceptableException(
        "Only JPG, JPEG and PNG image files are allowed!"
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export { upload };
