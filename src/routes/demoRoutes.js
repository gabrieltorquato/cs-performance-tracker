const express = require("express");
const multer = require("multer");
const path = require("path");
const prisma = require("../database/prisma");
const { runDemoParser } = require("../services/parserRunner");

const router = express.Router();

/* =========================
   TESTE DE VIDA
   ========================= */
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

/* =========================
   CONFIG UPLOAD
   ========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname) !== ".dem") {
    return cb(new Error("Apenas arquivos .dem"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

/* =========================
   UPLOAD + SAVE MATCH
   ========================= */
router.post("/upload-demo", upload.single("demo"), async (req, res) => {
  try {
    const demoPath = req.file.path;

    const result = await runDemoParser(demoPath);

    const match = await prisma.match.create({
      data: {
        map: result.map ?? "unknown",
        rounds: result.players[0]?.rounds ?? 0,
        playedAt: new Date(),
        players: {
          create: result.players.map((p) => ({
            steamId: p.steamId,
            name: p.name,
            team: "UNKNOWN",
            stats: {
              create: {
                kills: p.kills,
                deaths: p.deaths,
                assists: p.assists,
                headshots: p.headshots,
                adr: p.adr,
                rating: p.rating,
                ratingCT: p.ratingCT,
                ratingTR: p.ratingTR,
                killsCT: p.killsCT,
                killsTR: p.killsTR,
                deathsCT: p.deathsCT,
                deathsTR: p.deathsTR,
                roundsCT: p.roundsCT,
                roundsTR: p.roundsTR,
              },
            },
          })),
        },
      },
    });

    res.json({ message: "Partida processada com sucesso", matchId: match.id });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: "Erro ao processar demo" });
  }
});

/* =========================
   DEBUG – VER BANCO
   ========================= */
router.get("/debug/matches", async (req, res) => {
  const matches = await prisma.match.findMany({
    include: {
      players: {
        include: {
          stats: true,
        },
      },
    },
  });

  res.json(matches);
});

/* =========================
   HISTÓRICO POR JOGADOR
   ========================= */
router.get("/players/:nickname/history", async (req, res) => {
  const { nickname } = req.params;

  const matches = await prisma.match.findMany({
    orderBy: {
      playedAt: "desc",
    },
    include: {
      players: {
        include: {
          stats: true,
        },
      },
    },
  });

  const response = [];

  for (const match of matches) {
    const player = match.players.find(
      (p) =>
        typeof p.name === "string" &&
        p.name.trim().toLowerCase() === nickname.trim().toLowerCase()
    );

    if (!player || !player.stats) continue;

    response.push({
      playedAt: match.playedAt,
      map: match.map,
      kills: player.stats.kills,
      deaths: player.stats.deaths,
      assists: player.stats.assists,
      adr: player.stats.adr,
      rating: player.stats.rating,
    });
  }

  res.json(response);
});

module.exports = router;
