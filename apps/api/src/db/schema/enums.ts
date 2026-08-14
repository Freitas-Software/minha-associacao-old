import { pgEnum } from 'drizzle-orm/pg-core';

export const organizationStatusEnum = pgEnum('organization_status', ['ACTIVE', 'INACTIVE']);

export const userStatusEnum = pgEnum('user_status', ['PENDING_PROFILE', 'ACTIVE', 'INACTIVE']);

export const membershipStatusEnum = pgEnum('membership_status', ['PENDING', 'ACTIVE', 'INACTIVE']);

export const roleStatusEnum = pgEnum('role_status', ['ACTIVE', 'INACTIVE']);

export const organizationDocumentTypeEnum = pgEnum('organization_document_type', [
	'STATUTE',
	'ELECTION_RECORD',
]);

export const storedFileStatusEnum = pgEnum('stored_file_status', ['PENDING', 'READY', 'DELETED']);

export const invitationChannelEnum = pgEnum('invitation_channel', ['EMAIL', 'WHATSAPP']);
