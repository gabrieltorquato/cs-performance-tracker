const maps = [
  "de_inferno",
  "de_mirage",
  "de_nuke",
  "de_ancient",
  "de_anubis"
];

function getRandomMap() {
  return maps[Math.floor(Math.random() * maps.length)];
}

async function parseCsDemo(filePath) {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    map: getRandomMap(),
    matchDate: new Date(),
    rounds: 24,
    players: [
      {
        steamId: "76561198000000001",
        name: "gabiru",
        team: "CT"
      },
      {
        steamId: "76561198000000002",
        name: "player2",
        team: "TR"
      }
    ]
  };
}

module.exports = { parseCsDemo };
