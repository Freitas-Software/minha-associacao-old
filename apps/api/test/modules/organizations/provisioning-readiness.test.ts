import { describe, expect, it } from 'vitest';
import { calculateProvisioningReadiness } from '../../../src/modules/organizations/provisioning-readiness.js';

const NOW = new Date('2026-08-23T12:00:00.000Z');

describe('organization provisioning readiness', () => {
	it('reports every missing activation invariant', () => {
		const result = calculateProvisioningReadiness({
			documentTypes: [],
			roles: [
				{
					id: 'role_board',
					isBoardRole: true,
					isDefaultJoinRole: false,
					isFullAccess: false,
					status: 'ACTIVE',
				},
			],
			memberships: [],
			invitations: [],
			now: NOW,
		});

		expect(result.canActivate).toBe(false);
		expect(result.missing).toEqual([
			'STATUTE',
			'ELECTION_RECORD',
			'DEFAULT_JOIN_ROLE',
			'FULL_ACCESS_ROLE',
			'BOARD_OCCUPANTS',
			'FULL_ACCESS_MEMBER',
		]);
	});

	it('accepts a pending individual invitation as board representation but not as membership', () => {
		const result = calculateProvisioningReadiness({
			documentTypes: ['STATUTE', 'ELECTION_RECORD'],
			roles: [
				{
					id: 'role_default',
					isBoardRole: false,
					isDefaultJoinRole: true,
					isFullAccess: false,
					status: 'ACTIVE',
				},
				{
					id: 'role_board',
					isBoardRole: true,
					isDefaultJoinRole: false,
					isFullAccess: true,
					status: 'ACTIVE',
				},
			],
			memberships: [],
			invitations: [
				{
					expiresAt: new Date('2026-09-01T12:00:00.000Z'),
					status: 'PENDING',
					targetRoleId: 'role_board',
					type: 'INDIVIDUAL',
				},
			],
			now: NOW,
		});

		expect(result.boardComplete).toBe(true);
		expect(result.fullAccessMemberPresent).toBe(false);
		expect(result.missing).toEqual(['FULL_ACCESS_MEMBER']);
	});

	it('allows activation only after an active full-access member exists', () => {
		const result = calculateProvisioningReadiness({
			documentTypes: ['STATUTE', 'ELECTION_RECORD'],
			roles: [
				{
					id: 'role_default',
					isBoardRole: false,
					isDefaultJoinRole: true,
					isFullAccess: false,
					status: 'ACTIVE',
				},
				{
					id: 'role_board',
					isBoardRole: true,
					isDefaultJoinRole: false,
					isFullAccess: true,
					status: 'ACTIVE',
				},
			],
			memberships: [{ roleId: 'role_board', status: 'ACTIVE' }],
			invitations: [],
			now: NOW,
		});

		expect(result).toMatchObject({
			boardComplete: true,
			canActivate: true,
			fullAccessMemberPresent: true,
			institutionalDataComplete: true,
			missing: [],
			rolesComplete: true,
		});
	});

	it('ignores expired invitations when checking board representation', () => {
		const result = calculateProvisioningReadiness({
			documentTypes: ['STATUTE', 'ELECTION_RECORD'],
			roles: [
				{
					id: 'role_board',
					isBoardRole: true,
					isDefaultJoinRole: false,
					isFullAccess: true,
					status: 'ACTIVE',
				},
			],
			memberships: [],
			invitations: [
				{
					expiresAt: new Date('2026-08-22T12:00:00.000Z'),
					status: 'PENDING',
					targetRoleId: 'role_board',
					type: 'INDIVIDUAL',
				},
			],
			now: NOW,
		});

		expect(result.boardComplete).toBe(false);
		expect(result.representedBoardRoleIds).toEqual([]);
	});
});
