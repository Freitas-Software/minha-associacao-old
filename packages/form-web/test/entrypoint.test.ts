import * as formWeb from '@minha-associacao/form-web';
import { describe, expect, it } from 'vitest';

describe('form-web entrypoint', () => {
	it('exposes the curated web form API without deep imports', () => {
		expect(Object.keys(formWeb).sort()).toEqual(['setServerErrors', 'useAppForm', 'withForm']);
	});
});
