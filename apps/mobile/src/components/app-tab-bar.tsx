import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import type React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AppTabBar: React.FC<BottomTabBarProps> = ({ navigation, state, descriptors }) => {
	const insets = useSafeAreaInsets();

	return (
		<BottomNavigation.Bar
			navigationState={state}
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
		/>
	);
};
