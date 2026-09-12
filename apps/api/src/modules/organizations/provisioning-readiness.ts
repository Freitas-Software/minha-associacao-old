export type ProvisioningDocumentType = 'STATUTE' | 'ELECTION_RECORD';

export type ProvisioningMissingRequirement =
	| 'STATUTE'
	| 'ELECTION_RECORD'
	| 'DEFAULT_JOIN_ROLE'
	| 'FULL_ACCESS_ROLE'
	| 'BOARD_OCCUPANTS'
	| 'FULL_ACCESS_MEMBER';

export interface ProvisioningReadinessInput {
	documentTypes: ProvisioningDocumentType[];
	roles: Array<{
		id: string;
		isBoardRole: boolean;
		isDefaultJoinRole: boolean;
		isFullAccess: boolean;
		status: string;
	}>;
	memberships: Array<{ roleId: string; status: string }>;
	invitations: Array<{
		expiresAt: Date;
		status: string;
		targetRoleId: string | null;
		type: string;
	}>;
	now?: Date;
}

export interface ProvisioningReadiness {
	institutionalDataComplete: boolean;
	rolesComplete: boolean;
	boardComplete: boolean;
	fullAccessMemberPresent: boolean;
	canActivate: boolean;
	missing: ProvisioningMissingRequirement[];
	representedBoardRoleIds: string[];
}

export function calculateProvisioningReadiness(
	input: ProvisioningReadinessInput
): ProvisioningReadiness {
	const now = input.now ?? new Date();
	const activeRoles = input.roles.filter(role => role.status === 'ACTIVE');
	const activeMembershipRoleIds = new Set(
		input.memberships
			.filter(membership => membership.status === 'ACTIVE')
			.map(membership => membership.roleId)
	);
	const pendingInvitationRoleIds = new Set(
		input.invitations
			.filter(
				invitation =>
					invitation.type === 'INDIVIDUAL' &&
					invitation.status === 'PENDING' &&
					invitation.expiresAt > now &&
					invitation.targetRoleId !== null
			)
			.map(invitation => invitation.targetRoleId as string)
	);
	const representedBoardRoleIds = activeRoles
		.filter(
			role =>
				role.isBoardRole &&
				(activeMembershipRoleIds.has(role.id) || pendingInvitationRoleIds.has(role.id))
		)
		.map(role => role.id);
	const boardRoleIds = activeRoles.filter(role => role.isBoardRole).map(role => role.id);
	const hasStatute = input.documentTypes.includes('STATUTE');
	const hasElectionRecord = input.documentTypes.includes('ELECTION_RECORD');
	const hasDefaultJoinRole = activeRoles.some(role => role.isDefaultJoinRole);
	const fullAccessRoleIds = new Set(
		activeRoles.filter(role => role.isFullAccess).map(role => role.id)
	);
	const hasFullAccessRole = fullAccessRoleIds.size > 0;
	const fullAccessMemberPresent = [...activeMembershipRoleIds].some(roleId =>
		fullAccessRoleIds.has(roleId)
	);
	const boardComplete = boardRoleIds.every(roleId => representedBoardRoleIds.includes(roleId));
	const institutionalDataComplete = hasStatute && hasElectionRecord;
	const rolesComplete = hasDefaultJoinRole && hasFullAccessRole;
	const missing: ProvisioningMissingRequirement[] = [];

	if (!hasStatute) missing.push('STATUTE');
	if (!hasElectionRecord) missing.push('ELECTION_RECORD');
	if (!hasDefaultJoinRole) missing.push('DEFAULT_JOIN_ROLE');
	if (!hasFullAccessRole) missing.push('FULL_ACCESS_ROLE');
	if (!boardComplete) missing.push('BOARD_OCCUPANTS');
	if (!fullAccessMemberPresent) missing.push('FULL_ACCESS_MEMBER');

	return {
		institutionalDataComplete,
		rolesComplete,
		boardComplete,
		fullAccessMemberPresent,
		canActivate:
			institutionalDataComplete && rolesComplete && boardComplete && fullAccessMemberPresent,
		missing,
		representedBoardRoleIds,
	};
}
