import { useColorScheme } from 'nativewind';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import { ArticleCard } from '../../src/components/ArticleCard';
import { CategoryChips } from '../../src/components/CategoryChips';
import { useArticles } from '../../src/hooks/useArticles';
import { useFilterStore } from '../../src/store/filterStore';
import { ArticleSummary } from '../../src/types';

export default function HomeScreen() {
  const category = useFilterStore((s) => s.category);
  const tag = useFilterStore((s) => s.tag);
  const setCategory = useFilterStore((s) => s.setCategory);
  const clearFilters = useFilterStore((s) => s.clear);
  const { colorScheme } = useColorScheme();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticles({ category: category ?? undefined, tag: tag ?? undefined });

  const articles: ArticleSummary[] = data?.pages.flatMap((page) => page.articles) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // FlatList-এর contentContainerClassName="p-4" cards-এর জন্য দরকার, কিন্তু header-কে
  // full-bleed (edge-to-edge) দেখাতে negative margin দিয়ে সেই padding বাতিল করা হয়েছে।
  const header = (
    <View className="-mx-4 -mt-4 mb-2">
      {tag ? (
        <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <Text className="text-gray-700 dark:text-gray-300">Filtering by #{tag}</Text>
          <Pressable onPress={clearFilters}>
            <Text className="font-medium text-emerald-600 dark:text-emerald-400">Clear</Text>
          </Pressable>
        </View>
      ) : (
        <CategoryChips selected={category} onSelect={setCategory} />
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center text-gray-500 dark:text-gray-400">
            Failed to load articles
          </Text>
          <Text
            onPress={() => refetch()}
            className="font-medium text-emerald-600 dark:text-emerald-400"
          >
            Try again
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleCard article={item} />}
        ListHeaderComponent={header}
        contentContainerClassName="p-4"
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colorScheme === 'dark' ? '#9ca3af' : undefined}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400 dark:text-gray-500">No articles yet</Text>
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
    </View>
  );
}
