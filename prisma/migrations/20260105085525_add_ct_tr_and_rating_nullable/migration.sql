/*
  Warnings:

  - You are about to drop the column `rounds` on the `Match` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PlayerStats_playerId_key";

-- AlterTable
ALTER TABLE "PlayerStats" ADD COLUMN "deathsCT" INTEGER;
ALTER TABLE "PlayerStats" ADD COLUMN "deathsTR" INTEGER;
ALTER TABLE "PlayerStats" ADD COLUMN "killsCT" INTEGER;
ALTER TABLE "PlayerStats" ADD COLUMN "killsTR" INTEGER;
ALTER TABLE "PlayerStats" ADD COLUMN "rating" REAL;
ALTER TABLE "PlayerStats" ADD COLUMN "ratingCT" REAL;
ALTER TABLE "PlayerStats" ADD COLUMN "ratingTR" REAL;
ALTER TABLE "PlayerStats" ADD COLUMN "roundsCT" INTEGER;
ALTER TABLE "PlayerStats" ADD COLUMN "roundsTR" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "map" TEXT NOT NULL,
    "playedAt" DATETIME NOT NULL
);
INSERT INTO "new_Match" ("id", "map", "playedAt") SELECT "id", "map", "playedAt" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
