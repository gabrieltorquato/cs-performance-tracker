const express = require("express");
const multer = require("multer");
const path = require("path");
const prisma = require("../database/prisma");
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

    const match = await prisma.match.create({
      data: {
        map: result.map,
        rounds: result.rounds,
        playedAt: result.matchDate,
        players: {
          create: result.players.map(player => ({
            steamId: player.steamId,
            name: player.name,
            team: player.team
          }))
        }
      },
      include: {
        players: true
      }
    });

    res.json({
      message: "Partida salva com sucesso",
      match
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao salvar a partida"
    });
  }
});


// Listar todas as partidas
router.get("/matches", async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      orderBy: {
        playedAt: "desc"
      },
      include: {
        players: true
      }
    });

    res.json({
      total: matches.length,
      matches
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar partidas" });
  }
});

// 1️⃣ Histórico por jogador (ESPECÍFICA)
router.get("/matches/player/:nickname", async (req, res) => {
  try {
    const { nickname } = req.params;

    const matches = await prisma.match.findMany({
      where: {
        players: {
          some: {
            name: nickname
          }
        }
      },
      include: {
        players: true
      },
      orderBy: {
        playedAt: "desc"
      }
    });

    res.json({
      total: matches.length,
      matches
    });
  } catch (error) {
    console.error("ERRO HISTÓRICO JOGADOR:", error);
    res.status(500).json({ error: error.message });
  }
});



// 2️⃣ Detalhes de uma partida (GENÉRICA)
router.get("/matches/:id", async (req, res) => {
  try {
    const matchId = Number(req.params.id);

    if (isNaN(matchId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { players: true }
    });

    if (!match) {
      return res.status(404).json({ error: "Partida não encontrada" });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar partida" });
  }
});

module.exports = router;
