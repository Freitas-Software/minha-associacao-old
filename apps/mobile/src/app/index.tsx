import { spacing } from '@minha-associacao/design-tokens';
import {
	AppButton,
	AppCard,
	AppCardSection,
	AppTextField,
	EmptyState,
	StatusChip,
} from '@minha-associacao/ui-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme, useNativeTheme } from '@/providers/app-theme-provider';

export default function HomeScreen() {
	const theme = useNativeTheme();
	const { isDark, toggleMode } = useAppTheme();
	const [associationName, setAssociationName] = useState('Associação Comunitária Esperança');
	const [hasMembers, setHasMembers] = useState(false);

	return (
		<SafeAreaView
			edges={['top', 'left', 'right']}
			style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
			<ScrollView
				automaticallyAdjustKeyboardInsets
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled">
				<View style={styles.page}>
					<View style={styles.introduction}>
						<View style={styles.eyebrowRow}>
							<StatusChip status="active" />
							<Text
								style={{ color: theme.colors.onSurfaceVariant }}
								variant="labelLarge">
								Sistema de UI nativo
							</Text>
						</View>
						<Text
							accessibilityRole="header"
							variant="headlineMedium">
							Minha Associação
						</Text>
						<Text
							style={{ color: theme.colors.onSurfaceVariant }}
							variant="bodyLarge">
							Primitives compartilhadas, acessíveis e prontas para os fluxos do aplicativo.
						</Text>
					</View>

					<AppCard
						description="Composição integrada dos componentes fundamentais"
						dividers
						title="Dados da associação">
						<AppCardSection
							description="Campo controlado sem antecipar a fundação de formulários."
							title="Identificação">
							<AppTextField
								helperText="Use o nome público da associação."
								label="Nome da associação"
								onChangeText={setAssociationName}
								testID="association-name"
								value={associationName}
							/>
						</AppCardSection>
					</AppCard>

					{hasMembers ? (
						<AppCard
							description="O primeiro cadastro foi iniciado nesta prévia."
							footer={
								<AppButton
									onPress={() => setHasMembers(false)}
									variant="ghost">
									Desfazer
								</AppButton>
							}
							title="Cadastro iniciado">
							<Text variant="bodyMedium">
								A mudança aparece no contexto e pode ser desfeita imediatamente.
							</Text>
						</AppCard>
					) : (
						<EmptyState
							action={
								<AppButton onPress={() => setHasMembers(true)}>Adicionar associado</AppButton>
							}
							contained
							description="Cadastre a primeira pessoa para começar a organizar os membros."
							icon={
								<MaterialDesignIcons
									color={theme.colors.onSurfaceVariant}
									name="account-group-outline"
									size={48}
								/>
							}
							secondaryAction={
								<AppButton
									onPress={toggleMode}
									variant="outline">
									Usar tema {isDark ? 'claro' : 'escuro'}
								</AppButton>
							}
							title="Nenhum associado cadastrado"
						/>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	eyebrowRow: {
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	introduction: {
		gap: spacing.sm,
	},
	page: {
		alignSelf: 'center',
		gap: spacing.xl,
		maxWidth: 720,
		width: '100%',
	},
	safeArea: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.xl,
	},
});
