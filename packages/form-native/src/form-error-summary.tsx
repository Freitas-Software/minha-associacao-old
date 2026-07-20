import {
	normalizeFieldErrors,
	normalizeFormErrors,
	useFormContext,
} from '@minha-associacao/form-core';
import { useSelector, type AnyFieldLikeMeta, type AnyFormState } from '@tanstack/react-form';
import { useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

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
		fields: Array.from(fieldMessages, ([field, messages]) => ({
			field,
			messages,
		})).filter(entry => entry.messages.length > 0),
		form: formMessages,
	};
}

export interface ErrorSummaryProps extends Omit<ViewProps, 'children'> {
	fieldLabels?: Readonly<Record<string, string>>;
	title?: string;
	announceErrors?: boolean;
}

export function ErrorSummary({
	fieldLabels = {},
	title = 'Revise os campos informados',
	announceErrors = true,
	style,
	...viewProps
}: ErrorSummaryProps) {
	const form = useFormContext();
	const theme = useTheme();

	const state = useSelector(
		form.store,
		formState => ({
			errorMap: formState.errorMap,
			fieldMeta: formState.fieldMeta,
			isTouched: formState.isTouched,
			submissionAttempts: formState.submissionAttempts,
		}),
		{
			compare: compareErrorSummaryState,
		}
	);

	const errors = collectErrors(state);

	const hasServerError = state.errorMap.onServer !== undefined;

	const canShowErrors = state.isTouched || state.submissionAttempts > 0 || hasServerError;

	const allMessages = useMemo(
		() => [
			...errors.form,
			...errors.fields.flatMap(({ field, messages }) =>
				messages.map(message => `${fieldLabels[field] ?? field}: ${message}`)
			),
		],
		[errors, fieldLabels]
	);

	const announcement = allMessages.join('. ');
	const previousAnnouncement = useRef('');

	useEffect(() => {
		if (!announceErrors || !announcement || announcement === previousAnnouncement.current) {
			return;
		}

		previousAnnouncement.current = announcement;

		if (Platform.OS === 'ios' || Platform.OS === 'android') {
			AccessibilityInfo.announceForAccessibility(`${title}. ${announcement}`);
		}
	}, [announceErrors, announcement, title]);

	if (!canShowErrors || allMessages.length === 0) {
		return null;
	}

	return (
		<View
			{...viewProps}
			accessibilityLiveRegion="assertive"
			accessibilityRole="alert"
			style={[
				styles.root,
				{
					backgroundColor: theme.colors.errorContainer,
					borderColor: theme.colors.error,
				},
				style,
			]}>
			<Text
				style={{
					color: theme.colors.onErrorContainer,
				}}
				variant="titleSmall">
				{title}
			</Text>

			<View style={styles.messages}>
				{allMessages.map(message => (
					<Text
						key={message}
						style={{
							color: theme.colors.onErrorContainer,
						}}
						variant="bodyMedium">
						• {message}
					</Text>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		borderLeftWidth: 4,
		borderRadius: 12,
		gap: 8,
		padding: 16,
		width: '100%',
	},

	messages: {
		gap: 4,
	},
});
