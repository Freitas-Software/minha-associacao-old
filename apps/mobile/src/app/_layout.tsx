import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppStatusBar } from '@/components/app-status-bar';
import { AppTabBar } from '@/components/app-tab-bar';
import { AppThemeProvider } from '@/providers/app-theme-provider';

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
	const [fontsLoaded, fontError] = useFonts({
		Geist_400Regular: require('../../assets/fonts/Geist-Regular.ttf'),
		Geist_500Medium: require('../../assets/fonts/Geist-Medium.ttf'),
		Geist_600SemiBold: require('../../assets/fonts/Geist-SemiBold.ttf'),
		Geist_700Bold: require('../../assets/fonts/Geist-Bold.ttf'),

		GeistMono_400Regular: require('../../assets/fonts/GeistMono-Regular.ttf'),
		GeistMono_500Medium: require('../../assets/fonts/GeistMono-Medium.ttf'),
		GeistMono_600SemiBold: require('../../assets/fonts/GeistMono-SemiBold.ttf'),
		GeistMono_700Bold: require('../../assets/fonts/GeistMono-Bold.ttf'),
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<AppThemeProvider>
			<AppStatusBar />
			<Tabs tabBar={props => <AppTabBar {...props} />}>
				<Tabs.Screen
					name="index"
					options={{
						headerShown: false,
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
		</AppThemeProvider>
	);
}
