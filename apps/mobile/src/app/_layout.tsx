import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AppStatusBar } from '@/components/app-status-bar';
import { AppTabBar } from '@/components/app-tab-bar';
import { AppThemeProvider } from '@/providers/app-theme-provider';

SplashScreen.preventAutoHideAsync();

const AppContent = () => (
	<>
		<AppStatusBar />
		<Tabs tabBar={props => <AppTabBar {...props} />}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Início',
					tabBarLabel: 'Início',
					tabBarIcon: ({ color, size }) => (
						<MaterialDesignIcons
							name="home"
							color={color}
							size={size}
						/>
					),
				}}
			/>
		</Tabs>
	</>
);

export default function AppLayout() {
	return (
		<AppThemeProvider>
			<AppContent />
		</AppThemeProvider>
	);
}
