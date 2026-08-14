import { describe, expect, it } from 'vitest';
import { createId } from '../../src/db/ids.js';

describe('createId', () => {
	it('creates prefixed TypeIDs for domain entities', () => {
		expect(createId('organization')).toMatch(/^org_[0-9a-z]{26}$/);
		expect(createId('user')).toMatch(/^usr_[0-9a-z]{26}$/);
		expect(createId('membership')).toMatch(/^mbr_[0-9a-z]{26}$/);
		expect(createId('role')).toMatch(/^rol_[0-9a-z]{26}$/);
		expect(createId('permission')).toMatch(/^prm_[0-9a-z]{26}$/);
		expect(createId('boardMember')).toMatch(/^brd_[0-9a-z]{26}$/);
		expect(createId('storedFile')).toMatch(/^fil_[0-9a-z]{26}$/);
		expect(createId('organizationDocument')).toMatch(/^doc_[0-9a-z]{26}$/);
		expect(createId('invitation')).toMatch(/^inv_[0-9a-z]{26}$/);
		expect(createId('auditLog')).toMatch(/^aud_[0-9a-z]{26}$/);
	});
});
