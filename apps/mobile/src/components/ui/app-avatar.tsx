import { Avatar, type AvatarTextProps } from 'react-native-paper';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

export type AppAvatarProps = Omit<AvatarTextProps, 'color'>;

export function AppAvatar({ labelStyle, size = 40, style, ...props }: AppAvatarProps) {
	const { minhaAssociacao } = useMinhaAssociacaoTheme();

	return (
		<Avatar.Text
			{...props}
			color={minhaAssociacao.colors.avatarContent}
			labelStyle={[
				{
					fontFamily: minhaAssociacao.typography.interface.mobile.semiBold,
					fontWeight: '400',
				},
				labelStyle,
			]}
			size={size}
			style={[{ backgroundColor: minhaAssociacao.colors.avatarBackground }, style]}
		/>
	);
}
