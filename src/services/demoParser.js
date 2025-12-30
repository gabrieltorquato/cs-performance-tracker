/**
 * Parser MOCK de demo CS2
 * ⚠️ Substituível por parser real no futuro
 */
async function parseCsDemo(filePath) {
  // Simula tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    map: "de_inferno",
    matchDate: new Date(),
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
    ],
    rounds: 24
  };
}

module.exports = { parseCsDemo };
