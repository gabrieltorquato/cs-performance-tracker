const express = require("express");
const multer = require("multer");
const path = require("path");
const { parseCsDemo } = require("../services/demoParser");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".dem") {
    return cb(new Error("Apenas arquivos .dem são permitidos"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

router.post("/upload-demo", upload.single("demo"), async (req, res) => {
  try {
    const result = await parseCsDemo(req.file.path);

    res.json({
      message: "Demo processada com sucesso",
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
