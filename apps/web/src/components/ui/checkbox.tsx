import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				'size-5 shrink-0 rounded border border-input bg-surface shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
				className
			)}
			{...props}>
			<CheckboxPrimitive.Indicator className="flex items-center justify-center">
				<Check className="size-4" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}
