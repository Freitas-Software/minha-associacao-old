import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/app-tab-bar';
import { AppIcon } from '@/components/ui';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export default function OrganizacaoTabsLayout() {
	const { colors } = useMinhaAssociacaoTheme().minhaAssociacao;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				sceneStyle: { backgroundColor: colors.canvas },
			}}
			tabBar={props => <AppTabBar {...props} />}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Início',
					tabBarIcon: ({ color, size }) => (
						<AppIcon
							color={color}
							name="home-variant-outline"
							size={size}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="membros"
				options={{
					title: 'Membros',
					tabBarIcon: ({ color, size }) => (
						<AppIcon
							color={color}
							name="account-group-outline"
							size={size}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="documentos"
				options={{
					title: 'Documentos',
					tabBarIcon: ({ color, size }) => (
						<AppIcon
							color={color}
							name="file-document-outline"
							size={size}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="projetos"
				options={{
					title: 'Projetos',
					tabBarIcon: ({ color, size }) => (
						<AppIcon
							color={color}
							name="briefcase-outline"
							size={size}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="configuracoes"
				options={{
					title: 'Configurações',
					tabBarIcon: ({ color, size }) => (
						<AppIcon
							color={color}
							name="cog-outline"
							size={size}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="membros/[membroId]"
				options={{ href: null }}
			/>

			<Tabs.Screen
				name="documentos/[documentoId]"
				options={{ href: null }}
			/>

			<Tabs.Screen
				name="projetos/[projetoId]"
				options={{ href: null }}
			/>
		</Tabs>
	);
}
