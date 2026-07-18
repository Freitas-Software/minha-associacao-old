import { StatusBar } from 'react-native';
import { useAppTheme } from '@/providers/app-theme-provider';

export const AppStatusBar = () => {
	const { isDark } = useAppTheme();

	return (
		<StatusBar
			animated={true}
			translucent={true}
			barStyle={isDark ? 'light-content' : 'dark-content'}
		/>
	);
};
