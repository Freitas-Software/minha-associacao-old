import * as formCore from '@minha-associacao/form-core';
import { describe, expect, it } from 'vitest';

describe('form-core entrypoint', () => {
	it('exports the shared contexts and error contracts from the source-first package', () => {
		expect(Object.keys(formCore).sort()).toEqual([
			'fieldContext',
			'formContext',
			'getFirstFormErrorMessage',
			'normalizeFieldErrors',
			'normalizeFormErrors',
			'normalizeServerErrors',
			'useFieldContext',
			'useFormContext',
		]);
	});
});
