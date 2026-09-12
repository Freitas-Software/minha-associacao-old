import { and, desc, eq } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { createId } from '../../db/ids.js';
import {
	memberships,
	organizationDocuments,
	organizations,
	provisioningAccess,
	storedFiles,
} from '../../db/schema/index.js';
import { lookupCnpj } from './cnpj-registry.js';
import { findProvisioningAccess } from './provisioning-access.js';
import { createObjectStorage } from './storage.js';

const errorResponse = z.object({ error: z.string(), code: z.string() });
const organizationResponse = z.object({
	organization: z.object({
		id: z.string(),
		name: z.string(),
		abbreviation: z.string(),
		documentNumber: z.string(),
		status: z.string(),
		accessType: z.enum(['PROVISIONING', 'MEMBERSHIP']),
	}),
});

const routes: FastifyPluginAsyncZod = async app => {
	app.get('/organizations', { preHandler: app.requireAuth }, async (request, reply) => {
		if (!app.database || !request.actor)
			return reply.status(503).send({ error: 'Service unavailable', code: 'SERVICE_UNAVAILABLE' });
		const [provisioningRows, membershipRows] = await Promise.all([
			app.database.db
				.select({
					id: organizations.id,
					name: organizations.name,
					abbreviation: organizations.abbreviation,
					documentNumber: organizations.document_number,
					status: organizations.status,
				})
				.from(organizations)
				.innerJoin(provisioningAccess, eq(provisioningAccess.organization_id, organizations.id))
				.where(
					and(
						eq(provisioningAccess.user_id, request.actor.id),
						eq(provisioningAccess.status, 'ACTIVE'),
						eq(organizations.status, 'PROVISIONING')
					)
				),
			app.database.db
				.select({
					id: organizations.id,
					name: organizations.name,
					abbreviation: organizations.abbreviation,
					documentNumber: organizations.document_number,
					status: organizations.status,
				})
				.from(organizations)
				.innerJoin(memberships, eq(memberships.organization_id, organizations.id))
				.where(and(eq(memberships.user_id, request.actor.id), eq(memberships.status, 'ACTIVE'))),
		]);
		const result = new Map<
			string,
			(typeof membershipRows)[number] & { accessType: 'PROVISIONING' | 'MEMBERSHIP' }
		>(
			membershipRows.map(organization => [
				organization.id,
				{ ...organization, accessType: 'MEMBERSHIP' as const },
			])
		);
		for (const organization of provisioningRows)
			result.set(organization.id, { ...organization, accessType: 'PROVISIONING' });

		return { organizations: [...result.values()] };
	});

	app.get(
		'/organizations/:organizationId/access',
		{
			preHandler: app.requireAuth,
			schema: {
				params: z.object({ organizationId: z.string() }),
				response: {
					200: organizationResponse,
					403: errorResponse,
					404: errorResponse,
				},
			},
		},
		async (request, reply) => {
			if (!app.database || !request.actor)
				return reply.status(403).send({ error: 'Access denied', code: 'ACCESS_DENIED' });
			const [organization] = await app.database.db
				.select({
					id: organizations.id,
					name: organizations.name,
					abbreviation: organizations.abbreviation,
					documentNumber: organizations.document_number,
					status: organizations.status,
				})
				.from(organizations)
				.where(eq(organizations.id, request.params.organizationId))
				.limit(1);
			if (!organization)
				return reply
					.status(404)
					.send({ error: 'Organization not found', code: 'ORGANIZATION_NOT_FOUND' });

			if (organization.status === 'PROVISIONING') {
				const access = await findProvisioningAccess({
					database: app.database.db,
					organizationId: organization.id,
					userId: request.actor.id,
				});
				if (access)
					return { organization: { ...organization, accessType: 'PROVISIONING' as const } };
			}

			if (organization.status === 'OPERATIONAL') {
				const [membership] = await app.database.db
					.select({ id: memberships.id })
					.from(memberships)
					.where(
						and(
							eq(memberships.organization_id, organization.id),
							eq(memberships.user_id, request.actor.id),
							eq(memberships.status, 'ACTIVE')
						)
					)
					.limit(1);
				if (membership)
					return { organization: { ...organization, accessType: 'MEMBERSHIP' as const } };
			}

			return reply.status(403).send({ error: 'Access denied', code: 'ACCESS_DENIED' });
		}
	);

	app.post(
		'/organizations',
		{
			preHandler: app.requireAuth,
			schema: {
				body: z.object({
					documentNumber: z.string().regex(/^\d{14}$/),
					abbreviation: z.string().trim().min(2).max(30).optional(),
				}),
				response: {
					201: organizationResponse,
					400: errorResponse,
					401: errorResponse,
					409: errorResponse,
					503: errorResponse,
				},
			},
		},
		async (request, reply) => {
			if (!app.database || !request.actor)
				return reply
					.status(503)
					.send({ error: 'Service unavailable', code: 'SERVICE_UNAVAILABLE' });
			const lookup = await lookupCnpj(request.body.documentNumber);
			if (!lookup?.legalNature?.toLowerCase().includes('associa'))
				return reply
					.status(400)
					.send({ error: 'CNPJ is not an enabled private association', code: 'CNPJ_NOT_ELIGIBLE' });
			const abbreviation =
				request.body.abbreviation ?? lookup.tradeName ?? lookup.legalName.slice(0, 30);
			const actorId = request.actor.id;
			try {
				const result = await app.database.db.transaction(async tx => {
					const [organization] = await tx
						.insert(organizations)
						.values({
							name: lookup.legalName,
							abbreviation,
							document_number: lookup.documentNumber,
						})
						.returning();
					if (!organization) throw new Error('Organization insert returned no record');
					await tx.insert(provisioningAccess).values({
						id: createId('provisioningAccess'),
						organization_id: organization.id,
						user_id: actorId,
						scopes: ['institutional_data', 'roles', 'board', 'activation'],
					});
					return organization;
				});
				return reply.status(201).send({
					organization: {
						id: result.id,
						name: result.name,
						abbreviation: result.abbreviation,
						documentNumber: result.document_number,
						status: result.status,
						accessType: 'PROVISIONING',
					},
				});
			} catch (error) {
				if ((error as { code?: string }).code === '23505')
					return reply
						.status(409)
						.send({ error: 'Organization already exists', code: 'ORGANIZATION_ALREADY_EXISTS' });
				throw error;
			}
		}
	);

	app.post(
		'/organizations/:organizationId/documents',
		{
			preHandler: app.requireAuth,
			schema: {
				params: z.object({ organizationId: z.string() }),
				body: z.object({
					type: z.enum(['STATUTE', 'ELECTION_RECORD']),
					fileName: z.string().trim().min(1).max(255),
					mimeType: z.literal('application/pdf'),
					contentBase64: z.string().min(1),
				}),
				response: {
					201: z.object({ documentId: z.string() }),
					400: errorResponse,
					403: errorResponse,
					503: errorResponse,
				},
			},
		},
		async (request, reply) => {
			if (!app.database || !request.actor)
				return reply
					.status(503)
					.send({ error: 'Service unavailable', code: 'SERVICE_UNAVAILABLE' });
			const actorId = request.actor.id;
			const access = await findProvisioningAccess({
				database: app.database.db,
				organizationId: request.params.organizationId,
				userId: request.actor.id,
				requiredScope: 'institutional_data',
			});
			if (!access)
				return reply
					.status(403)
					.send({ error: 'Provisioning access required', code: 'PROVISIONING_ACCESS_REQUIRED' });
			const content = Buffer.from(request.body.contentBase64, 'base64');
			if (content.length === 0 || content.length > 15 * 1024 * 1024)
				return reply.status(400).send({ error: 'Invalid file size', code: 'INVALID_FILE' });
			if (content.subarray(0, 5).toString('ascii') !== '%PDF-')
				return reply.status(400).send({ error: 'Invalid PDF file', code: 'INVALID_FILE' });
			const [previousDocument] = await app.database.db
				.select({ id: organizationDocuments.id })
				.from(organizationDocuments)
				.where(
					and(
						eq(organizationDocuments.organization_id, request.params.organizationId),
						eq(organizationDocuments.type, request.body.type)
					)
				)
				.orderBy(desc(organizationDocuments.created_at))
				.limit(1);
			const key = `${request.params.organizationId}/${createId('storedFile')}-${request.body.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
			const stored = await createObjectStorage().put({
				key,
				content,
				contentType: request.body.mimeType,
			});
			const document = await app.database.db.transaction(async tx => {
				const [file] = await tx
					.insert(storedFiles)
					.values({
						object_key: stored.objectKey,
						public_url: stored.publicUrl,
						original_file_name: request.body.fileName,
						mime_type: request.body.mimeType,
						size_bytes: content.length,
						checksum_sha256: stored.checksumSha256,
						uploaded_by_user_id: actorId,
					})
					.returning({ id: storedFiles.id });
				if (!file) throw new Error('Stored file insert returned no record');
				const [doc] = await tx
					.insert(organizationDocuments)
					.values({
						organization_id: request.params.organizationId,
						type: request.body.type,
						stored_file_id: file.id,
						uploaded_by_user_id: actorId,
						replaces_document_id: previousDocument?.id,
					})
					.returning({ id: organizationDocuments.id });
				if (!doc) throw new Error('Organization document insert returned no record');
				return doc;
			});
			return reply.status(201).send({ documentId: document.id });
		}
	);
};

export default routes;
