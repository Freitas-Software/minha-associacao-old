import { SunMoon } from 'lucide-react';
import { useAppTheme } from '@/providers/app-theme-provider';
import { IconButton } from './app-primitives';

export function ThemeToggle() {
	const { toggleMode } = useAppTheme();

	return (
		<IconButton
			label="Alternar entre tema claro e escuro"
			onClick={toggleMode}
			title="Alternar tema"
			variant="ghost">
			<SunMoon
				aria-hidden
				className="size-5"
			/>
		</IconButton>
	);
}
