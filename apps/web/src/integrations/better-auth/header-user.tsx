import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '../../lib/auth-client';

export default function BetterAuthHeader() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<Skeleton
				className="size-9 rounded-full"
				data-testid="header-user-loading"
			/>
		);
	}

	if (session?.user) {
		return (
			<div className="flex items-center gap-2">
				<Avatar
					imageUrl={session.user.image}
					name={session.user.name || 'Usuário'}
				/>
				<Button
					type="button"
					onClick={() => {
						void authClient.signOut();
					}}
					size="sm"
					variant="outline">
					Sair
				</Button>
			</div>
		);
	}

	return null;
}
