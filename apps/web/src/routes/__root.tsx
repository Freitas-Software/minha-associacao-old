import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { AppThemeProvider, appThemeBootstrapScript } from '@/providers/app-theme-provider';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import fontsCss from '../styles/fonts.css?url';
import appCss from '../styles.css?url';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Minha Associação',
			},
			{
				name: 'description',
				content: 'Gestão inteligente para associações rurais.',
			},
			{
				name: 'theme-color',
				content: '#2E7D32',
			},
		],
		links: [
			{
				rel: 'icon',
				href: '/app-icon.svg',
				type: 'image/svg+xml',
			},
			{
				rel: 'manifest',
				href: '/manifest.json',
			},
			{
				rel: 'stylesheet',
				href: appCss,
			},
			{
				rel: 'stylesheet',
				href: fontsCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="pt-BR"
			suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: appThemeBootstrapScript }} />
				<HeadContent />
			</head>
			<body>
				<AppThemeProvider>{children}</AppThemeProvider>
				<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
