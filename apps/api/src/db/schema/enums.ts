import { pgEnum } from 'drizzle-orm/pg-core';

export const organizationStatusEnum = pgEnum('organization_status', [
	'PROVISIONING',
	'OPERATIONAL',
	'INACTIVE',
]);

export const userStatusEnum = pgEnum('user_status', ['PENDING_PROFILE', 'ACTIVE', 'INACTIVE']);

export const membershipStatusEnum = pgEnum('membership_status', ['ACTIVE', 'INACTIVE']);

export const roleStatusEnum = pgEnum('role_status', ['ACTIVE', 'INACTIVE']);

export const organizationDocumentTypeEnum = pgEnum('organization_document_type', [
	'STATUTE',
	'ELECTION_RECORD',
]);

export const storedFileStatusEnum = pgEnum('stored_file_status', ['PENDING', 'READY', 'DELETED']);

export const invitationChannelEnum = pgEnum('invitation_channel', ['EMAIL', 'WHATSAPP']);

export const invitationTypeEnum = pgEnum('invitation_type', ['INDIVIDUAL', 'GLOBAL']);

export const invitationStatusEnum = pgEnum('invitation_status', [
	'PENDING',
	'ACCEPTED',
	'EXPIRED',
	'REVOKED',
	'EXHAUSTED',
]);

export const provisioningAccessStatusEnum = pgEnum('provisioning_access_status', [
	'ACTIVE',
	'REVOKED',
	'COMPLETED',
]);

export const auditActorSourceEnum = pgEnum('audit_actor_source', ['USER', 'PLATFORM', 'SYSTEM']);

export const billingPeriodicityEnum = pgEnum('billing_periodicity', [
	'MONTHLY',
	'QUARTERLY',
	'SEMIANNUAL',
	'ANNUAL',
]);

export const roleChangeRecalculationPolicyEnum = pgEnum('role_change_recalculation_policy', [
	'FUTURE_ONLY',
	'FUTURE_AND_ELIGIBLE_OPEN',
]);

export const delinquencyCriteriaEnum = pgEnum('delinquency_criteria', [
	'DAYS_AFTER_DUE_DATE',
	'OVERDUE_CHARGES',
	'BOTH',
]);

export const delinquencyCombinationEnum = pgEnum('delinquency_combination', ['ANY', 'ALL']);

export const chargeStatusEnum = pgEnum('charge_status', [
	'OPEN',
	'PAID',
	'FORGIVEN',
	'CANCELLED',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
	'CASH',
	'BANK_TRANSFER',
	'CARD',
	'PIX',
	'GATEWAY',
	'BARTER',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
	'PENDING',
	'CONFIRMED',
	'FAILED',
	'PARTIALLY_REFUNDED',
	'REFUNDED',
	'REVERSED',
]);

export const refundStatusEnum = pgEnum('refund_status', [
	'PENDING',
	'CONFIRMED',
	'FAILED',
	'REVERSED',
]);

export const forgivenessComponentEnum = pgEnum('forgiveness_component', [
	'PENALTY',
	'INTEREST',
	'PRINCIPAL',
]);

export const restrictionTypeEnum = pgEnum('restriction_type', ['MEMBERSHIP_CARD', 'BENEFITS']);

export const barterStatusEnum = pgEnum('barter_status', [
	'DRAFT',
	'CONFIRMED',
	'CANCELLED',
]);

export const residualDispositionEnum = pgEnum('residual_disposition', [
	'RETURNED',
	'RETAINED_AS_CREDIT',
	'SPLIT',
	'NONE',
]);
