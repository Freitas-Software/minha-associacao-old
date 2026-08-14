import { typeid } from 'typeid-js';

const idPrefixes = {
	organization: 'org',
	user: 'usr',
	membership: 'mbr',
	role: 'rol',
	permission: 'prm',
	boardMember: 'brd',
	storedFile: 'fil',
	organizationDocument: 'doc',
	invitation: 'inv',
	auditLog: 'aud',
} as const;

export type IdEntity = keyof typeof idPrefixes;

export function createId(entity: IdEntity): string {
	return typeid(idPrefixes[entity]).toString();
}
