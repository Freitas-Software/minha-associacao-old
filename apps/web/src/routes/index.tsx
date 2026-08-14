import { createFileRoute } from '@tanstack/react-router';
import { AppHeading, AppText } from '@/components/ui/app-primitives';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
	return (
		<main className="relative mx-auto flex min-h-screen w-full max-w-3xl items-center bg-background px-6 py-12 text-foreground">
			<div className="absolute right-4 top-4 sm:right-6 sm:top-6">
				<ThemeToggle />
			</div>
			<div className="space-y-3">
				<AppHeading level={1}>Minha Associação</AppHeading>
				<AppText
					className="max-w-xl text-lg"
					tone="secondary">
					Uma plataforma inteligente de gestão de associações rurais.
				</AppText>
			</div>
		</main>
	);
}
