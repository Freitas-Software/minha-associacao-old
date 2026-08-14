import type { MotionScale } from '../contracts';

export const motion = {
	durationFast: 120,
	durationNormal: 200,
	durationSlow: 320,
	easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
	easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1.2)',
} as const satisfies MotionScale;
