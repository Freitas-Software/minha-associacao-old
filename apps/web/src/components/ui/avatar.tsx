import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends Omit<ComponentProps<'span'>, 'children'> {
	imageUrl?: string | null;
	name: string;
}

export function Avatar({ className, imageUrl, name, ...props }: AvatarProps) {
	const initial = name.trim().charAt(0).toLocaleUpperCase('pt-BR') || 'U';

	return (
		<span
			aria-label={name}
			className={cn(
				'inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-avatar text-sm font-semibold text-avatar-foreground',
				className
			)}
			role="img"
			{...props}>
			{imageUrl ? (
				<img
					alt=""
					className="size-full object-cover"
					src={imageUrl}
				/>
			) : (
				initial
			)}
		</span>
	);
}
