/*
  Warnings:

  - You are about to drop the column `jenisHewan` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `layanan` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `namaHewan` on the `booking` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `status` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `Transaksi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jam` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingId` to the `Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `Transaksi_userId_fkey`;

-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `jenisHewan`,
    DROP COLUMN `layanan`,
    DROP COLUMN `namaHewan`,
    ADD COLUMN `jam` VARCHAR(191) NOT NULL,
    ADD COLUMN `packageId` INTEGER NOT NULL,
    ADD COLUMN `petId` INTEGER NOT NULL,
    MODIFY `status` ENUM('pending', 'waiting_payment', 'paid', 'on_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `status`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `bookingId` INTEGER NOT NULL,
    ADD COLUMN `proof` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `product`;

-- CreateTable
CREATE TABLE `Pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroomingPackage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `desc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Transaksi_bookingId_key` ON `Transaksi`(`bookingId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `GroomingPackage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
