export interface NormalizedFormErrors {
	form: string[];
	fields: Record<string, string[]>;
}

interface ErrorValueTask {
	kind: 'value';
	value: unknown;
}

interface IssueFallbackTask {
	cause: unknown;
	errors: unknown;
	kind: 'issue-fallback';
	message: unknown;
	validMessageCount: number;
}

interface ObjectCompletionTask {
	kind: 'object-completion';
	validMessageCount: number;
	value: object;
}

interface ObjectMessageState {
	complete: boolean;
	hasValidMessage: boolean;
	validMessageCount: number;
}

type ErrorTask = ErrorValueTask | IssueFallbackTask | ObjectCompletionTask;

function appendMessage(message: string, messages: string[], uniqueMessages: Set<string>): boolean {
	const normalizedMessage = message.trim();

	if (!normalizedMessage) {
		return false;
	}

	if (!uniqueMessages.has(normalizedMessage)) {
		uniqueMessages.add(normalizedMessage);
		messages.push(normalizedMessage);
	}

	return true;
}

function getOwnDataProperty(value: object, property: string): unknown {
	try {
		const descriptor = Object.getOwnPropertyDescriptor(value, property);
		return descriptor && 'value' in descriptor ? descriptor.value : undefined;
	} catch {
		return undefined;
	}
}

function getOwnPropertyDescriptorsSafely(value: object): Record<string, PropertyDescriptor> {
	try {
		return Object.getOwnPropertyDescriptors(value);
	} catch {
		return {};
	}
}

function isUnknownArray(value: unknown): value is unknown[] {
	try {
		return Array.isArray(value);
	} catch {
		return false;
	}
}

function isErrorInstance(value: unknown): value is Error {
	try {
		return value instanceof Error;
	} catch {
		return false;
	}
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !isUnknownArray(value);
}

function isDirectError(value: unknown): boolean {
	if (typeof value === 'string' || isUnknownArray(value) || isErrorInstance(value)) {
		return true;
	}

	return isUnknownRecord(value) && typeof getOwnDataProperty(value, 'message') === 'string';
}

export function normalizeFieldErrors(error: unknown): string[] {
	const messages: string[] = [];
	const uniqueMessages = new Set<string>();
	const pendingErrors: ErrorTask[] = [{ kind: 'value', value: error }];
	const objectMessageStates = new WeakMap<object, ObjectMessageState>();
	let validMessageCount = 0;

	while (pendingErrors.length > 0) {
		const task = pendingErrors.pop() as ErrorTask;

		if (task.kind === 'issue-fallback') {
			if (validMessageCount !== task.validMessageCount) {
				continue;
			}

			if (
				typeof task.message === 'string' &&
				appendMessage(task.message, messages, uniqueMessages)
			) {
				validMessageCount += 1;
				continue;
			}

			if (task.cause !== undefined) {
				pendingErrors.push({ kind: 'value', value: task.cause });
			}
			if (task.errors !== undefined) {
				pendingErrors.push({ kind: 'value', value: task.errors });
			}
			continue;
		}

		if (task.kind === 'object-completion') {
			const state = objectMessageStates.get(task.value) as ObjectMessageState;
			state.complete = true;
			state.hasValidMessage = validMessageCount !== task.validMessageCount;
			continue;
		}

		const currentError = task.value;

		if (typeof currentError === 'string') {
			if (appendMessage(currentError, messages, uniqueMessages)) {
				validMessageCount += 1;
			}
			continue;
		}

		if (typeof currentError !== 'object' || currentError === null) {
			continue;
		}

		const existingState = objectMessageStates.get(currentError);
		if (existingState) {
			const hasValidMessage = existingState.complete
				? existingState.hasValidMessage
				: validMessageCount !== existingState.validMessageCount;

			if (hasValidMessage) {
				validMessageCount += 1;
			}
			continue;
		}

		objectMessageStates.set(currentError, {
			complete: false,
			hasValidMessage: false,
			validMessageCount,
		});
		pendingErrors.push({
			kind: 'object-completion',
			validMessageCount,
			value: currentError,
		});

		if (isUnknownArray(currentError)) {
			const indexedValues: Array<{ index: number; value: unknown }> = [];

			for (const [property, descriptor] of Object.entries(
				getOwnPropertyDescriptorsSafely(currentError)
			)) {
				const index = Number(property);
				if (
					Number.isInteger(index) &&
					index >= 0 &&
					index < 4_294_967_295 &&
					String(index) === property &&
					'value' in descriptor
				) {
					indexedValues.push({ index, value: descriptor.value });
				}
			}

			indexedValues.sort((left, right) => right.index - left.index);
			for (const indexedValue of indexedValues) {
				pendingErrors.push({ kind: 'value', value: indexedValue.value });
			}
			continue;
		}

		const issues = getOwnDataProperty(currentError, 'issues');
		if (issues !== undefined) {
			pendingErrors.push({
				cause: getOwnDataProperty(currentError, 'cause'),
				errors: getOwnDataProperty(currentError, 'errors'),
				kind: 'issue-fallback',
				message: getOwnDataProperty(currentError, 'message'),
				validMessageCount,
			});
			pendingErrors.push({ kind: 'value', value: issues });
			continue;
		}

		const message = getOwnDataProperty(currentError, 'message');
		if (typeof message === 'string' && appendMessage(message, messages, uniqueMessages)) {
			validMessageCount += 1;
			continue;
		}

		const errors = getOwnDataProperty(currentError, 'errors');
		const cause = getOwnDataProperty(currentError, 'cause');

		if (cause !== undefined) {
			pendingErrors.push({ kind: 'value', value: cause });
		}
		if (errors !== undefined) {
			pendingErrors.push({ kind: 'value', value: errors });
		}
	}

	return messages;
}

function normalizeFieldMap(error: unknown): NormalizedFormErrors {
	if (!isUnknownRecord(error)) {
		return { form: [], fields: {} };
	}

	const formErrors: unknown[] = [];
	const fieldEntries: Array<[string, string[]]> = [];
	const descriptors = getOwnPropertyDescriptorsSafely(error);

	for (const [field, descriptor] of Object.entries(descriptors)) {
		if (!('value' in descriptor)) {
			continue;
		}

		const messages = normalizeFieldErrors(descriptor.value);
		if (messages.length === 0) {
			continue;
		}

		if (field === '') {
			formErrors.push(messages);
		} else {
			fieldEntries.push([field, messages]);
		}
	}

	return {
		form: normalizeFieldErrors(formErrors),
		fields: Object.fromEntries(fieldEntries),
	};
}

export function normalizeFormErrors(error: unknown): NormalizedFormErrors {
	if (isDirectError(error)) {
		return { form: normalizeFieldErrors(error), fields: {} };
	}

	return normalizeFieldMap(error);
}

export function normalizeServerErrors(
	formError: unknown,
	fieldErrors: unknown
): NormalizedFormErrors {
	const normalizedFields = normalizeFieldMap(fieldErrors);

	return {
		form: normalizeFieldErrors([formError, normalizedFields.form]),
		fields: normalizedFields.fields,
	};
}

export function getFirstFormErrorMessage(errors: NormalizedFormErrors): string | undefined {
	const firstFormError = errors.form[0];

	if (firstFormError) {
		return firstFormError;
	}

	for (const fieldErrors of Object.values(errors.fields)) {
		const firstFieldError = fieldErrors[0];
		if (firstFieldError) {
			return firstFieldError;
		}
	}

	return undefined;
}
