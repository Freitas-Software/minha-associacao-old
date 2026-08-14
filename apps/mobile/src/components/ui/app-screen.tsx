import type { ReactNode } from 'react';
import {
	ScrollView,
	type ScrollViewProps,
	type StyleProp,
	View,
	type ViewStyle,
} from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from './app-text';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export interface AppScreenProps {
	children: ReactNode;
	centered?: boolean;
	contentContainerStyle?: StyleProp<ViewStyle>;
	keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
	padded?: boolean;
	safeAreaEdges?: Edge[];
	scrollable?: boolean;
	testID?: string;
}

const defaultSafeAreaEdges: Edge[] = ['top', 'right', 'bottom', 'left'];

/** Base visual de toda tela: safe area, canvas temático e espaçamento do design system. */
export function AppScreen({
	centered = false,
	children,
	contentContainerStyle,
	keyboardShouldPersistTaps = 'handled',
	padded = true,
	safeAreaEdges = defaultSafeAreaEdges,
	scrollable = false,
	testID,
}: AppScreenProps) {
	const { colors, spacing } = useMinhaAssociacaoTheme().minhaAssociacao;
	const contentStyle: StyleProp<ViewStyle> = [
		{
			flexGrow: 1,
			gap: spacing.lg,
			padding: padded ? spacing.xl : spacing.none,
		},
		centered && {
			justifyContent: 'center',
		},
		contentContainerStyle,
	];

	return (
		<SafeAreaView
			edges={safeAreaEdges}
			style={{ backgroundColor: colors.canvas, flex: 1 }}
			testID={testID}>
			{scrollable ? (
				<ScrollView
					contentContainerStyle={contentStyle}
					keyboardShouldPersistTaps={keyboardShouldPersistTaps}
					style={{ backgroundColor: colors.canvas, flex: 1 }}>
					{children}
				</ScrollView>
			) : (
				<View style={[{ flex: 1 }, contentStyle]}>{children}</View>
			)}
		</SafeAreaView>
	);
}

export interface AppScreenHeaderProps {
	action?: ReactNode;
	description?: ReactNode;
	title: ReactNode;
}

export function AppScreenHeader({ action, description, title }: AppScreenHeaderProps) {
	const { spacing } = useMinhaAssociacaoTheme().minhaAssociacao;

	return (
		<View
			style={{
				alignItems: 'flex-start',
				flexDirection: 'row',
				gap: spacing.md,
				justifyContent: 'space-between',
			}}>
			<View style={{ flex: 1, gap: spacing.xs }}>
				<AppText
					accessibilityRole="header"
					variant="headlineMedium">
					{title}
				</AppText>
				{description ? <AppText tone="secondary">{description}</AppText> : null}
			</View>
			{action}
		</View>
	);
}
