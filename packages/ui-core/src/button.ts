export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type ComponentSize = 'small' | 'medium' | 'large';

export interface SharedButtonProps {
	variant?: ButtonVariant;
	size?: ComponentSize;
	loading?: boolean;
	disabled?: boolean;
}
