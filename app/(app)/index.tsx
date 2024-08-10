import { Text, View } from 'react-native';

import { useSession } from '../../auth/AuthProvider';
import DancingBars from '@/components/DancingBars';

export default function Index() {
  const { signOut, isLoading } = useSession();

  if (isLoading) {
    return <DancingBars />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{ color: 'white', fontSize: 24 }}
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}