-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "map" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL DEFAULT 0,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Match" ("id", "map", "playedAt", "rounds") SELECT "id", "map", "playedAt", "rounds" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "steamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "team" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "matchId" INTEGER NOT NULL,
    CONSTRAINT "Player_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("id", "matchId", "name", "steamId", "team") SELECT "id", "matchId", "name", "steamId", "team" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE TABLE "new_PlayerStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "headshots" INTEGER NOT NULL DEFAULT 0,
    "damage" INTEGER NOT NULL DEFAULT 0,
    "rounds" INTEGER NOT NULL DEFAULT 0,
    "killsCT" INTEGER NOT NULL DEFAULT 0,
    "killsTR" INTEGER NOT NULL DEFAULT 0,
    "deathsCT" INTEGER NOT NULL DEFAULT 0,
    "deathsTR" INTEGER NOT NULL DEFAULT 0,
    "roundsCT" INTEGER NOT NULL DEFAULT 0,
    "roundsTR" INTEGER NOT NULL DEFAULT 0,
    "adr" REAL NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 0,
    "ratingCT" REAL NOT NULL DEFAULT 0,
    "ratingTR" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerStats" ("adr", "assists", "deaths", "headshots", "id", "kills", "playerId") SELECT "adr", "assists", "deaths", "headshots", "id", "kills", "playerId" FROM "PlayerStats";
DROP TABLE "PlayerStats";
ALTER TABLE "new_PlayerStats" RENAME TO "PlayerStats";
CREATE UNIQUE INDEX "PlayerStats_playerId_key" ON "PlayerStats"("playerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
