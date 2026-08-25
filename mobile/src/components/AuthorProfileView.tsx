import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';

import { ArticleCard } from './ArticleCard';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../hooks/useArticles';
import { useAuthor } from '../hooks/useAuthor';
import { useFollowAuthor } from '../hooks/useFollowAuthor';
import { ArticleSummary } from '../types';

export function AuthorProfileView({ authorId }: { authorId: string }) {
  const { user } = useAuth();
  const { data: author, isLoading: isAuthorLoading, isError: isAuthorError } = useAuthor(authorId);
  const { mutate: toggleFollow, isPending: isFollowPending } = useFollowAuthor(authorId);

  const {
    data,
    isLoading: isArticlesLoading,
    isError: isArticlesError,
    refetch: refetchArticles,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticles({ authorId });

  const articles: ArticleSummary[] = data?.pages.flatMap((page) => page.articles) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isAuthorLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator />
      </View>
    );
  }

  if (isAuthorError || !author) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-gray-900">
        <Text className="text-gray-500 dark:text-gray-400">Profile not found</Text>
      </View>
    );
  }

  const isOwnProfile = user?.id === author.id;

  // Home screen-এর মতো এখানেও FlatList-এর contentContainerClassName="p-4" cards-এর জন্য
  // দরকার, তাই header-কে negative margin দিয়ে full-bleed করা হয়েছে।
  const header = (
    <View className="-mx-4 -mt-4 mb-2 items-center border-b border-gray-100 px-6 py-8 dark:border-gray-800">
      {author.avatarUrl ? (
        <Image source={{ uri: author.avatarUrl }} className="mb-3 h-20 w-20 rounded-full" />
      ) : (
        <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <Text className="text-2xl font-semibold text-gray-500 dark:text-gray-300">
            {author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">
        {author.name}
      </Text>
      {author.bio ? (
        <Text className="mb-4 text-center text-gray-500 dark:text-gray-400">{author.bio}</Text>
      ) : null}

      <View className="mb-4 flex-row gap-6">
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {author.articleCount}
          </Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500">Articles</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {author.followerCount}
          </Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500">Followers</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {author.followingCount}
          </Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500">Following</Text>
        </View>
      </View>

      {!isOwnProfile ? (
        <Pressable
          onPress={() => toggleFollow()}
          disabled={isFollowPending}
          className={`rounded-lg px-6 py-2 ${
            author.isFollowedByMe
              ? 'border border-gray-300 dark:border-gray-600'
              : 'bg-emerald-600'
          }`}
        >
          <Text
            className={
              author.isFollowedByMe
                ? 'font-medium text-gray-700 dark:text-gray-300'
                : 'font-medium text-white'
            }
          >
            {author.isFollowedByMe ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ArticleCard article={item} />}
      ListHeaderComponent={header}
      contentContainerClassName="p-4"
      className="flex-1 bg-white dark:bg-gray-900"
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        isArticlesLoading ? (
          <View className="mt-8 items-center">
            <ActivityIndicator />
          </View>
        ) : isArticlesError ? (
          <View className="mt-8 items-center">
            <Text className="mb-2 text-gray-400 dark:text-gray-500">
              Failed to load articles
            </Text>
            <Text
              onPress={() => refetchArticles()}
              className="font-medium text-emerald-600 dark:text-emerald-400"
            >
              Try again
            </Text>
          </View>
        ) : (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-400 dark:text-gray-500">
              No articles published yet
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}
