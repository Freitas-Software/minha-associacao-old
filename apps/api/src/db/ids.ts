import { typeid } from 'typeid-js';

const idPrefixes = {
	organization: 'org',
	user: 'usr',
	membership: 'mbr',
	role: 'rol',
	permission: 'prm',
	provisioningAccess: 'pax',
	storedFile: 'fil',
	organizationDocument: 'doc',
	invitation: 'inv',
	auditLog: 'aud',
	billingConfiguration: 'blc',
	roleBillingPolicy: 'rbp',
	charge: 'chg',
	payment: 'pay',
	paymentAllocation: 'pya',
	refund: 'rfd',
	forgiveness: 'fgn',
	delinquencyException: 'dex',
	membershipRestriction: 'mrt',
	barterOperation: 'btr',
	barterAllocation: 'bta',
} as const;

export type IdEntity = keyof typeof idPrefixes;

export function createId(entity: IdEntity): string {
	return typeid(idPrefixes[entity]).toString();
}
