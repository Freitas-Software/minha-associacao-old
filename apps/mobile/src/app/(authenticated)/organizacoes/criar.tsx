import { router } from 'expo-router';
import {
	AppButton,
	AppIcon,
	AppScreen,
	AppScreenHeader,
	EmptyState,
} from '@/components/ui';

export default function CriarOrganizacaoScreen() {
	return (
		<AppScreen>
			<AppScreenHeader
				description="Cadastre uma nova associação para começar a administrá-la."
				title="Criar associação"
			/>
			<EmptyState
				action={
					<AppButton
						onPress={() => router.back()}
						variant="outline">
						Voltar para associações
					</AppButton>
				}
				contained
				description="O formulário de cadastro será disponibilizado em uma próxima etapa."
				icon={
					<AppIcon
						name="office-building-plus-outline"
						size={40}
						tone="accent"
					/>
				}
				title="Cadastro em preparação"
			/>
		</AppScreen>
	);
}
