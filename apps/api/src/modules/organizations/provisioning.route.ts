import { createHash, randomBytes } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { createId } from '../../db/ids.js';
import {
	invitations,
	memberships,
	organizationDocuments,
	organizations,
	provisioningAccess,
	roles,
	storedFiles,
} from '../../db/schema/index.js';
import { isValidCpf, normalizeCpf } from '../../shared/validation/cpf.js';
import { findProvisioningAccess } from './provisioning-access.js';
import {
	calculateProvisioningReadiness,
	type ProvisioningDocumentType,
} from './provisioning-readiness.js';

const errorSchema = z.object({ error: z.string(), code: z.string() });
const paramsSchema = z.object({ organizationId: z.string() });
const roleParamsSchema = paramsSchema.extend({ roleId: z.string() });
const roleInputSchema = z.object({
	name: z.string().trim().min(2).max(80),
	isBoardRole: z.boolean().default(false),
	isFullAccess: z.boolean().default(false),
	isDefaultJoinRole: z.boolean().default(false),
});
const roleSchema = z.object({
	id: z.string(),
	name: z.string(),
	isBoardRole: z.boolean(),
	isFullAccess: z.boolean(),
	isDefaultJoinRole: z.boolean(),
	status: z.string(),
});
const readinessSchema = z.object({
	institutionalDataComplete: z.boolean(),
	rolesComplete: z.boolean(),
	boardComplete: z.boolean(),
	fullAccessMemberPresent: z.boolean(),
	canActivate: z.boolean(),
	missing: z.array(
		z.enum([
			'STATUTE',
			'ELECTION_RECORD',
			'DEFAULT_JOIN_ROLE',
			'FULL_ACCESS_ROLE',
			'BOARD_OCCUPANTS',
			'FULL_ACCESS_MEMBER',
		])
	),
	representedBoardRoleIds: z.array(z.string()),
});
const progressResponseSchema = z.object({
	organization: z.object({
		id: z.string(),
		name: z.string(),
		abbreviation: z.string(),
		documentNumber: z.string(),
		status: z.literal('PROVISIONING'),
	}),
	documents: z.array(
		z.object({
			id: z.string(),
			type: z.enum(['STATUTE', 'ELECTION_RECORD']),
			fileName: z.string(),
			createdAt: z.string(),
		})
	),
	roles: z.array(roleSchema),
	invitations: z.array(
		z.object({
			id: z.string(),
			cpf: z.string().nullable(),
			targetRoleId: z.string().nullable(),
			status: z.string(),
			expiresAt: z.string(),
		})
	),
	readiness: readinessSchema,
});

function toRole(row: typeof roles.$inferSelect) {
	return {
		id: row.id,
		name: row.name,
		isBoardRole: row.is_board_role,
		isFullAccess: row.is_full_access,
		isDefaultJoinRole: row.is_default_join_role,
		status: row.status,
	};
}

function defaultRoleIsEligible(input: z.infer<typeof roleInputSchema>) {
	return !input.isDefaultJoinRole || (!input.isBoardRole && !input.isFullAccess);
}

