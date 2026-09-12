import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Share, View } from 'react-native';
import {
	AppActivityIndicator,
	AppButton,
	AppCard,
	AppChip,
	AppProgressBar,
	AppRadioButton,
	AppScreen,
	AppScreenHeader,
	AppSwitch,
	AppText,
	AppTextInput,
} from '@/components/ui';
import {
	acceptInvitation,
	activateOrganization,
	createProvisioningInvitation,
	getProvisioningProgress,
	saveProvisioningRole,
	uploadProvisioningDocument,
} from '@/features/provisioning/api';
import {
	getFirstPendingProvisioningStep,
	provisioningSteps,
	type ProvisioningStep,
} from '@/features/provisioning/flow';
import type {
	ProvisioningDocumentType,
	ProvisioningProgress,
	ProvisioningRole,
} from '@/features/provisioning/types';
import { useMinhaAssociacaoTheme } from '@/hooks/use-minha-associacao-theme';

const stepContent: Record<ProvisioningStep, { title: string; description: string }> = {
	documents: {
		title: 'Dados institucionais',
		description: 'Envie o estatuto e a ata de eleição ou nomeação vigente.',
	},
	roles: {
		title: 'Cargos da associação',
		description: 'Configure os cargos antes de indicar as pessoas da diretoria.',
	},
	board: {
		title: 'Diretoria e primeiro acesso',
		description: 'Convide por CPF as pessoas responsáveis e garanta um membro com acesso total.',
	},
	review: {
		title: 'Revisão e ativação',
		description: 'Confira todas as exigências antes de tornar a associação operacional.',
	},
};

const requirementLabels = {
	STATUTE: 'Estatuto enviado',
	ELECTION_RECORD: 'Ata vigente enviada',
	DEFAULT_JOIN_ROLE: 'Cargo padrão configurado',
	FULL_ACCESS_ROLE: 'Cargo com acesso total configurado',
	BOARD_OCCUPANTS: 'Todos os cargos da diretoria representados',
	FULL_ACCESS_MEMBER: 'Membro ativo com acesso total',
} as const;

