import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';

import { ArticleCard } from '../../src/components/ArticleCard';
import { useAuth } from '../../src/context/AuthContext';
import { useArticles } from '../../src/hooks/useArticles';
import { useAuthor } from '../../src/hooks/useAuthor';
import { useFollowAuthor } from '../../src/hooks/useFollowAuthor';
import { ArticleSummary } from '../../src/types';

export default function AuthorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { data: author, isLoading: isAuthorLoading, isError: isAuthorError } = useAuthor(id);
  const { mutate: toggleFollow, isPending: isFollowPending } = useFollowAuthor(id);

  const {
    data,
    isLoading: isArticlesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticles({ authorId: id });

  const articles: ArticleSummary[] = data?.pages.flatMap((page) => page.articles) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isAuthorLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (isAuthorError || !author) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-gray-500">প্রোফাইল পাওয়া যায়নি</Text>
      </View>
    );
  }

  const isOwnProfile = user?.id === author.id;

  // Home screen-এর মতো এখানেও FlatList-এর contentContainerClassName="p-4" cards-এর জন্য
  // দরকার, তাই header-কে negative margin দিয়ে full-bleed করা হয়েছে।
  const header = (
    <View className="-mx-4 -mt-4 mb-2 items-center border-b border-gray-100 px-6 py-8">
      {author.avatarUrl ? (
        <Image source={{ uri: author.avatarUrl }} className="mb-3 h-20 w-20 rounded-full" />
      ) : (
        <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-gray-200">
          <Text className="text-2xl font-semibold text-gray-500">
            {author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text className="mb-1 text-xl font-bold text-gray-900">{author.name}</Text>
      {author.bio ? <Text className="mb-4 text-center text-gray-500">{author.bio}</Text> : null}

      <View className="mb-4 flex-row gap-6">
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-900">{author.articleCount}</Text>
          <Text className="text-xs text-gray-400">আর্টিকেল</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-900">{author.followerCount}</Text>
          <Text className="text-xs text-gray-400">ফলোয়ার</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-900">{author.followingCount}</Text>
          <Text className="text-xs text-gray-400">ফলোয়িং</Text>
        </View>
      </View>

      {!isOwnProfile ? (
        <Pressable
          onPress={() => toggleFollow()}
          disabled={isFollowPending}
          className={`rounded-lg px-6 py-2 ${
            author.isFollowedByMe ? 'border border-gray-300' : 'bg-blue-600'
          }`}
        >
          <Text
            className={author.isFollowedByMe ? 'font-medium text-gray-700' : 'font-medium text-white'}
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
      className="flex-1 bg-white"
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        isArticlesLoading ? (
          <View className="mt-8 items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-400">এখনো কোনো আর্টিকেল প্রকাশ করা হয়নি</Text>
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
