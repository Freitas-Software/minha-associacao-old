import {
	normalizeFieldErrors,
	normalizeFormErrors,
	useFormContext,
} from '@minha-associacao/form-core';
import { useSelector, type AnyFieldLikeMeta, type AnyFormState } from '@tanstack/react-form';
import type { HTMLAttributes, MouseEvent } from 'react';

interface ErrorSummaryState {
	errorMap: AnyFormState['errorMap'];
	fieldMeta: AnyFormState['fieldMeta'];
	isTouched: boolean;
	submissionAttempts: number;
}

interface FieldErrorEntry {
	field: string;
	messages: string[];
}

interface CollectedErrors {
	fields: FieldErrorEntry[];
	form: string[];
}

function compareErrorSummaryState(left: ErrorSummaryState, right: ErrorSummaryState): boolean {
	return (
		left.errorMap === right.errorMap &&
		left.fieldMeta === right.fieldMeta &&
		left.isTouched === right.isTouched &&
		left.submissionAttempts === right.submissionAttempts
	);
}

function appendUnique(target: string[], messages: string[]) {
	for (const message of messages) {
		if (!target.includes(message)) {
			target.push(message);
		}
	}
}

function shouldShowFieldErrors(meta: AnyFieldLikeMeta, submissionAttempts: number): boolean {
	return (
		meta.isTouched ||
		meta.isBlurred ||
		submissionAttempts > 0 ||
		meta.errorMap.onServer !== undefined
	);
}

function collectErrors(state: ErrorSummaryState): CollectedErrors {
	const formMessages: string[] = [];
	const fieldMessages = new Map<string, string[]>();

	for (const error of Object.values(state.errorMap)) {
		const normalizedError = normalizeFormErrors(error);
		appendUnique(formMessages, normalizedError.form);

		for (const [field, messages] of Object.entries(normalizedError.fields)) {
			const collectedMessages = fieldMessages.get(field) ?? [];
			appendUnique(collectedMessages, messages);
			fieldMessages.set(field, collectedMessages);
		}
	}

	for (const [field, meta] of Object.entries(state.fieldMeta)) {
		if (!meta || !shouldShowFieldErrors(meta, state.submissionAttempts)) {
			continue;
		}

		if (field === '') {
			appendUnique(formMessages, normalizeFieldErrors(meta.errors));
			continue;
		}

		const collectedMessages = fieldMessages.get(field) ?? [];
		appendUnique(collectedMessages, normalizeFieldErrors(meta.errors));
		fieldMessages.set(field, collectedMessages);
	}

	return {
		fields: Array.from(fieldMessages, ([field, messages]) => ({ field, messages })).filter(
			entry => entry.messages.length > 0
		),
		form: formMessages,
	};
}

function focusNamedField(formElement: HTMLFormElement, fieldName: string) {
	const fieldElement = Array.from(formElement.elements).find(
		element => element instanceof HTMLElement && element.getAttribute('name') === fieldName
	);

	if (fieldElement instanceof HTMLElement) {
		fieldElement.focus();
	}
}

function focusField(event: MouseEvent<HTMLButtonElement>, fieldName: string) {
	const formElement = event.currentTarget.closest('form');
	if (!formElement) {
		return;
	}

	if (typeof requestAnimationFrame === 'function') {
		requestAnimationFrame(() => focusNamedField(formElement, fieldName));
		return;
	}

	setTimeout(() => focusNamedField(formElement, fieldName), 0);
}

export interface ErrorSummaryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	fieldLabels?: Readonly<Record<string, string>>;
	title?: string;
}

export function ErrorSummary({
	fieldLabels = {},
	style,
	title = 'Revise os campos informados',
	...summaryProps
}: ErrorSummaryProps) {
	const form = useFormContext();
	const state = useSelector(
		form.store,
		formState => ({
			errorMap: formState.errorMap,
			fieldMeta: formState.fieldMeta,
			isTouched: formState.isTouched,
			submissionAttempts: formState.submissionAttempts,
		}),
		{ compare: compareErrorSummaryState }
	);
	const errors = collectErrors(state);
	const hasServerError = state.errorMap.onServer !== undefined;
	const canShowErrors = state.isTouched || state.submissionAttempts > 0 || hasServerError;

	if (!canShowErrors || (errors.form.length === 0 && errors.fields.length === 0)) {
		return null;
	}

	return (
		<div
			{...summaryProps}
			aria-atomic="true"
			aria-live="assertive"
			data-form-error-summary
			role="alert"
			style={{
				borderInlineStart: '0.25rem solid currentColor',
				boxSizing: 'border-box',
				maxInlineSize: '100%',
				overflowWrap: 'anywhere',
				padding: '0.75rem 1rem',
				...style,
			}}
			tabIndex={-1}>
			<strong>{title}</strong>
			<ul>
				{errors.form.map(message => (
					<li key={`form-${message}`}>{message}</li>
				))}
				{errors.fields.flatMap(({ field, messages }) =>
					messages.map(message => (
						<li key={`${field}-${message}`}>
							<button
								onClick={event => focusField(event, field)}
								style={{
									background: 'none',
									border: 0,
									color: 'inherit',
									cursor: 'pointer',
									font: 'inherit',
									padding: 0,
									textAlign: 'start',
									textDecoration: 'underline',
								}}
								type="button">
								{fieldLabels[field] ?? field}: {message}
							</button>
						</li>
					))
				)}
			</ul>
		</div>
	);
}
