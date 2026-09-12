import { and, eq } from 'drizzle-orm';
import type { Database } from '../../db/client.js';
import { organizations, provisioningAccess } from '../../db/schema/index.js';

export const provisioningScopes = ['institutional_data', 'roles', 'board', 'activation'] as const;

export type ProvisioningScope = (typeof provisioningScopes)[number];

export async function findProvisioningAccess(options: {
	database: Database;
	organizationId: string;
	userId: string;
	requiredScope?: ProvisioningScope;
}) {
	const [access] = await options.database
		.select({
			id: provisioningAccess.id,
			scopes: provisioningAccess.scopes,
		})
		.from(provisioningAccess)
		.innerJoin(organizations, eq(organizations.id, provisioningAccess.organization_id))
		.where(
			and(
				eq(provisioningAccess.organization_id, options.organizationId),
				eq(provisioningAccess.user_id, options.userId),
				eq(provisioningAccess.status, 'ACTIVE'),
				eq(organizations.status, 'PROVISIONING')
			)
		)
		.limit(1);

	if (!access) return null;
	if (!options.requiredScope) return access;

	const scopes = Array.isArray(access.scopes)
		? access.scopes.filter((scope): scope is string => typeof scope === 'string')
		: [];

	return scopes.includes(options.requiredScope) ? access : null;
}
