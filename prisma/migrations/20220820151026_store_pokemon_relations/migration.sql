/*
  Warnings:

  - You are about to drop the column `votedAgainst` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `votedFor` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `votedAgainstId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votedForId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- Delete
DELETE FROM "Vote";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "votedAgainst",
DROP COLUMN "votedFor",
ADD COLUMN     "votedAgainstId" INTEGER NOT NULL,
ADD COLUMN     "votedForId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votedForId_fkey" FOREIGN KEY ("votedForId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votedAgainstId_fkey" FOREIGN KEY ("votedAgainstId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
