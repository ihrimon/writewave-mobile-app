import { Link } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

import { ArticleSummary } from '../types';

interface Props {
  article: ArticleSummary;
}

export function ArticleCard({ article }: Props) {
  return (
    <Link href={`/article/${article.id}`} asChild>
      <Pressable className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {article.coverImage ? (
          <Image source={{ uri: article.coverImage }} className="h-40 w-full" resizeMode="cover" />
        ) : null}
        <View className="p-4">
          <Text className="mb-1 text-xs font-medium uppercase text-emerald-600 dark:text-emerald-400">
            {article.category}
          </Text>
          <Text
            className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100"
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <Text className="mb-3 text-sm text-gray-500 dark:text-gray-400" numberOfLines={2}>
            {article.excerpt}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {article.author.name}
            </Text>
            <Text className="text-sm text-gray-400 dark:text-gray-500">
              ♥ {article.likeCount}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
