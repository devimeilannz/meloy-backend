/*
  Warnings:

  - The values [waiting_payment,on_progress] on the enum `Booking_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `age` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `status` ENUM('pending', 'paid', 'proses_grooming', 'completed', 'reject', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `pet` ADD COLUMN `age` INTEGER NOT NULL;
