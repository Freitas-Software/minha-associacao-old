import type { RadiusScale } from '../contracts';

export const radii = {
	none: 0,
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	pill: 9999,
} as const satisfies RadiusScale;
