import { apiRequest } from '@/lib/api';
import type {
	ProvisioningDocumentType,
	ProvisioningProgress,
	ProvisioningRole,
	ProvisioningRoleInput,
} from './types';

export function getProvisioningProgress(organizationId: string) {
	return apiRequest<ProvisioningProgress>(`/api/organizations/${organizationId}/provisioning`);
}

export function uploadProvisioningDocument(input: {
	organizationId: string;
	type: ProvisioningDocumentType;
	fileName: string;
	contentBase64: string;
}) {
	return apiRequest<{ documentId: string }>(
		`/api/organizations/${input.organizationId}/documents`,
		{
			method: 'POST',
			body: JSON.stringify({
				type: input.type,
				fileName: input.fileName,
				mimeType: 'application/pdf',
				contentBase64: input.contentBase64,
			}),
		}
	);
}

export function saveProvisioningRole(input: {
	organizationId: string;
	roleId?: string;
	role: ProvisioningRoleInput;
}) {
	const path = input.roleId
		? `/api/organizations/${input.organizationId}/roles/${input.roleId}`
		: `/api/organizations/${input.organizationId}/roles`;
	return apiRequest<{ role: ProvisioningRole }>(path, {
		method: input.roleId ? 'PATCH' : 'POST',
		body: JSON.stringify(input.role),
	});
}

export function createProvisioningInvitation(input: {
	organizationId: string;
	cpf: string;
	targetRoleId: string;
}) {
	return apiRequest<{ invitationId: string; token: string }>(
		`/api/organizations/${input.organizationId}/invitations`,
		{
			method: 'POST',
			body: JSON.stringify({
				type: 'INDIVIDUAL',
				cpf: input.cpf,
				targetRoleId: input.targetRoleId,
			}),
		}
	);
}

export function acceptInvitation(token: string) {
	return apiRequest<{ membershipId: string; organizationId: string }>(
		`/api/invitations/${encodeURIComponent(token)}/accept`,
		{ method: 'POST' }
	);
}

export function activateOrganization(organizationId: string) {
	return apiRequest<{ status: 'OPERATIONAL' }>(
		`/api/organizations/${organizationId}/activate`,
		{ method: 'POST' }
	);
}
