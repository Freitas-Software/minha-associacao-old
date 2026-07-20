import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

export interface FormProps extends PropsWithChildren<Omit<ViewProps, 'children'>> {
	gap?: number;
}

export function Form({ children, gap = 16, style, ...viewProps }: FormProps) {
	return (
		<View
			{...viewProps}
			style={[styles.root, { gap }, style]}>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		width: '100%',
	},
});
