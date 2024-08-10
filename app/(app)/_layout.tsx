import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../auth/AuthProvider';
import DancingBars from '@/components/DancingBars';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <DancingBars />;
  }

  if (!session || !session.accessToken) {
    if (session && session.email && session.confirmation_status === 'unconfirmed') {
      return <Redirect href="/confirm" />;
    }
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
