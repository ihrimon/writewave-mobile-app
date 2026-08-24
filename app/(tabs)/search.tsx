import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArticleCard } from '../../src/components/ArticleCard';
import { ThemedTextInput } from '../../src/components/ThemedTextInput';
import { useArticles } from '../../src/hooks/useArticles';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';
import { ArticleSummary } from '../../src/types';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const hasQuery = debouncedQuery.length > 0;

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useArticles({ search: debouncedQuery || undefined }, { enabled: hasQuery });

  const articles: ArticleSummary[] = data?.pages.flatMap((page) => page.articles) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-gray-900">
      <View className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <ThemedTextInput
          value={query}
          onChangeText={setQuery}
          placeholder="আর্টিকেল খুঁজুন..."
          autoCapitalize="none"
        />
      </View>

      {!hasQuery ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-400 dark:text-gray-500">খোঁজার জন্য কিছু লিখো</Text>
        </View>
      ) : isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center text-gray-500 dark:text-gray-400">
            সার্চ করতে সমস্যা হয়েছে
          </Text>
          <Text
            onPress={() => refetch()}
            className="font-medium text-blue-600 dark:text-blue-400"
          >
            আবার চেষ্টা করো
          </Text>
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
              <Text className="text-gray-400 dark:text-gray-500">কোনো আর্টিকেল পাওয়া যায়নি</Text>
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
    </SafeAreaView>
  );
}
