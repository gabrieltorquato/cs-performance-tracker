const express = require("express");
const multer = require("multer");
const path = require("path");
const prisma = require("../database/client");
const { runParser } = require("../parsers/runParser");

const router = express.Router();

// Configuração de upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

/**
 * UPLOAD + PARSE + SALVAR NO BANCO
 */
router.post("/upload-demo", upload.single("demo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const demoPath = path.resolve(req.file.path);

    // roda parser em Go
    const result = await runParser(demoPath);

    if (!result || !result.players || result.players.length === 0) {
      return res.status(400).json({ error: "Parser não retornou jogadores" });
    }

    const playersToCreate = result.players.map((p) => ({
      steamId: p.steamId,
      name: p.name,
      team: p.team || "UNKNOWN",

      stats: {
        create: {
          kills: p.kills || 0,
          deaths: p.deaths || 0,
          assists: p.assists || 0,
          headshots: p.headshots || 0,
          adr: p.adr || 0,
          killsCT: p.killsCT || 0,
          killsTR: p.killsTR || 0,
          deathsCT: p.deathsCT || 0,
          deathsTR: p.deathsTR || 0,
          roundsCT: p.roundsCT || 0,
          roundsTR: p.roundsTR || 0,
          ratingCT: p.ratingCT || 0,
          ratingTR: p.ratingTR || 0,
        },
},
    }));

    const match = await prisma.match.create({
      data: {
        map: result.map || "unknown",
        playedAt: new Date(),
        players: { create: playersToCreate },
        rounds: 0, // or whatever the initial value should be
      },
    });

    return res.json({ ok: true, matchId: match.id });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: err.toString() });
  }
});

/**
 * HISTÓRICO DO JOGADOR
 */
router.get("/players/:nickname/history", async (req, res) => {
  try {
    const nickname = req.params.nickname;

    const stats = await prisma.playerStats.findMany({
      where: {
        player: {
          name: nickname
        }
      },
      include: {
        player: {
          include: {
            match: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const formatted = stats.map((s) => ({
      playedAt: s.player.match.playedAt,
      map: s.player.match.map,
      kills: s.kills,
      deaths: s.deaths,
      assists: s.assists,
      adr: s.adr,
      rating: s.rating
    }));

    return res.json(formatted);

  } catch (err) {
    console.error("HISTORY ERROR:", err);
    return res.status(500).json({ error: err.toString() });
  }
});
module.exports = router;