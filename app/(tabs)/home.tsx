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
        <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
          <Text className="text-gray-700">#{tag} ট্যাগ দিয়ে ফিল্টার করা হচ্ছে</Text>
          <Pressable onPress={clearFilters}>
            <Text className="font-medium text-blue-600">Clear</Text>
          </Pressable>
        </View>
      ) : (
        <CategoryChips selected={category} onSelect={setCategory} />
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white">
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center text-gray-500">আর্টিকেল লোড করতে সমস্যা হয়েছে</Text>
          <Text onPress={() => refetch()} className="font-medium text-blue-600">
            আবার চেষ্টা করো
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ArticleCard article={item} />}
      ListHeaderComponent={header}
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
