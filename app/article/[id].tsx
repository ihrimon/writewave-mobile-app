import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-lg text-gray-700">Article Detail (id: {id}) — Phase 3-এ implement হবে</Text>
    </View>
  );
}
