import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
	{
		defaultVariants: { variant: 'default' },
		variants: {
			variant: {
				default: 'bg-surface-interactive text-foreground',
				primary: 'bg-primary-subtle text-primary-subtle-foreground',
				outline: 'border border-border bg-surface text-foreground',
				danger: 'bg-destructive-subtle text-destructive',
			},
		},
	}
);
export interface BadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}
export function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}
