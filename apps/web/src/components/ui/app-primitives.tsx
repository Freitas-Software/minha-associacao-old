import { Search } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { type EntityStatus, entityStatusLabels } from '@/lib/status';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button, type ButtonProps } from './button';
import { Input } from './input';

export function AppHeading({
	className,
	level = 2,
	...props
}: ComponentProps<'h2'> & { level?: 1 | 2 | 3 | 4 }) {
	const Heading = `h${level}` as const;
	const sizes = {
		1: 'text-3xl font-bold leading-tight tracking-tight sm:text-4xl',
		2: 'text-2xl font-semibold leading-tight tracking-tight',
		3: 'text-xl font-semibold leading-snug',
		4: 'text-lg font-semibold leading-snug',
	};
	return (
		<Heading
			className={cn('text-foreground', sizes[level], className)}
			{...props}
		/>
	);
}

export function AppText({
	className,
	tone = 'primary',
	...props
}: ComponentProps<'p'> & {
	tone?:
		| 'primary'
		| 'secondary'
		| 'muted'
		| 'accent'
		| 'inverse'
		| 'positive'
		| 'warning'
		| 'negative'
		| 'info';
}) {
	const tones = {
		primary: 'text-foreground',
		secondary: 'text-muted-foreground',
		muted: 'text-content-muted',
		accent: 'text-brand-accent',
		inverse: 'text-primary-foreground',
		positive: 'text-positive-foreground',
		warning: 'text-warning-foreground',
		negative: 'text-destructive',
		info: 'text-info-foreground',
	};
	return (
		<p
			className={cn(tones[tone], className)}
			{...props}
		/>
	);
}
export function Surface({
	className,
	variant = 'default',
	...props
}: ComponentProps<'div'> & { variant?: 'default' | 'elevated' | 'subtle' | 'interactive' }) {
	const variants = {
		default: 'bg-surface',
		elevated: 'bg-surface-elevated shadow-md',
		subtle: 'bg-surface-subtle',
		interactive: 'bg-surface-interactive',
	};
	return (
		<div
			className={cn('rounded-lg', variants[variant], className)}
			{...props}
		/>
	);
}
export function IconButton({
	className,
	label,
	...props
}: Omit<ButtonProps, 'size'> & { label: string }) {
	return (
		<Button
			aria-label={label}
			className={cn('size-11 p-0', className)}
			size="icon"
			{...props}
		/>
	);
}
export function FAB({ className, ...props }: ButtonProps) {
	return (
		<Button
			className={cn('fixed bottom-6 right-6 min-h-14 rounded-2xl shadow-lg', className)}
			{...props}
		/>
	);
}
export function Chip({ className, ...props }: ComponentProps<typeof Badge>) {
	return (
		<Badge
			className={className}
			{...props}
		/>
	);
}
export function StatusChip({
	label,
	status,
	...props
}: Omit<ComponentProps<typeof Badge>, 'children' | 'variant'> & {
	label?: string;
	status: EntityStatus;
}) {
	const variant =
		status === 'blocked'
			? 'danger'
			: status === 'active'
				? 'primary'
				: status === 'pending'
					? 'default'
					: 'outline';
	return (
		<Badge
			aria-label={`Status: ${label ?? entityStatusLabels[status]}`}
			variant={variant}
			{...props}>
			{label ?? entityStatusLabels[status]}
		</Badge>
	);
}
export function Searchbar({ className, ...props }: ComponentProps<typeof Input>) {
	return (
		<div className="relative">
			<Search
				aria-hidden
				className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				className={cn('rounded-full bg-surface-interactive pl-9', className)}
				type="search"
				{...props}
			/>
		</div>
	);
}
export function Feedback({
	children,
	tone = 'info',
}: {
	children: ReactNode;
	tone?: 'positive' | 'warning' | 'negative' | 'info';
}) {
	const tones = {
		positive: 'border-positive bg-positive-subtle',
		warning: 'border-warning bg-warning-subtle',
		negative: 'border-destructive bg-destructive-subtle',
		info: 'border-info bg-info-subtle',
	};
	return (
		<div
			className={cn('rounded-md border-l-4 p-4 text-foreground', tones[tone])}
			role="status">
			{children}
		</div>
	);
}
export function EmptyState({
	action,
	description,
	icon,
	secondaryAction,
	title,
}: {
	action?: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
	secondaryAction?: ReactNode;
	title: ReactNode;
}) {
	return (
		<Surface
			className="border border-dashed border-border p-8 text-center"
			variant="subtle">
			<div className="mx-auto flex max-w-md flex-col items-center gap-4">
				{icon ? (
					<div
						aria-hidden
						className="text-muted-foreground">
						{icon}
					</div>
				) : null}
				<div className="space-y-2">
					<AppHeading
						className="text-lg"
						level={2}>
						{title}
					</AppHeading>
					{description ? <AppText tone="secondary">{description}</AppText> : null}
				</div>
				{action || secondaryAction ? (
					<div className="flex flex-wrap justify-center gap-2">
						{action}
						{secondaryAction}
					</div>
				) : null}
			</div>
		</Surface>
	);
}
