-- CreateEnum
CREATE TYPE "admin_status" AS ENUM ('active');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'blocked', 'suspend');

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('verified', 'pending', 'rejected');

-- CreateEnum
CREATE TYPE "otp_transport" AS ENUM ('email', 'mobile');

-- CreateEnum
CREATE TYPE "setting_type" AS ENUM ('binary', 'multi_select', 'single_select');

-- CreateEnum
CREATE TYPE "setting_context" AS ENUM ('user', 'System');

-- CreateEnum
CREATE TYPE "business_type" AS ENUM ('mine', 'logistics_provider', 'refinery', 'vault');

-- CreateEnum
CREATE TYPE "organization_process_status" AS ENUM ('pending', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "consignment_status" AS ENUM ('mine', 'logistics_awaited', 'logistics', 'refinery_awaited', 'refinery', 'vault_awaited', 'vault', 'tokenize', 'completed');

-- CreateEnum
CREATE TYPE "HandoverStatus" AS ENUM ('pending', 'confirmed', 'rejected');

-- CreateEnum
CREATE TYPE "gold_dore_document_type" AS ENUM ('assay_report', 'certificate_of_origin', 'export_import_license', 'chain_of_custody_document', 'proof_of_ownership');

-- CreateEnum
CREATE TYPE "kyc_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "permission_action" AS ENUM ('create', 'read', 'update', 'delete');

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_image" TEXT,
    "status" "admin_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_meta" (
    "password_salt" TEXT,
    "password_hash" TEXT,
    "admin_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL DEFAULT '',
    "lastname" TEXT NOT NULL DEFAULT '',
    "username" TEXT,
    "email" TEXT,
    "dial_code" TEXT,
    "mobile" TEXT,
    "profile_image" TEXT,
    "business_type" "business_type",
    "is_verified" BOOLEAN NOT NULL DEFAULT true,
    "organization_approved" BOOLEAN NOT NULL DEFAULT false,
    "organization_verification_status" "verification_status" NOT NULL DEFAULT 'pending',
    "country" TEXT,
    "status" "user_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "roleType" TEXT NOT NULL DEFAULT 'administrator',
    "parent_id" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_meta" (
    "google_id" TEXT,
    "password_salt" TEXT,
    "password_hash" TEXT,
    "organization_rejection_reasons" TEXT,
    "date_of_kyc" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "otp" (
    "code" TEXT NOT NULL,
    "attempt" SMALLINT NOT NULL DEFAULT 1,
    "last_sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retries" SMALLINT NOT NULL DEFAULT 0,
    "transport" "otp_transport" NOT NULL,
    "target" TEXT NOT NULL,
    "last_code_verified" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "setting" (
    "id" SERIAL NOT NULL,
    "mapped_to" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "type" "setting_type" NOT NULL,
    "context" "setting_context" NOT NULL,
    "default" JSONB NOT NULL,
    "is_defined_options" BOOLEAN NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting_option" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL,
    "setting_id" INTEGER NOT NULL,

    CONSTRAINT "setting_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_setting" (
    "selection" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "setting_id" INTEGER NOT NULL,

    CONSTRAINT "user_setting_pkey" PRIMARY KEY ("user_id","setting_id")
);

-- CreateTable
CREATE TABLE "system_setting" (
    "selection" JSONB NOT NULL,
    "setting_id" INTEGER NOT NULL,

    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("setting_id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "business_type" NOT NULL DEFAULT 'mine',
    "registration_number" TEXT,
    "country_of_incorporation" TEXT NOT NULL,
    "date_of_incorporation" TEXT,
    "address" TEXT,
    "website" TEXT,
    "completed-forms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completed-forms-count" INTEGER NOT NULL DEFAULT 0,
    "registration_status" "organization_process_status" NOT NULL DEFAULT 'pending',
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "primary_contact_name" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "dial_code" TEXT,
    "phone_number" TEXT,
    "ip_address" TEXT,
    "user_id" INTEGER,
    "admin_id" INTEGER,
    "kyc_status" "kyc_status" NOT NULL DEFAULT 'pending',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_role" (
    "id" SERIAL NOT NULL,
    "mine_production_capacity" DOUBLE PRECISION,
    "mine_efficiency_metrics" TEXT,
    "mine_certification" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mine_operational_license" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mine_environmental_compliance" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logistics_primary_transport_methods" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logistics_third_party_carriers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logistics_areas_of_operation" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logistics_proof_of_insurance_policy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logistics_vehicle_fleet_registration" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refinery_method_used" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refinery_sustainability_practices" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refinery_certification" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refinery_iso_certification" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refinery_operational_license" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vault_facility_description" TEXT,
    "vault_storage_capacity" DOUBLE PRECISION,
    "vault_security_measures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vault_insurance_type" TEXT,
    "vault_liability_insurance_document" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vault_security_audit_report" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "organization_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentation_checklist" (
    "id" SERIAL NOT NULL,
    "business_registration_certificate" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tax_identification_document" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "compliance_certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "financial_statements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentation_checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficial_owner" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "ownership_percentage" DOUBLE PRECISION NOT NULL,
    "isPEP" BOOLEAN NOT NULL DEFAULT false,
    "position_role" TEXT,
    "pep_full_name" TEXT,
    "relationship_to_entity" TEXT,
    "document_file_path" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "document_uploaded_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beneficial_owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_risk_assessment" (
    "id" SERIAL NOT NULL,
    "hasLegalSanctions" BOOLEAN NOT NULL DEFAULT false,
    "legal_sanction_details" TEXT,
    "aml_cft_policies" TEXT,
    "compliance_officer_name" TEXT,
    "compliance_officer_position" TEXT,
    "staff_training_details" TEXT,
    "isNotApplicable" BOOLEAN DEFAULT false,
    "document_file_path" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "document_uploaded_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_risk_assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acknowledgment_declaration" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "signature" TEXT,
    "email" TEXT,
    "dial_code" TEXT,
    "mobile" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acknowledgment_declaration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gold_consignment" (
    "gold_consignment_id" SERIAL NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "entity_type" "business_type" NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "country_of_origin" TEXT NOT NULL,
    "report_number" TEXT,
    "assay_company_name" TEXT,
    "assay_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assay_method" TEXT,
    "declaration_name" TEXT,
    "declaration_position" TEXT,
    "declaration_signature" TEXT,
    "declaration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipment_id" TEXT NOT NULL,
    "status" "consignment_status" NOT NULL DEFAULT 'mine',
    "currentStatus" INTEGER NOT NULL DEFAULT 1,
    "no_of_item" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN DEFAULT false,
    "notes" TEXT,
    "ip_address" TEXT,
    "is_lock" BOOLEAN NOT NULL DEFAULT false,
    "gold_gore_form_progress" TEXT[],
    "user_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gold_consignment_pkey" PRIMARY KEY ("gold_consignment_id")
);

-- CreateTable
CREATE TABLE "dore_bar_detail" (
    "dore_bar_detail_id" SERIAL NOT NULL,
    "serial_number" TEXT NOT NULL,
    "weight_kg" DECIMAL(65,30) NOT NULL,
    "purity_percent" DECIMAL(65,30) NOT NULL,
    "gold_content_g" DECIMAL(65,30) NOT NULL,
    "silver_content_g" DECIMAL(65,30),
    "other_metals" JSONB,
    "total_weight" DECIMAL(65,30),
    "average_purity" DECIMAL(65,30),
    "admin_id" INTEGER,
    "user_id" INTEGER,
    "gold_consignment_id" INTEGER NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dore_bar_detail_pkey" PRIMARY KEY ("dore_bar_detail_id")
);

-- CreateTable
CREATE TABLE "shipment_log" (
    "shipment_log_id" SERIAL NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "handover_by_id" INTEGER NOT NULL,
    "handover_to_id" INTEGER NOT NULL,
    "handover_role" TEXT NOT NULL,
    "handover_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handover_status" "HandoverStatus" NOT NULL DEFAULT 'pending',
    "handover_documents" JSONB,
    "destination_company" TEXT NOT NULL,
    "destination_date" TIMESTAMP(3) NOT NULL,
    "logistics_partner" TEXT NOT NULL,
    "status" "consignment_status" NOT NULL DEFAULT 'mine',
    "ip_address" TEXT,
    "consignment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipment_log_pkey" PRIMARY KEY ("shipment_log_id")
);

-- CreateTable
CREATE TABLE "gold_dore_document" (
    "gold_dore_document_id" SERIAL NOT NULL,
    "document_type" "gold_dore_document_type" NOT NULL,
    "file_path" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gold_dore_form_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gold_dore_document_pkey" PRIMARY KEY ("gold_dore_document_id")
);

-- CreateTable
CREATE TABLE "kyc" (
    "id" SERIAL NOT NULL,
    "kyc_name" TEXT,
    "certificate_of_incorporation" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tax_tertificate" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mining_trading_license" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "verification_status" "kyc_status" NOT NULL DEFAULT 'pending',
    "userId" INTEGER,
    "organization_id" INTEGER,
    "admin_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'administrator',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdById" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "action" "permission_action" NOT NULL,
    "feature" TEXT,
    "desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_role" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_meta_admin_id_key" ON "admin_meta"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_mobile_key" ON "user"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "user_meta_google_id_key" ON "user_meta"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_meta_user_id_key" ON "user_meta"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "otp_transport_target_key" ON "otp"("transport", "target");

-- CreateIndex
CREATE UNIQUE INDEX "setting_context_mapped_to_key" ON "setting"("context", "mapped_to");

-- CreateIndex
CREATE UNIQUE INDEX "setting_option_setting_id_value_key" ON "setting_option"("setting_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "organization_name_key" ON "organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "organization_user_id_key" ON "organization"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "documentation_checklist_organization_id_key" ON "documentation_checklist"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "beneficial_owner_full_name_key" ON "beneficial_owner"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_risk_assessment_compliance_officer_name_key" ON "compliance_risk_assessment"("compliance_officer_name");

-- CreateIndex
CREATE UNIQUE INDEX "acknowledgment_declaration_name_key" ON "acknowledgment_declaration"("name");

-- CreateIndex
CREATE UNIQUE INDEX "acknowledgment_declaration_organization_id_key" ON "acknowledgment_declaration"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "gold_consignment_report_number_key" ON "gold_consignment"("report_number");

-- CreateIndex
CREATE UNIQUE INDEX "gold_consignment_shipment_id_key" ON "gold_consignment"("shipment_id");

-- CreateIndex
CREATE INDEX "gold_consignment_shipment_id_idx" ON "gold_consignment"("shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "dore_bar_detail_serial_number_key" ON "dore_bar_detail"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_log_shipment_id_key" ON "shipment_log"("shipment_id");

-- CreateIndex
CREATE INDEX "shipment_log_shipment_id_idx" ON "shipment_log"("shipment_id");

-- CreateIndex
CREATE INDEX "shipment_log_status_idx" ON "shipment_log"("status");

-- CreateIndex
CREATE INDEX "shipment_log_handover_by_id_handover_to_id_idx" ON "shipment_log"("handover_by_id", "handover_to_id");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_userId_key" ON "kyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_organization_id_key" ON "kyc"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_action_key" ON "permission"("action");

-- CreateIndex
CREATE UNIQUE INDEX "permission_role_roleId_permissionId_key" ON "permission_role"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_userId_roleId_key" ON "user_role"("userId", "roleId");

-- AddForeignKey
ALTER TABLE "admin_meta" ADD CONSTRAINT "admin_meta_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_meta" ADD CONSTRAINT "user_meta_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "setting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_option" ADD CONSTRAINT "setting_option_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setting" ADD CONSTRAINT "user_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_setting" ADD CONSTRAINT "user_setting_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_setting" ADD CONSTRAINT "system_setting_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_role" ADD CONSTRAINT "organization_role_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentation_checklist" ADD CONSTRAINT "documentation_checklist_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficial_owner" ADD CONSTRAINT "beneficial_owner_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_risk_assessment" ADD CONSTRAINT "compliance_risk_assessment_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acknowledgment_declaration" ADD CONSTRAINT "acknowledgment_declaration_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gold_consignment" ADD CONSTRAINT "gold_consignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gold_consignment" ADD CONSTRAINT "gold_consignment_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dore_bar_detail" ADD CONSTRAINT "dore_bar_detail_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dore_bar_detail" ADD CONSTRAINT "dore_bar_detail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dore_bar_detail" ADD CONSTRAINT "dore_bar_detail_gold_consignment_id_fkey" FOREIGN KEY ("gold_consignment_id") REFERENCES "gold_consignment"("gold_consignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_log" ADD CONSTRAINT "shipment_log_consignment_id_fkey" FOREIGN KEY ("consignment_id") REFERENCES "gold_consignment"("gold_consignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_log" ADD CONSTRAINT "shipment_log_handover_by_id_fkey" FOREIGN KEY ("handover_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_log" ADD CONSTRAINT "shipment_log_handover_to_id_fkey" FOREIGN KEY ("handover_to_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gold_dore_document" ADD CONSTRAINT "gold_dore_document_gold_dore_form_id_fkey" FOREIGN KEY ("gold_dore_form_id") REFERENCES "gold_consignment"("gold_consignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_role" ADD CONSTRAINT "permission_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_role" ADD CONSTRAINT "permission_role_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
