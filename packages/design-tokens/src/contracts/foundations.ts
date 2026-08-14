export interface SpacingScale {
	none: number;
	xxs: number;
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
	'2xl': number;
	'3xl': number;
	'4xl': number;
}

export interface RadiusScale {
	none: number;
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
	pill: number;
}

export interface ShadowToken {
	x: number;
	y: number;
	blur: number;
	spread: number;
	opacity: number;
}

export interface ShadowScale {
	none: ShadowToken;
	sm: ShadowToken;
	md: ShadowToken;
	lg: ShadowToken;
}

export interface MotionScale {
	durationFast: number;
	durationNormal: number;
	durationSlow: number;
	easingStandard: string;
	easingEmphasized: string;
}
