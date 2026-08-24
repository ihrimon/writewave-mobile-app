import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';

import { ArticleCard } from '../../src/components/ArticleCard';
import { useArticles } from '../../src/hooks/useArticles';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';
import { ArticleSummary } from '../../src/types';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const hasQuery = debouncedQuery.length > 0;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useArticles(
    { search: debouncedQuery || undefined },
    { enabled: hasQuery }
  );

  const articles: ArticleSummary[] = data?.pages.flatMap((page) => page.articles) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1 bg-white">
      <View className="border-b border-gray-100 px-4 py-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="আর্টিকেল খুঁজুন..."
          autoCapitalize="none"
          className="rounded-lg border border-gray-300 px-4 py-3"
        />
      </View>

      {!hasQuery ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-400">খোঁজার জন্য কিছু লিখো</Text>
        </View>
      ) : isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ArticleCard article={item} />}
          contentContainerClassName="p-4"
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-gray-400">কোনো আর্টিকেল পাওয়া যায়নি</Text>
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
      )}
    </View>
  );
}