const routes: FastifyPluginAsyncZod = async app => {
	app.get(
		'/organizations/:organizationId/provisioning',
		{
			preHandler: app.requireAuth,
			schema: {
				params: paramsSchema,
				response: { 200: progressResponseSchema, 403: errorSchema, 404: errorSchema },
			},
		},
		async (request, reply) => {
			if (!app.database || !request.actor)
				return reply
					.status(403)
					.send({ error: 'Provisioning access required', code: 'PROVISIONING_ACCESS_REQUIRED' });

			const access = await findProvisioningAccess({
				database: app.database.db,
				organizationId: request.params.organizationId,
				userId: request.actor.id,
			});
			if (!access)
				return reply
					.status(403)
					.send({ error: 'Provisioning access required', code: 'PROVISIONING_ACCESS_REQUIRED' });

			const [organization] = await app.database.db
				.select()
				.from(organizations)
				.where(eq(organizations.id, request.params.organizationId))
				.limit(1);
			if (!organization)
				return reply
					.status(404)
					.send({ error: 'Organization not found', code: 'ORGANIZATION_NOT_FOUND' });

			const [documentRows, roleRows, membershipRows, invitationRows] = await Promise.all([
				app.database.db
					.select({
						id: organizationDocuments.id,
						type: organizationDocuments.type,
						fileName: storedFiles.original_file_name,
						createdAt: organizationDocuments.created_at,
					})
					.from(organizationDocuments)
					.innerJoin(storedFiles, eq(storedFiles.id, organizationDocuments.stored_file_id))
					.where(eq(organizationDocuments.organization_id, organization.id))
					.orderBy(desc(organizationDocuments.created_at)),
				app.database.db.select().from(roles).where(eq(roles.organization_id, organization.id)),
				app.database.db
					.select({ roleId: memberships.role_id, status: memberships.status })
					.from(memberships)
					.where(eq(memberships.organization_id, organization.id)),
				app.database.db
					.select({
						id: invitations.id,
						type: invitations.type,
						status: invitations.status,
						cpf: invitations.cpf,
						targetRoleId: invitations.target_role_id,
						expiresAt: invitations.expires_at,
					})
					.from(invitations)
					.where(eq(invitations.organization_id, organization.id))
					.orderBy(desc(invitations.created_at)),
			]);

			const currentDocuments = documentRows.filter(
				(document, index, documents) =>
					documents.findIndex(candidate => candidate.type === document.type) === index
			);
			const mappedRoles = roleRows.map(toRole);
			const readiness = calculateProvisioningReadiness({
				documentTypes: currentDocuments.map(document => document.type as ProvisioningDocumentType),
				roles: mappedRoles,
				memberships: membershipRows,
				invitations: invitationRows,
			});

			return {
				organization: {
					id: organization.id,
					name: organization.name,
					abbreviation: organization.abbreviation,
					documentNumber: organization.document_number,
					status: 'PROVISIONING' as const,
				},
				documents: currentDocuments.map(document => ({
					id: document.id,
					type: document.type,
					fileName: document.fileName,
					createdAt: document.createdAt.toISOString(),
				})),
				roles: mappedRoles,
				invitations: invitationRows.map(invitation => ({
					id: invitation.id,
					cpf: invitation.cpf,
					targetRoleId: invitation.targetRoleId,
					status: invitation.status,
					expiresAt: invitation.expiresAt.toISOString(),
				})),
				readiness,
			};
		}
	);

	app.get(
		'/organizations/:organizationId/roles',
		{
			preHandler: app.requireAuth,
			schema: {
				params: paramsSchema,
				response: { 200: z.object({ roles: z.array(roleSchema) }), 403: errorSchema },
			},
		},
		async (request, reply) => {
			if (
				!app.database ||
				!request.actor ||
				!(await findProvisioningAccess({
					database: app.database.db,
					organizationId: request.params.organizationId,
					userId: request.actor.id,
					requiredScope: 'roles',
				}))
			)
				return reply
					.status(403)
					.send({ error: 'Provisioning access required', code: 'PROVISIONING_ACCESS_REQUIRED' });

			const rows = await app.database.db
				.select()
				.from(roles)
				.where(eq(roles.organization_id, request.params.organizationId));
			return { roles: rows.map(toRole) };
		}
	);

	app.post(
		'/organizations/:organizationId/roles',
		{
			preHandler: app.requireAuth,
			schema: {
				params: paramsSchema,
				body: roleInputSchema,
				response: {
					201: z.object({ role: roleSchema }),
					400: errorSchema,
					403: errorSchema,
					409: errorSchema,
				},
			},
		},
		async (request, reply) => {
			if (
				!app.database ||
				!request.actor ||
				!(await findProvisioningAccess({
					database: app.database.db,
					organizationId: request.params.organizationId,
					userId: request.actor.id,
					requiredScope: 'roles',
				}))
			)
				return reply
					.status(403)
					.send({ error: 'Provisioning access required', code: 'PROVISIONING_ACCESS_REQUIRED' });

			if (!defaultRoleIsEligible(request.body))
				return reply
					.status(400)
					.send({ error: 'Default join role is not eligible', code: 'INVALID_DEFAULT_JOIN_ROLE' });

			try {
				const [created] = await app.database.db
					.insert(roles)
					.values({
						organization_id: request.params.organizationId,
						name: request.body.name,
						is_board_role: request.body.isBoardRole,
						is_full_access: request.body.isFullAccess,
						is_default_join_role: request.body.isDefaultJoinRole,
					})
					.returning();
				if (!created) throw new Error('Role was not created');
				return reply.status(201).send({ role: toRole(created) });
			} catch (cause) {
				if ((cause as { code?: string }).code === '23505')
					return reply.status(409).send({
						error: 'Role already exists or default role is already configured',
						code: 'ROLE_CONFLICT',
					});
				throw cause;
			}
		}
	);

	app.patch(
		'/organizations/:organizationId/roles/:roleId',
		{
			preHandler: app.requireAuth,
			schema: {
				params: roleParamsSchema,
				body: roleInputSchema,
				response: {
					200: z.object({ role: roleSchema }),
					400: errorSchema,
					403: errorSchema,
					404: errorSchema,
					409: errorSchema,
				},
			},
		},
		async (request, reply) => {
			if (
				!app.database ||
				!request.actor ||
				!(await findProvisioningAccess({
					database: app.database.db,
					organizationId: request.params.organizationId,
					userId: request.actor.id,
					requiredScope: 'roles',
				}))
			)
				return reply
					.status(403)
					.send({ error: 'Provisioning access required', code: 'PROVISIONING_ACCESS_REQUIRED' });

			if (!defaultRoleIsEligible(request.body))
				return reply
					.status(400)
					.send({ error: 'Default join role is not eligible', code: 'INVALID_DEFAULT_JOIN_ROLE' });

			try {
				const updated = await app.database.db.transaction(async transaction => {
					const [existing] = await transaction
						.select({ id: roles.id })
						.from(roles)
						.where(
							and(
								eq(roles.id, request.params.roleId),
								eq(roles.organization_id, request.params.organizationId)
							)
						)
						.limit(1);
					if (!existing) return null;

					if (request.body.isDefaultJoinRole)
						await transaction
							.update(roles)
							.set({ is_default_join_role: false, updated_at: new Date() })
							.where(
								and(
									eq(roles.organization_id, request.params.organizationId),
									eq(roles.is_default_join_role, true)
								)
							);

					const [role] = await transaction
						.update(roles)
						.set({
							name: request.body.name,
							is_board_role: request.body.isBoardRole,
							is_full_access: request.body.isFullAccess,
							is_default_join_role: request.body.isDefaultJoinRole,
							updated_at: new Date(),
						})
						.where(eq(roles.id, request.params.roleId))
						.returning();
					return role ?? null;
				});
				if (!updated)
					return reply.status(404).send({ error: 'Role not found', code: 'ROLE_NOT_FOUND' });
				return { role: toRole(updated) };
			} catch (cause) {
				if ((cause as { code?: string }).code === '23505')
					return reply
						.status(409)
						.send({ error: 'Role name already exists', code: 'ROLE_CONFLICT' });
				throw cause;
			}
		}
	);

	app.post(
		'/organizations/:organizationId/invitations',
		{
			preHandler: app.requireAuth,
			schema: {
				params: paramsSchema,
				body: z.object({
					type: z.enum(['INDIVIDUAL', 'GLOBAL']),
					cpf: z.string().optional(),
					targetRoleId: z.string().optional(),
					maxUses: z.number().int().min(2).nullable().optional(),
				}),
				response: {
					201: z.object({ invitationId: z.string(), token: z.string() }),
					400: errorSchema,
					403: errorSchema,
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			if (
				!app.database ||
				!request.actor ||
				!(await findProvisioningAccess({
					database: app.database.db,
					organizationId: request.params.organizationId,
					userId: request.actor.id,
					requiredScope: 'board',
				}))
			)
				return reply
					.status(403)
					.send({ error: 'Provisioning access required', code: 'PROVISIONING_ACCESS_REQUIRED' });

			const body = request.body;
			const cpf = body.type === 'INDIVIDUAL' && body.cpf ? normalizeCpf(body.cpf) : null;
			if (body.type === 'INDIVIDUAL' && (!cpf || !isValidCpf(cpf)))
				return reply.status(400).send({ error: 'A valid CPF is required', code: 'CPF_REQUIRED' });
			if (body.type === 'INDIVIDUAL' && !body.targetRoleId)
				return reply
					.status(400)
					.send({ error: 'Individual invitation requires a role', code: 'ROLE_REQUIRED' });

			let targetRole: typeof roles.$inferSelect | undefined;
			if (body.targetRoleId) {
				[targetRole] = await app.database.db
					.select()
					.from(roles)
					.where(
						and(
							eq(roles.id, body.targetRoleId),
							eq(roles.organization_id, request.params.organizationId),
							eq(roles.status, 'ACTIVE')
						)
					)
					.limit(1);
				if (!targetRole)
					return reply.status(404).send({ error: 'Role not found', code: 'ROLE_NOT_FOUND' });
			}
			if (
				body.type === 'GLOBAL' &&
				targetRole &&
				(targetRole.is_board_role || targetRole.is_full_access)
			)
				return reply.status(400).send({
					error: 'Global invitation cannot target board or full-access roles',
					code: 'GLOBAL_INVITATION_ROLE_NOT_ELIGIBLE',
				});

			const actorId = request.actor.id;
			const token = randomBytes(32).toString('base64url');
			const invitationId = createId('invitation');
			await app.database.db.transaction(async transaction => {
				const [previous] = cpf
					? await transaction
							.select({ id: invitations.id })
							.from(invitations)
							.where(
								and(
									eq(invitations.organization_id, request.params.organizationId),
									eq(invitations.type, 'INDIVIDUAL'),
									eq(invitations.cpf, cpf),
									eq(invitations.status, 'PENDING')
								)
							)
							.limit(1)
					: [];

				if (previous)
					await transaction
						.update(invitations)
						.set({
							status: 'REVOKED',
							revoked_at: new Date(),
							replaced_by_invitation_id: invitationId,
						})
						.where(eq(invitations.id, previous.id));

				await transaction.insert(invitations).values({
					id: invitationId,
					organization_id: request.params.organizationId,
					type: body.type,
					cpf,
					target_role_id: body.targetRoleId,
					max_uses: body.type === 'GLOBAL' ? (body.maxUses ?? null) : 1,
					token_hash: createHash('sha256').update(token).digest('hex'),
					expires_at: new Date(Date.now() + 30 * 86_400_000),
					invited_by_user_id: actorId,
				});
			});

			return reply.status(201).send({ invitationId, token });
		}
	);

	app.post(
		'/invitations/:token/accept',
		{
			preHandler: app.requireAuth,
			schema: {
				params: z.object({ token: z.string() }),
				response: {
					200: z.object({ membershipId: z.string(), organizationId: z.string() }),
					400: errorSchema,
					403: errorSchema,
					404: errorSchema,
				},
			},
		},
		async (request, reply) => {
			if (!app.database || !request.actor)
				return reply.status(403).send({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
			const actorId = request.actor.id;

			const hash = createHash('sha256').update(request.params.token).digest('hex');
			const [invite] = await app.database.db
				.select()
				.from(invitations)
				.where(and(eq(invitations.token_hash, hash), eq(invitations.status, 'PENDING')))
				.limit(1);
			if (!invite)
				return reply
					.status(404)
					.send({ error: 'Invitation is invalid or expired', code: 'INVITATION_INVALID' });

			if (invite.expires_at <= new Date()) {
				await app.database.db
					.update(invitations)
					.set({ status: 'EXPIRED' })
					.where(eq(invitations.id, invite.id));
				return reply
					.status(404)
					.send({ error: 'Invitation is invalid or expired', code: 'INVITATION_INVALID' });
			}
			if (invite.max_uses !== null && invite.uses_count >= invite.max_uses)
				return reply
					.status(404)
					.send({ error: 'Invitation is invalid or expired', code: 'INVITATION_INVALID' });
			if (invite.cpf && invite.cpf !== request.actor.documentNumber)
				return reply.status(403).send({
					error: 'Invitation does not belong to this CPF',
					code: 'INVITATION_CPF_MISMATCH',
				});

			const [existing] = await app.database.db
				.select()
				.from(memberships)
				.where(
					and(
						eq(memberships.organization_id, invite.organization_id),
						eq(memberships.user_id, request.actor.id)
					)
				)
				.limit(1);

			if (existing?.status === 'ACTIVE') {
				if (invite.type === 'INDIVIDUAL')
					await app.database.db
						.update(invitations)
						.set({ status: 'ACCEPTED', accepted_at: new Date() })
						.where(eq(invitations.id, invite.id));
				return reply.send({ membershipId: existing.id, organizationId: invite.organization_id });
			}

			const [targetRole] = invite.target_role_id
				? await app.database.db
						.select()
						.from(roles)
						.where(
							and(
								eq(roles.organization_id, invite.organization_id),
								eq(roles.id, invite.target_role_id),
								eq(roles.status, 'ACTIVE')
							)
						)
						.limit(1)
				: [];
			const [fallbackRole] = await app.database.db
				.select()
				.from(roles)
				.where(
					and(
						eq(roles.organization_id, invite.organization_id),
						eq(roles.is_default_join_role, true),
						eq(roles.status, 'ACTIVE')
					)
				)
				.limit(1);
			const selectedRole = targetRole ?? fallbackRole;
			if (!selectedRole)
				return reply
					.status(400)
					.send({ error: 'Organization has no eligible role', code: 'ROLE_NOT_CONFIGURED' });
			if (invite.type === 'GLOBAL' && (selectedRole.is_board_role || selectedRole.is_full_access))
				return reply.status(400).send({
					error: 'Global invitation role is not eligible',
					code: 'GLOBAL_INVITATION_ROLE_NOT_ELIGIBLE',
				});

			const result = await app.database.db.transaction(async transaction => {
				const [membership] = existing
					? await transaction
							.update(memberships)
							.set({
								status: 'ACTIVE',
								role_id: selectedRole.id,
								reactivated_at: new Date(),
								updated_at: new Date(),
							})
							.where(eq(memberships.id, existing.id))
							.returning({ id: memberships.id })
					: await transaction
							.insert(memberships)
							.values({
								organization_id: invite.organization_id,
								user_id: actorId,
								role_id: selectedRole.id,
							})
							.returning({ id: memberships.id });
				if (!membership) throw new Error('Membership was not created');

				const nextUsesCount = invite.uses_count + 1;
				const exhausted =
					invite.type === 'GLOBAL' && invite.max_uses !== null && nextUsesCount >= invite.max_uses;
				await transaction
					.update(invitations)
					.set({
						status: invite.type === 'INDIVIDUAL' ? 'ACCEPTED' : exhausted ? 'EXHAUSTED' : 'PENDING',
						uses_count: nextUsesCount,
						accepted_at: invite.type === 'INDIVIDUAL' ? new Date() : null,
					})
					.where(eq(invitations.id, invite.id));
				return membership;
			});

			return reply.send({ membershipId: result.id, organizationId: invite.organization_id });
		}
	);

	app.post(
		'/organizations/:organizationId/activate',
		{
			preHandler: app.requireAuth,
			schema: {
				params: paramsSchema,
				response: {
					200: z.object({ status: z.literal('OPERATIONAL') }),
					403: errorSchema,
					409: errorSchema,
				},
			},
		},
		async (request, reply) => {
			if (
				!app.database ||
				!request.actor ||
				!(await findProvisioningAccess({
					database: app.database.db,
					organizationId: request.params.organizationId,
					userId: request.actor.id,
					requiredScope: 'activation',
				}))
			)
				return reply
					.status(403)
					.send({ error: 'Provisioning access required', code: 'PROVISIONING_ACCESS_REQUIRED' });

			const [documentRows, roleRows, membershipRows, invitationRows] = await Promise.all([
				app.database.db
					.select({ type: organizationDocuments.type })
					.from(organizationDocuments)
					.where(eq(organizationDocuments.organization_id, request.params.organizationId)),
				app.database.db
					.select()
					.from(roles)
					.where(eq(roles.organization_id, request.params.organizationId)),
				app.database.db
					.select({ roleId: memberships.role_id, status: memberships.status })
					.from(memberships)
					.where(eq(memberships.organization_id, request.params.organizationId)),
				app.database.db
					.select({
						type: invitations.type,
						status: invitations.status,
						targetRoleId: invitations.target_role_id,
						expiresAt: invitations.expires_at,
					})
					.from(invitations)
					.where(eq(invitations.organization_id, request.params.organizationId)),
			]);
			const readiness = calculateProvisioningReadiness({
				documentTypes: documentRows.map(document => document.type as ProvisioningDocumentType),
				roles: roleRows.map(toRole),
				memberships: membershipRows,
				invitations: invitationRows,
			});
			if (!readiness.canActivate)
				return reply.status(409).send({
					error: `Provisioning is incomplete: ${readiness.missing.join(', ')}`,
					code: 'PROVISIONING_INCOMPLETE',
				});

			await app.database.db.transaction(async transaction => {
				await transaction
					.update(organizations)
					.set({ status: 'OPERATIONAL', updated_at: new Date() })
					.where(
						and(
							eq(organizations.id, request.params.organizationId),
							eq(organizations.status, 'PROVISIONING')
						)
					);
				await transaction
					.update(provisioningAccess)
					.set({ status: 'COMPLETED', completed_at: new Date() })
					.where(
						and(
							eq(provisioningAccess.organization_id, request.params.organizationId),
							eq(provisioningAccess.status, 'ACTIVE')
						)
					);
			});

			return { status: 'OPERATIONAL' as const };
		}
	);
};

export default routes;
