import type { ShadowScale } from '../contracts';

export const shadows = {
	none: { x: 0, y: 0, blur: 0, spread: 0, opacity: 0 },
	sm: { x: 0, y: 2, blur: 8, spread: 0, opacity: 0.08 },
	md: { x: 0, y: 8, blur: 24, spread: 0, opacity: 0.12 },
	lg: { x: 0, y: 18, blur: 52, spread: 0, opacity: 0.18 },
} as const satisfies ShadowScale;
