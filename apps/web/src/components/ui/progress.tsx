import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Progress({
	className,
	value = 0,
	...props
}: HTMLAttributes<HTMLDivElement> & { value?: number }) {
	return (
		<div
			aria-valuemax={100}
			aria-valuemin={0}
			aria-valuenow={value}
			className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-interactive', className)}
			role="progressbar"
			{...props}>
			<div
				className="h-full bg-primary transition-all"
				style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
			/>
		</div>
	);
}
