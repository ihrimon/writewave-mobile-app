import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthorProfileView } from '../../src/components/AuthorProfileView';

export default function AuthorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white dark:bg-gray-900">
      <AuthorProfileView authorId={id} />
    </SafeAreaView>
  );
}
