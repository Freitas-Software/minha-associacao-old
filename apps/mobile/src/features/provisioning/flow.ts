import type { ProvisioningProgress } from './types';

export const provisioningSteps = ['documents', 'roles', 'board', 'review'] as const;
export type ProvisioningStep = (typeof provisioningSteps)[number];

export function getFirstPendingProvisioningStep(
	progress: ProvisioningProgress
): ProvisioningStep {
	if (!progress.readiness.institutionalDataComplete) return 'documents';
	if (!progress.readiness.rolesComplete) return 'roles';
	if (!progress.readiness.boardComplete || !progress.readiness.fullAccessMemberPresent)
		return 'board';
	return 'review';
}
