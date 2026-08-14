import { useTheme } from 'react-native-paper';
import type { MinhaAssociacaoPaperTheme } from '@/theme/create-paper-theme';

export function useMinhaAssociacaoTheme() {
	return useTheme<MinhaAssociacaoPaperTheme>();
}
