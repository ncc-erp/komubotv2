export const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg") {
    cb(null, true);
  } else {
    cb(new Error("You can only upload mp3 file"), false);
  }
};

export const fileName = (req, file, cb) => {
  cb(null, file.fieldname + "-" + Date.now() + ".mp3");
};
