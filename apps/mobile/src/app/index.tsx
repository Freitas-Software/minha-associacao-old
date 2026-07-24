import { spacing } from '@minha-associacao/design-tokens';
import { useAppForm } from '@minha-associacao/form-native';
import {
	AppButton,
	AppCard,
	AppCardSection,
	EmptyState,
	StatusChip,
} from '@minha-associacao/ui-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useAppTheme, useNativeTheme } from '@/providers/app-theme-provider';

const associationSchema = z.object({
	associationName: z.string().trim().min(3, 'Informe um nome com pelo menos 3 caracteres.'),
});

export default function HomeScreen() {
	const theme = useNativeTheme();
	const { isDark, toggleMode } = useAppTheme();
	const [hasMembers, setHasMembers] = useState(false);
	const [savedAssociationName, setSavedAssociationName] = useState(
		'Associação Comunitária Esperança'
	);

	const form = useAppForm({
		defaultValues: {
			associationName: savedAssociationName,
		},

		validators: {
			onBlur: associationSchema,
			onSubmit: associationSchema,
		},

		onSubmit: async ({ value, formApi }) => {
			const normalizedName = value.associationName.trim();

			setSavedAssociationName(normalizedName);

			formApi.reset({
				associationName: normalizedName,
			});
		},
	});

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
								style={{
									color: theme.colors.onSurfaceVariant,
								}}
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
							style={{
								color: theme.colors.onSurfaceVariant,
							}}
							variant="bodyLarge">
							Primitives compartilhadas, acessíveis e prontas para os fluxos do aplicativo.
						</Text>
					</View>

					<AppCard
						description="Composição integrada dos componentes fundamentais"
						dividers
						title="Dados da associação">
						<AppCardSection
							description="Campo integrado à fundação compartilhada de formulários."
							title="Identificação">
							<form.AppForm>
								<form.Form
									accessibilityLabel="Formulário de dados da associação"
									gap={spacing.md}>
									<form.ErrorSummary
										fieldLabels={{
											associationName: 'Nome da associação',
										}}
									/>

									<form.AppField name="associationName">
										{field => (
											<field.TextField
												autoCapitalize="words"
												helperText="Use o nome público da associação."
												label="Nome da associação"
												placeholder="Associação Comunitária Esperança"
												returnKeyType="done"
												testID="association-name"
											/>
										)}
									</form.AppField>

									<View style={styles.formActions}>
										<form.SubmitButton
											loadingLabel="Salvando"
											variant="primary">
											Salvar alterações
										</form.SubmitButton>

										<form.ResetButton variant="ghost">Restaurar</form.ResetButton>
									</View>
								</form.Form>
							</form.AppForm>
						</AppCardSection>

						<AppCardSection
							description="Valor confirmado após o envio válido do formulário."
							title="Dados salvos">
							<Text variant="bodyMedium">{savedAssociationName}</Text>
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

	formActions: {
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
