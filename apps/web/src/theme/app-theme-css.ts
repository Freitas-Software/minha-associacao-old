import { type MinhaAssociacaoThemeDefinition, themes } from '@minha-associacao/design-tokens';

type CssVariables = Readonly<Record<`--${string}`, string>>;

export function createAppThemeCssVariables(theme: MinhaAssociacaoThemeDefinition): CssVariables {
	const { colors } = theme;

	return {
		'--brand': colors.brandSymbol,
		'--brand-accent': colors.brandAccent,
		'--brand-highlight': colors.brandHighlight,
		'--background': colors.canvas,
		'--foreground': colors.contentPrimary,
		'--surface': colors.surface,
		'--surface-elevated': colors.surfaceElevated,
		'--surface-subtle': colors.surfaceSubtle,
		'--surface-interactive': colors.surfaceInteractive,
		'--card': colors.surface,
		'--card-foreground': colors.contentPrimary,
		'--popover': colors.surfaceElevated,
		'--popover-foreground': colors.contentPrimary,
		'--primary': colors.actionPrimary,
		'--primary-foreground': colors.actionPrimaryContent,
		'--primary-subtle': colors.actionPrimarySubtle,
		'--primary-subtle-foreground': colors.actionPrimarySubtleContent,
		'--avatar': colors.avatarBackground,
		'--avatar-foreground': colors.avatarContent,
		'--secondary': colors.actionSecondary,
		'--secondary-foreground': colors.actionSecondaryContent,
		'--muted': colors.surfaceSubtle,
		'--muted-foreground': colors.contentSecondary,
		'--content-muted': colors.contentMuted,
		'--accent': colors.surfaceInteractive,
		'--accent-foreground': colors.actionSecondaryContent,
		'--destructive': colors.feedbackNegative,
		'--destructive-foreground': colors.feedbackNegativeContent,
		'--destructive-subtle': colors.feedbackNegativeSubtle,
		'--positive': colors.feedbackPositive,
		'--positive-subtle': colors.feedbackPositiveSubtle,
		'--positive-foreground': colors.feedbackPositiveSubtleContent,
		'--warning': colors.feedbackWarning,
		'--warning-subtle': colors.feedbackWarningSubtle,
		'--warning-foreground': colors.feedbackWarningSubtleContent,
		'--info': colors.feedbackInfo,
		'--info-subtle': colors.feedbackInfoSubtle,
		'--info-foreground': colors.feedbackInfoSubtleContent,
		'--border-subtle': colors.borderSubtle,
		'--border': colors.borderDefault,
		'--border-strong': colors.borderStrong,
		'--input': colors.borderControl,
		'--ring': colors.actionPrimaryText,
		'--radius': `${theme.radii.md / 16}rem`,
		'--shadow-color': colors.shadow,
	};
}

function createCssRule(selector: string, theme: MinhaAssociacaoThemeDefinition): string {
	const declarations = Object.entries(createAppThemeCssVariables(theme))
		.map(([property, value]) => `${property}:${value}`)
		.join(';');

	return `${selector}{color-scheme:${theme.mode};${declarations}}`;
}

export const appThemeCss = [
	createCssRule(':root', themes.light),
	createCssRule(':root.dark', themes.dark),
].join('');
