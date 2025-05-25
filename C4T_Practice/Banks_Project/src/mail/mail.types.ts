type VerificationCodeMailPayload = {
  username: string;
  code: string;
  platform?: string;
  expirationTime: string;
};

type RegisterOrganizationMailPayload = {
  name?: string;
  isVerified?: boolean;
  address?: string | null;
  organizationRejectionReason?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  dateOfIncorporation?: string | null;
};

export type RegisterVerificationCodeMailTemplate = {
  name: 'register-verification-code';
  data: VerificationCodeMailPayload;
};

export type ResetPasswordVerificationCodeMailTemplate = {
  name: 'reset-password-verification-code';
  data: VerificationCodeMailPayload;
};

export type ForgotPasswordVerificationCodeMailTemplate = {
  name: 'forgot-password-verification-code';
  data: VerificationCodeMailPayload;
};

export type OrganizationRequestRejectionByAdminMailTemplate = {
  name: 'register-organization-mail';
  data: RegisterOrganizationMailPayload;
};

export type RegisterOrganizationMailTemplate = {
  name: 'organization-request-rejection-mail';
  data: RegisterOrganizationMailPayload;
};

export type MailTemplate =
  | RegisterVerificationCodeMailTemplate
  | RegisterOrganizationMailTemplate
  | OrganizationRequestRejectionByAdminMailTemplate
  | ForgotPasswordVerificationCodeMailTemplate
  | ResetPasswordVerificationCodeMailTemplate;

export type MailParams = { subject: string; template: MailTemplate };
