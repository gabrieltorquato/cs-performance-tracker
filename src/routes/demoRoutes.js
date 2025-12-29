const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configuração de onde salvar o arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// Filtro: aceitar só .dem
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".dem") {
    return cb(new Error("Apenas arquivos .dem são permitidos"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Rota de upload
router.post("/upload-demo", upload.single("demo"), (req, res) => {
  res.json({
    message: "Demo enviada com sucesso!",
    file: req.file
  });
});

module.exports = router;
