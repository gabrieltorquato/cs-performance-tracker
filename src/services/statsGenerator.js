function generateStats() {
  const kills = Math.floor(Math.random() * 30);
  const deaths = Math.max(1, Math.floor(Math.random() * 25));
  const assists = Math.floor(Math.random() * 10);
  const headshots = Math.floor(Math.random() * kills);
  const adr = Number((Math.random() * 120).toFixed(2));

  return {
    kills,
    deaths,
    assists,
    headshots,
    adr
  };
}

module.exports = { generateStats };
