/*
  Warnings:

  - You are about to drop the column `package` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `booking` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Booking_packageId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `package`,
    DROP COLUMN `price`;

-- CreateTable
CREATE TABLE `GroomingPackage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `GroomingPackage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
