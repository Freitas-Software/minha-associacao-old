import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import type React from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export const AppTabBar: React.FC<BottomTabBarProps> = ({ navigation, state, descriptors }) => {
	const insets = useSafeAreaInsets();
	const theme = useMinhaAssociacaoTheme();
	const activeRoute = state.routes[state.index];
	const visibleRoutes = state.routes.filter(route => {
		const itemStyle = StyleSheet.flatten(descriptors[route.key]?.options.tabBarItemStyle);
		return itemStyle?.display !== 'none';
	});
	const visibleIndex = visibleRoutes.findIndex(
		route => activeRoute?.name === route.name || activeRoute?.name.startsWith(`${route.name}/`)
	);
	const navigationState = {
		...state,
		index: visibleIndex >= 0 ? visibleIndex : 0,
		routes: visibleRoutes,
	};

	return (
		<BottomNavigation.Bar
			activeIndicatorStyle={{
				backgroundColor: theme.minhaAssociacao.colors.navigationActiveSubtle,
			}}
			navigationState={navigationState}
			safeAreaInsets={insets}
			onTabPress={({ route, preventDefault }) => {
				const event = navigation.emit({
					type: 'tabPress',
					target: route.key,
					canPreventDefault: true,
				});

				if (event.defaultPrevented) {
					preventDefault();
					return;
				}

				navigation.navigate(route.name, route.params);
			}}
			renderIcon={({ route, focused, color }) =>
				descriptors[route.key]?.options.tabBarIcon?.({
					focused,
					color,
					size: 24,
				}) ?? null
			}
			getLabelText={({ route }) => {
				const options = descriptors[route.key]?.options;

				return typeof options?.tabBarLabel === 'string'
					? options.tabBarLabel
					: typeof options?.title === 'string'
						? options.title
						: route.name;
			}}
			style={{
				backgroundColor: theme.minhaAssociacao.colors.navigationBackground,
				borderTopColor: theme.minhaAssociacao.colors.borderSubtle,
				borderTopWidth: 1,
			}}
			activeColor={theme.minhaAssociacao.colors.navigationActive}
			inactiveColor={theme.minhaAssociacao.colors.navigationMuted}
		/>
	);
};
