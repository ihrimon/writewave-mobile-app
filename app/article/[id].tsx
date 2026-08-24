import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommentsSection } from '../../src/components/CommentsSection';
import { useAuth } from '../../src/context/AuthContext';
import { useArticle } from '../../src/hooks/useArticle';
import { useLikeArticle } from '../../src/hooks/useLikeArticle';
import { useFilterStore } from '../../src/store/filterStore';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: article, isLoading, isError } = useArticle(id);
  const setTag = useFilterStore((s) => s.setTag);
  const { user } = useAuth();
  const { mutate: toggleLike } = useLikeArticle(id);

  function handleTagPress(tag: string) {
    setTag(tag);
    router.push('/(tabs)/home');
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (isError || !article) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6 dark:bg-gray-900">
        <Text className="text-gray-500 dark:text-gray-400">আর্টিকেল পাওয়া যায়নি</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerClassName="pb-10">
        {article.coverImage ? (
          <Image
            source={{ uri: article.coverImage }}
            className="h-56 w-full"
            resizeMode="cover"
          />
        ) : null}

        <View className="px-6 pt-6">
          <Text className="mb-2 text-xs font-medium uppercase text-blue-600 dark:text-blue-400">
            {article.category}
          </Text>
          <View className="mb-4 flex-row items-start justify-between">
            <Text className="mr-3 flex-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {article.title}
            </Text>
            {user?.id === article.author.id ? (
              <Pressable
                onPress={() => router.push(`/article/edit/${article.id}`)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 dark:border-gray-600"
              >
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Edit
                </Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={() => router.push(`/author/${article.author.id}`)}
            className="mb-6 flex-row items-center"
          >
            {article.author.avatarUrl ? (
              <Image
                source={{ uri: article.author.avatarUrl }}
                className="mr-3 h-10 w-10 rounded-full"
              />
            ) : (
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <Text className="font-semibold text-gray-500 dark:text-gray-300">
                  {article.author.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View>
              <Text className="font-medium text-gray-900 dark:text-gray-100">
                {article.author.name}
              </Text>
              <Text className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(article.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>

          <Text className="mb-6 text-base leading-6 text-gray-800 dark:text-gray-200">
            {article.content}
          </Text>

          {article.tags.length > 0 ? (
            <View className="mb-6 flex-row flex-wrap">
              {article.tags.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => handleTagPress(tag)}
                  className="mb-2 mr-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800"
                >
                  <Text className="text-xs text-gray-600 dark:text-gray-400">#{tag}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <Pressable
            onPress={() => toggleLike()}
            className="mb-8 flex-row items-center self-start rounded-full border border-gray-200 px-4 py-2 dark:border-gray-700"
          >
            <Text
              className={
                article.isLiked ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
              }
            >
              {article.isLiked ? '♥' : '♡'} {article.likeCount}
            </Text>
          </Pressable>

          <CommentsSection articleId={article.id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
