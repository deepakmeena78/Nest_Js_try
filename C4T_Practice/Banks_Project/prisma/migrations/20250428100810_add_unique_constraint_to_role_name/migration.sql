/*
  Warnings:

  - You are about to drop the column `business_type` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `organization_approved` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `organization_verification_status` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `organization_rejection_reasons` on the `user_meta` table. All the data in the column will be lost.
  - You are about to drop the `acknowledgment_declaration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `beneficial_owner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `compliance_risk_assessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documentation_checklist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dore_bar_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gold_consignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gold_dore_document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kyc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipment_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "rbi_status" AS ENUM ('active');

-- CreateEnum
CREATE TYPE "BankStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "BankName" AS ENUM ('SBI', 'HDFC', 'ICICI', 'AXIS', 'PNB', 'BOB', 'KOTAK', 'YES', 'UNION', 'IDFC');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- DropForeignKey
ALTER TABLE "acknowledgment_declaration" DROP CONSTRAINT "acknowledgment_declaration_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "beneficial_owner" DROP CONSTRAINT "beneficial_owner_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "compliance_risk_assessment" DROP CONSTRAINT "compliance_risk_assessment_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "documentation_checklist" DROP CONSTRAINT "documentation_checklist_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "dore_bar_detail" DROP CONSTRAINT "dore_bar_detail_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "dore_bar_detail" DROP CONSTRAINT "dore_bar_detail_gold_consignment_id_fkey";

-- DropForeignKey
ALTER TABLE "dore_bar_detail" DROP CONSTRAINT "dore_bar_detail_user_id_fkey";

-- DropForeignKey
ALTER TABLE "gold_consignment" DROP CONSTRAINT "gold_consignment_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "gold_consignment" DROP CONSTRAINT "gold_consignment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "gold_dore_document" DROP CONSTRAINT "gold_dore_document_gold_dore_form_id_fkey";

-- DropForeignKey
ALTER TABLE "kyc" DROP CONSTRAINT "kyc_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "kyc" DROP CONSTRAINT "kyc_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "kyc" DROP CONSTRAINT "kyc_userId_fkey";

-- DropForeignKey
ALTER TABLE "organization" DROP CONSTRAINT "organization_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "organization" DROP CONSTRAINT "organization_user_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_role" DROP CONSTRAINT "organization_role_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "permission_role" DROP CONSTRAINT "permission_role_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "permission_role" DROP CONSTRAINT "permission_role_roleId_fkey";

-- DropForeignKey
ALTER TABLE "role" DROP CONSTRAINT "role_createdById_fkey";

-- DropForeignKey
ALTER TABLE "shipment_log" DROP CONSTRAINT "shipment_log_consignment_id_fkey";

-- DropForeignKey
ALTER TABLE "shipment_log" DROP CONSTRAINT "shipment_log_handover_by_id_fkey";

-- DropForeignKey
ALTER TABLE "shipment_log" DROP CONSTRAINT "shipment_log_handover_to_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_setting" DROP CONSTRAINT "user_setting_user_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "business_type",
DROP COLUMN "is_verified",
DROP COLUMN "organization_approved",
DROP COLUMN "organization_verification_status",
DROP COLUMN "parent_id",
DROP COLUMN "profile_image",
ALTER COLUMN "roleType" SET DEFAULT 'user';

-- AlterTable
ALTER TABLE "user_meta" DROP COLUMN "organization_rejection_reasons";

-- DropTable
DROP TABLE "acknowledgment_declaration";

-- DropTable
DROP TABLE "beneficial_owner";

-- DropTable
DROP TABLE "compliance_risk_assessment";

-- DropTable
DROP TABLE "documentation_checklist";

-- DropTable
DROP TABLE "dore_bar_detail";

-- DropTable
DROP TABLE "gold_consignment";

-- DropTable
DROP TABLE "gold_dore_document";

-- DropTable
DROP TABLE "kyc";

-- DropTable
DROP TABLE "organization";

-- DropTable
DROP TABLE "organization_role";

-- DropTable
DROP TABLE "permission";

-- DropTable
DROP TABLE "permission_role";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "shipment_log";

-- DropTable
DROP TABLE "user_role";

-- DropEnum
DROP TYPE "HandoverStatus";

-- DropEnum
DROP TYPE "business_type";

-- DropEnum
DROP TYPE "consignment_status";

-- DropEnum
DROP TYPE "gold_dore_document_type";

-- DropEnum
DROP TYPE "kyc_status";

-- DropEnum
DROP TYPE "organization_process_status";

-- DropEnum
DROP TYPE "permission_action";

-- CreateTable
CREATE TABLE "rbi" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_image" TEXT,
    "status" "rbi_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rbi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rbi_meta" (
    "password_salt" TEXT,
    "password_hash" TEXT,
    "rbi_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "bank" (
    "id" SERIAL NOT NULL,
    "bank_name" "BankName" NOT NULL,
    "status" "BankStatus" DEFAULT 'Pending',
    "reason" TEXT DEFAULT 'null',
    "location" TEXT,
    "document" TEXT,
    "owner_name" TEXT NOT NULL,
    "total_balance" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_account" (
    "id" SERIAL NOT NULL,
    "aadhar" TEXT NOT NULL,
    "panCard" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Acfreeze" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "from_account_id" INTEGER NOT NULL,
    "to_account_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "feature" TEXT NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionRole" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "PermissionRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rbi_email_key" ON "rbi"("email");

-- CreateIndex
CREATE UNIQUE INDEX "rbi_meta_rbi_id_key" ON "rbi_meta"("rbi_id");

-- CreateIndex
CREATE UNIQUE INDEX "bank_account_user_id_bank_id_key" ON "bank_account"("user_id", "bank_id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionRole_roleId_permissionId_key" ON "PermissionRole"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "rbi_meta" ADD CONSTRAINT "rbi_meta_rbi_id_fkey" FOREIGN KEY ("rbi_id") REFERENCES "rbi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank" ADD CONSTRAINT "bank_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_from_account_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_to_account_id_fkey" FOREIGN KEY ("to_account_id") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionRole" ADD CONSTRAINT "PermissionRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionRole" ADD CONSTRAINT "PermissionRole_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
