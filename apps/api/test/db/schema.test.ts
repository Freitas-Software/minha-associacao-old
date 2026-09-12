import { describe, expect, it } from 'vitest';
import * as schema from '../../src/db/schema/index.js';
import {
	invitations,
	memberships,
	membershipStatusEnum,
	organizationStatusEnum,
	organizationDocuments,
	organizations,
	provisioningAccess,
	roles,
	users,
} from '../../src/db/schema/index.js';

describe('domain database schema', () => {
	it('models the approved organization and membership lifecycles', () => {
		expect(organizationStatusEnum.enumValues).toEqual(['PROVISIONING', 'OPERATIONAL', 'INACTIVE']);
		expect(membershipStatusEnum.enumValues).toEqual(['ACTIVE', 'INACTIVE']);
		expect(memberships.status.default).toBe('ACTIVE');
		expect(organizations.status.default).toBe('PROVISIONING');
	});

	it('stores last selected association on memberships', () => {
		expect(memberships.last_selected_at.name).toBe('last_selected_at');
	});

	it('does not store password hashes on users', () => {
		expect('password_hash' in users).toBe(false);
		expect(Object.keys(users)).not.toContain('password_hash');
	});

	it('defines invitation lifecycle fields and organization document replacement field', () => {
		expect(invitations.type.name).toBe('type');
		expect(invitations.cpf.name).toBe('cpf');
		expect(invitations.max_uses.name).toBe('max_uses');
		expect(invitations.accepted_at.name).toBe('accepted_at');
		expect(invitations.revoked_at.name).toBe('revoked_at');
		expect(organizationDocuments.replaces_document_id.name).toBe('replaces_document_id');
	});

	it('keeps authorization facts on the current membership role', () => {
		expect(memberships.role_id.name).toBe('role_id');
		expect(roles.is_default_join_role.name).toBe('is_default_join_role');
		expect('board_members' in schema).toBe(false);
		expect(provisioningAccess.organization_id.name).toBe('organization_id');
	});
});
