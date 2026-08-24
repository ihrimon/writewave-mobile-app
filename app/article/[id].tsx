import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';

import { useArticle } from '../../src/hooks/useArticle';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: article, isLoading, isError } = useArticle(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !article) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-gray-500">আর্টিকেল পাওয়া যায়নি</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-10">
      {article.coverImage ? (
        <Image source={{ uri: article.coverImage }} className="h-56 w-full" resizeMode="cover" />
      ) : null}

      <View className="px-6 pt-6">
        <Text className="mb-2 text-xs font-medium uppercase text-blue-600">
          {article.category}
        </Text>
        <Text className="mb-4 text-2xl font-bold text-gray-900">{article.title}</Text>

        <View className="mb-6 flex-row items-center">
          {article.author.avatarUrl ? (
            <Image
              source={{ uri: article.author.avatarUrl }}
              className="mr-3 h-10 w-10 rounded-full"
            />
          ) : (
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <Text className="font-semibold text-gray-500">
                {article.author.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text className="font-medium text-gray-900">{article.author.name}</Text>
            <Text className="text-xs text-gray-400">
              {new Date(article.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text className="mb-6 text-base leading-6 text-gray-800">{article.content}</Text>

        {article.tags.length > 0 ? (
          <View className="mb-6 flex-row flex-wrap">
            {article.tags.map((tag) => (
              <View key={tag} className="mb-2 mr-2 rounded-full bg-gray-100 px-3 py-1">
                <Text className="text-xs text-gray-600">#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text className="text-sm text-gray-400">♥ {article.likeCount}</Text>
      </View>
    </ScrollView>
  );
}
