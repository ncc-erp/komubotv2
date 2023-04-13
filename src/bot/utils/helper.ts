export const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg" || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error("You can only upload mp3 file"), false);
  }
};

export const fileName = (req, file, cb) => {
  cb(null, file.fieldname + "-" + Date.now() + ".mp3");
};

export const imageName = (req, file, cb) => {
  cb(null, Date.now() + file.originalname);
};
