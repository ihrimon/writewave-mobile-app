import { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

import { ArticleCard } from '../../src/components/ArticleCard';
import { useArticles } from '../../src/hooks/useArticles';
import { ArticleSummary } from '../../src/types';

export default function HomeScreen() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticles();

  const articles: ArticleSummary[] = data?.pages.flatMap((page) => page.articles) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-4 text-center text-gray-500">আর্টিকেল লোড করতে সমস্যা হয়েছে</Text>
        <Text onPress={() => refetch()} className="font-medium text-blue-600">
          আবার চেষ্টা করো
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ArticleCard article={item} />}
      contentContainerClassName="p-4"
      className="flex-1 bg-white"
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <View className="items-center justify-center py-20">
          <Text className="text-gray-400">এখনো কোনো আর্টিকেল নেই</Text>
        </View>
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
