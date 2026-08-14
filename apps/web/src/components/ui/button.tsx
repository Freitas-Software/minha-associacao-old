import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
	{
		defaultVariants: { size: 'default', variant: 'primary' },
		variants: {
			variant: {
				primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
				secondary:
					'border border-border bg-secondary text-secondary-foreground hover:bg-surface-interactive',
				outline: 'border border-border bg-transparent text-foreground hover:bg-accent',
				ghost: 'bg-transparent text-brand-accent hover:bg-primary-subtle',
				danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			},
			size: {
				sm: 'min-h-9 px-3 text-xs',
				default: 'min-h-11',
				lg: 'min-h-13 px-6 text-base',
				icon: 'size-11 p-0',
			},
		},
	}
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	loadingLabel?: ReactNode;
}

export function Button({
	asChild = false,
	children,
	className,
	disabled,
	loading = false,
	loadingLabel,
	size,
	variant,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ size, variant }), className)}
			disabled={disabled || loading}
			{...props}>
			{loading ? (
				<LoaderCircle
					aria-hidden
					className="size-4 animate-spin"
				/>
			) : null}
			{loading && loadingLabel ? loadingLabel : children}
		</Comp>
	);
}

export { buttonVariants };