function formatCpf(value: string) {
	const digits = value.replace(/\D/g, '').slice(0, 11);
	return digits
		.replace(/^(\d{3})(\d)/, '$1.$2')
		.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
		.replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export default function ProvisionamentoScreen() {
	const { organizacaoId } = useLocalSearchParams<{ organizacaoId: string }>();
	const { spacing } = useMinhaAssociacaoTheme().minhaAssociacao;
	const [progress, setProgress] = useState<ProvisioningProgress | null>(null);
	const [step, setStep] = useState<ProvisioningStep | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [busyAction, setBusyAction] = useState<string | null>(null);
	const [roleName, setRoleName] = useState('');
	const [editingRoleId, setEditingRoleId] = useState<string | undefined>();
	const [isBoardRole, setIsBoardRole] = useState(false);
	const [isFullAccess, setIsFullAccess] = useState(false);
	const [isDefaultJoinRole, setIsDefaultJoinRole] = useState(false);
	const [cpf, setCpf] = useState('');
	const [selectedRoleId, setSelectedRoleId] = useState('');
	const [latestInvitation, setLatestInvitation] = useState<{
		link: string;
		token: string;
		roleName: string;
	} | null>(null);

	const loadProgress = useCallback(async () => {
		if (!organizacaoId) return;
		try {
			setError(null);
			const nextProgress = await getProvisioningProgress(organizacaoId);
			setProgress(nextProgress);
			setStep(currentStep => currentStep ?? getFirstPendingProvisioningStep(nextProgress));
			setSelectedRoleId(currentRoleId => {
				if (nextProgress.roles.some(role => role.id === currentRoleId)) return currentRoleId;
				const unrepresentedBoardRole = nextProgress.roles.find(
					role =>
						role.isBoardRole &&
						!nextProgress.readiness.representedBoardRoleIds.includes(role.id)
				);
				return (
					unrepresentedBoardRole?.id ??
					nextProgress.roles.find(role => role.isFullAccess)?.id ??
					nextProgress.roles[0]?.id ??
					''
				);
			});
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : 'Não foi possível carregar o provisionamento.');
		}
	}, [organizacaoId]);

	useEffect(() => {
		void loadProgress();
	}, [loadProgress]);

	const currentStepIndex = step ? provisioningSteps.indexOf(step) : 0;
	const currentStepContent = step ? stepContent[step] : stepContent.documents;
	const activeRoles = useMemo(
		() => progress?.roles.filter(role => role.status === 'ACTIVE') ?? [],
		[progress]
	);

	function resetRoleForm() {
		setEditingRoleId(undefined);
		setRoleName('');
		setIsBoardRole(false);
		setIsFullAccess(false);
		setIsDefaultJoinRole(false);
	}

	function editRole(role: ProvisioningRole) {
		setEditingRoleId(role.id);
		setRoleName(role.name);
		setIsBoardRole(role.isBoardRole);
		setIsFullAccess(role.isFullAccess);
		setIsDefaultJoinRole(role.isDefaultJoinRole);
	}

	async function uploadDocument(type: ProvisioningDocumentType) {
		if (!organizacaoId) return;
		try {
			setError(null);
			const selection = await DocumentPicker.getDocumentAsync({
				copyToCacheDirectory: true,
				multiple: false,
				type: 'application/pdf',
			});
			if (selection.canceled) return;
			const asset = selection.assets[0];
			if (!asset) return;
			if (asset.size && asset.size > 15 * 1024 * 1024)
				throw new Error('O PDF deve ter no máximo 15 MB.');

			setBusyAction(`document-${type}`);
			const contentBase64 = await new File(asset.uri).base64();
			await uploadProvisioningDocument({
				organizationId: organizacaoId,
				type,
				fileName: asset.name,
				contentBase64,
			});
			await loadProgress();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : 'Não foi possível enviar o documento.');
		} finally {
			setBusyAction(null);
		}
	}

	async function submitRole() {
		if (!organizacaoId || roleName.trim().length < 2) return;
		try {
			setBusyAction('role');
			setError(null);
			await saveProvisioningRole({
				organizationId: organizacaoId,
				roleId: editingRoleId,
				role: {
					name: roleName,
					isBoardRole,
					isFullAccess,
					isDefaultJoinRole,
				},
			});
			resetRoleForm();
			await loadProgress();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : 'Não foi possível salvar o cargo.');
		} finally {
			setBusyAction(null);
		}
	}

	async function createInvitation() {
		if (!organizacaoId || !selectedRoleId) return;
		try {
			setBusyAction('invitation');
			setError(null);
			const result = await createProvisioningInvitation({
				organizationId: organizacaoId,
				cpf: cpf.replace(/\D/g, ''),
				targetRoleId: selectedRoleId,
			});
			const selectedRole = activeRoles.find(role => role.id === selectedRoleId);
			setLatestInvitation({
				token: result.token,
				link: Linking.createURL(`/convites/${result.token}`),
				roleName: selectedRole?.name ?? 'Cargo selecionado',
			});
			setCpf('');
			await loadProgress();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : 'Não foi possível criar o convite.');
		} finally {
			setBusyAction(null);
		}
	}

	async function acceptLatestInvitation() {
		if (!latestInvitation) return;
		try {
			setBusyAction('accept-invitation');
			setError(null);
			await acceptInvitation(latestInvitation.token);
			setLatestInvitation(null);
			await loadProgress();
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: 'Este convite não pôde ser aceito por esta conta.'
			);
		} finally {
			setBusyAction(null);
		}
	}

	async function activate() {
		if (!organizacaoId) return;
		try {
			setBusyAction('activate');
			setError(null);
			await activateOrganization(organizacaoId);
			router.replace({
				pathname: '/org/[organizacaoId]',
				params: { organizacaoId },
			});
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : 'Não foi possível ativar a associação.');
			await loadProgress();
		} finally {
			setBusyAction(null);
		}
	}

	if (!progress || !step)
		return (
			<AppScreen centered>
				<AppActivityIndicator />
				{error ? <AppText tone="negative">{error}</AppText> : null}
				<AppButton
					onPress={() => void loadProgress()}
					variant="outline">
					Tentar novamente
				</AppButton>
			</AppScreen>
		);

	return (
		<AppScreen
			keyboardAware
			scrollable>
			<AppButton
				onPress={() => router.replace('/organizacoes')}
				variant="ghost">
				Voltar para associações
			</AppButton>
			<AppScreenHeader
				description={`${progress.organization.abbreviation} · Etapa ${currentStepIndex + 1} de ${provisioningSteps.length}`}
				title="Configurar associação"
			/>
			<AppProgressBar progress={(currentStepIndex + 1) / provisioningSteps.length} />
			<View style={{ gap: spacing.xs }}>
				<AppText variant="titleLarge">{currentStepContent.title}</AppText>
				<AppText tone="secondary">{currentStepContent.description}</AppText>
			</View>

			{step === 'documents' ? (
				<DocumentsStep
					busyAction={busyAction}
					onUpload={uploadDocument}
					progress={progress}
				/>
			) : null}
			{step === 'roles' ? (
				<View style={{ gap: spacing.lg }}>
					{activeRoles.map(role => (
						<AppCard
							footer={
								<AppButton
									onPress={() => editRole(role)}
									variant="ghost">
									Editar
								</AppButton>
							}
							key={role.id}
							title={role.name}>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
								{role.isBoardRole ? <AppChip>Diretoria</AppChip> : null}
								{role.isFullAccess ? <AppChip variant="primary">Acesso total</AppChip> : null}
								{role.isDefaultJoinRole ? <AppChip variant="outlined">Entrada padrão</AppChip> : null}
							</View>
						</AppCard>
					))}
					<AppCard title={editingRoleId ? 'Editar cargo' : 'Adicionar cargo'}>
						<View style={{ gap: spacing.md }}>
							<AppTextInput
								label="Nome do cargo"
								onChangeText={setRoleName}
								value={roleName}
							/>
							<SwitchRow
								label="Cargo da diretoria"
								onValueChange={value => {
									setIsBoardRole(value);
									if (value) setIsDefaultJoinRole(false);
								}}
								value={isBoardRole}
							/>
							<SwitchRow
								label="Acesso total"
								onValueChange={value => {
									setIsFullAccess(value);
									if (value) setIsDefaultJoinRole(false);
								}}
								value={isFullAccess}
							/>
							<SwitchRow
								label="Cargo padrão para novos membros"
								onValueChange={value => {
									setIsDefaultJoinRole(value);
									if (value) {
										setIsBoardRole(false);
										setIsFullAccess(false);
									}
								}}
								value={isDefaultJoinRole}
							/>
							<AppButton
								disabled={roleName.trim().length < 2}
								loading={busyAction === 'role'}
								onPress={() => void submitRole()}>
								{editingRoleId ? 'Salvar alterações' : 'Adicionar cargo'}
							</AppButton>
							{editingRoleId ? (
								<AppButton
									onPress={resetRoleForm}
									variant="ghost">
									Cancelar edição
								</AppButton>
							) : null}
						</View>
					</AppCard>
				</View>
			) : null}
			{step === 'board' ? (
				<View style={{ gap: spacing.lg }}>
					{activeRoles
						.filter(role => role.isBoardRole)
						.map(role => {
							const represented = progress.readiness.representedBoardRoleIds.includes(role.id);
							return (
								<AppCard
									key={role.id}
									title={role.name}>
									<AppText tone={represented ? 'positive' : 'warning'}>
										{represented ? 'Pessoa indicada' : 'Ainda precisa de uma pessoa'}
									</AppText>
								</AppCard>
							);
						})}
					<AppCard
						description="O convite é vinculado ao CPF e ao cargo selecionado."
						title="Convidar pessoa">
						<View style={{ gap: spacing.md }}>
							<AppTextInput
								keyboardType="number-pad"
								label="CPF"
								onChangeText={value => setCpf(formatCpf(value))}
								value={cpf}
							/>
							<AppText variant="titleSmall">Cargo</AppText>
							<AppRadioButton.Group
								onValueChange={setSelectedRoleId}
								value={selectedRoleId}>
								{activeRoles.map(role => (
									<AppRadioButton.Item
										key={role.id}
										label={`${role.name}${role.isFullAccess ? ' · acesso total' : ''}`}
										value={role.id}
									/>
								))}
							</AppRadioButton.Group>
							<AppButton
								disabled={cpf.replace(/\D/g, '').length !== 11 || !selectedRoleId}
								loading={busyAction === 'invitation'}
								onPress={() => void createInvitation()}>
								Criar convite
							</AppButton>
						</View>
					</AppCard>
					{latestInvitation ? (
						<AppCard
							description={latestInvitation.roleName}
							title="Convite pronto">
							<View style={{ gap: spacing.md }}>
								<AppText selectable>{latestInvitation.link}</AppText>
								<AppButton
									onPress={() =>
										void Share.share({
											message: `Você recebeu um convite para o Minha Associação: ${latestInvitation.link}`,
										})
									}>
									Compartilhar convite
								</AppButton>
								<AppButton
									loading={busyAction === 'accept-invitation'}
									onPress={() => void acceptLatestInvitation()}
									variant="outline">
									Aceitar com esta conta
								</AppButton>
							</View>
						</AppCard>
					) : null}
					<AppCard title="Convites registrados">
						<View style={{ gap: spacing.sm }}>
							{progress.invitations.filter(invitation => invitation.status === 'PENDING').length ? (
								progress.invitations
									.filter(invitation => invitation.status === 'PENDING')
									.map(invitation => (
										<AppText key={invitation.id} tone="secondary">
											CPF {formatCpf(invitation.cpf ?? '')} ·{' '}
											{activeRoles.find(role => role.id === invitation.targetRoleId)?.name ??
												'Cargo removido'}
										</AppText>
									))
							) : (
								<AppText tone="secondary">Nenhum convite pendente.</AppText>
							)}
						</View>
					</AppCard>
				</View>
			) : null}
			{step === 'review' ? (
				<View style={{ gap: spacing.lg }}>
					<AppCard title="Requisitos para ativação">
						<View style={{ gap: spacing.md }}>
							{Object.entries(requirementLabels).map(([requirement, label]) => {
								const pending = progress.readiness.missing.includes(
									requirement as keyof typeof requirementLabels
								);
								return (
									<AppText
										key={requirement}
										tone={pending ? 'warning' : 'positive'}>
										{pending ? '○' : '✓'} {label}
									</AppText>
								);
							})}
						</View>
					</AppCard>
					{!progress.readiness.fullAccessMemberPresent ? (
						<AppText tone="warning">
							Um convite para cargo com acesso total precisa ser aceito antes da ativação.
						</AppText>
					) : null}
					<AppButton
						disabled={!progress.readiness.canActivate}
						loading={busyAction === 'activate'}
						onPress={() => void activate()}
						size="large">
						Ativar associação
					</AppButton>
					<AppButton
						onPress={() => void loadProgress()}
						variant="outline">
						Atualizar verificação
					</AppButton>
				</View>
			) : null}

			{error ? <AppText tone="negative">{error}</AppText> : null}
			<View style={{ flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' }}>
				<AppButton
					disabled={currentStepIndex === 0}
					onPress={() => setStep(provisioningSteps[currentStepIndex - 1] ?? 'documents')}
					variant="outline">
					Anterior
				</AppButton>
				{step !== 'review' ? (
					<AppButton
						disabled={
						(step === 'documents' && !progress.readiness.institutionalDataComplete) ||
						(step === 'roles' && !progress.readiness.rolesComplete)
					}
						onPress={() => setStep(provisioningSteps[currentStepIndex + 1] ?? 'review')}>
						Continuar
					</AppButton>
				) : null}
			</View>
		</AppScreen>
	);
}

function DocumentsStep({
	busyAction,
	onUpload,
	progress,
}: {
	busyAction: string | null;
	onUpload: (type: ProvisioningDocumentType) => Promise<void>;
	progress: ProvisioningProgress;
}) {
	const { spacing } = useMinhaAssociacaoTheme().minhaAssociacao;
	const documents: Array<{
		type: ProvisioningDocumentType;
		title: string;
		description: string;
	}> = [
		{
			type: 'STATUTE',
			title: 'Estatuto',
			description: 'Versão vigente do estatuto da associação.',
		},
		{
			type: 'ELECTION_RECORD',
			title: 'Ata de eleição ou nomeação',
			description: 'Documento vigente que comprova a composição atual.',
		},
	];

	return (
		<View style={{ gap: spacing.lg }}>
			{documents.map(documentDefinition => {
				const current = progress.documents.find(
					document => document.type === documentDefinition.type
				);
				return (
					<AppCard
						description={documentDefinition.description}
						footer={
							<AppButton
								loading={busyAction === `document-${documentDefinition.type}`}
								onPress={() => void onUpload(documentDefinition.type)}
								variant={current ? 'outline' : 'primary'}>
								{current ? 'Substituir PDF' : 'Selecionar PDF'}
							</AppButton>
						}
						key={documentDefinition.type}
						title={documentDefinition.title}>
						<AppText tone={current ? 'positive' : 'warning'}>
							{current ? `Enviado: ${current.fileName}` : 'Documento pendente'}
						</AppText>
					</AppCard>
				);
			})}
		</View>
	);
}

function SwitchRow({
	label,
	onValueChange,
	value,
}: {
	label: string;
	onValueChange: (value: boolean) => void;
	value: boolean;
}) {
	return (
		<View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
			<AppText style={{ flex: 1 }}>{label}</AppText>
			<AppSwitch
				onValueChange={onValueChange}
				value={value}
			/>
		</View>
	);
}
