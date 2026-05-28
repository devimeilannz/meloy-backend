/*
  Warnings:

  - You are about to drop the `groomingpackage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `package` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_packageId_fkey`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `package` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` INTEGER NOT NULL;

-- DropTable
DROP TABLE `groomingpackage`;
