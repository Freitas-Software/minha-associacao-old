import { describe, expect, it } from 'vitest';
import {
	invitations,
	memberships,
	membershipStatusEnum,
	organizationDocuments,
	users,
} from '../../src/db/schema/index.js';

describe('domain database schema', () => {
	it('includes PENDING membership status and defaults memberships to PENDING', () => {
		expect(membershipStatusEnum.enumValues).toEqual(['PENDING', 'ACTIVE', 'INACTIVE']);
		expect(memberships.status.default).toBe('PENDING');
	});

	it('stores last selected association on memberships', () => {
		expect(memberships.last_selected_at.name).toBe('last_selected_at');
	});

	it('does not store password hashes on users', () => {
		expect('password_hash' in users).toBe(false);
		expect(Object.keys(users)).not.toContain('password_hash');
	});

	it('defines invitation lifecycle fields and organization document replacement field', () => {
		expect(invitations.accepted_at.name).toBe('accepted_at');
		expect(invitations.revoked_at.name).toBe('revoked_at');
		expect(organizationDocuments.replaces_document_id.name).toBe('replaces_document_id');
	});
});
