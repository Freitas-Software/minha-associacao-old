import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppStatusBar } from '@/components/app-status-bar';
import { useAuth } from '@/hooks/use-auth';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';
import { AppThemeProvider } from '@/providers/app-theme-provider';
import { AuthProvider } from '@/providers/auth-provider';

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
			<AuthProvider>
				<AppStatusBar />
				<RootNavigator />
			</AuthProvider>
		</AppThemeProvider>
	);
}

function RootNavigator() {
	const { session, isLoading } = useAuth();
	const { colors } = useMinhaAssociacaoTheme().minhaAssociacao;

	if (isLoading) return null;

	const isAuthenticated = session !== null;

	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: colors.canvas },
				headerShown: false,
			}}>
			<Stack.Screen name="index" />

			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="(auth)" />
			</Stack.Protected>

			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name="(authenticated)" />
			</Stack.Protected>
		</Stack>
	);
}
