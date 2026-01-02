function aggregateStatsByMap(matches, nickname) {
  const mapStats = {};

  matches.forEach(match => {
    const player = match.players.find(
      p => p.name.toLowerCase() === nickname.toLowerCase()
    );

    if (!player || !player.stats) return;

    const map = match.map;

    if (!mapStats[map]) {
      mapStats[map] = {
        map,
        matches: 0,
        kills: 0,
        deaths: 0,
        headshots: 0,
        adrTotal: 0
      };
    }

    mapStats[map].matches += 1;
    mapStats[map].kills += player.stats.kills;
    mapStats[map].deaths += player.stats.deaths;
    mapStats[map].headshots += player.stats.headshots;
    mapStats[map].adrTotal += player.stats.adr;
  });

  return Object.values(mapStats).map(stat => ({
    map: stat.map,
    matches: stat.matches,
    kd: Number((stat.kills / Math.max(1, stat.deaths)).toFixed(2)),
    hsPercent: Number(((stat.headshots / Math.max(1, stat.kills)) * 100).toFixed(1)),
    adr: Number((stat.adrTotal / stat.matches).toFixed(1))
  }));
}

module.exports = { aggregateStatsByMap };
