export type OrganizationStatus = 'PROVISIONING' | 'OPERATIONAL' | 'INACTIVE';
export type ProvisioningDocumentType = 'STATUTE' | 'ELECTION_RECORD';
export type ProvisioningMissingRequirement =
	| 'STATUTE'
	| 'ELECTION_RECORD'
	| 'DEFAULT_JOIN_ROLE'
	| 'FULL_ACCESS_ROLE'
	| 'BOARD_OCCUPANTS'
	| 'FULL_ACCESS_MEMBER';

export interface ProvisioningRole {
	id: string;
	name: string;
	isBoardRole: boolean;
	isFullAccess: boolean;
	isDefaultJoinRole: boolean;
	status: string;
}

export interface ProvisioningProgress {
	organization: {
		id: string;
		name: string;
		abbreviation: string;
		documentNumber: string;
		status: 'PROVISIONING';
	};
	documents: Array<{
		id: string;
		type: ProvisioningDocumentType;
		fileName: string;
		createdAt: string;
	}>;
	roles: ProvisioningRole[];
	invitations: Array<{
		id: string;
		cpf: string | null;
		targetRoleId: string | null;
		status: string;
		expiresAt: string;
	}>;
	readiness: {
		institutionalDataComplete: boolean;
		rolesComplete: boolean;
		boardComplete: boolean;
		fullAccessMemberPresent: boolean;
		canActivate: boolean;
		missing: ProvisioningMissingRequirement[];
		representedBoardRoleIds: string[];
	};
}

export interface ProvisioningRoleInput {
	name: string;
	isBoardRole: boolean;
	isFullAccess: boolean;
	isDefaultJoinRole: boolean;
}
