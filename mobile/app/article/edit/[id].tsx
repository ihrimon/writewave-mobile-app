import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArticleForm } from '../../../src/components/ArticleForm';
import { ArticleInput } from '../../../src/api/articles';
import { useAuth } from '../../../src/context/AuthContext';
import { useArticle } from '../../../src/hooks/useArticle';
import { useUpdateArticle } from '../../../src/hooks/useUpdateArticle';

export default function EditArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { data: article, isLoading, isError } = useArticle(id);
  const { mutateAsync } = useUpdateArticle(id);

  if (isLoading) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (isError || !article) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 items-center justify-center bg-white px-6 dark:bg-gray-900">
        <Text className="text-gray-500 dark:text-gray-400">Article not found</Text>
      </SafeAreaView>
    );
  }

  if (article.author.id !== user?.id) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 items-center justify-center bg-white px-6 dark:bg-gray-900">
        <Text className="text-gray-500 dark:text-gray-400">You can only edit your own articles</Text>
      </SafeAreaView>
    );
  }

  async function handleSubmit(values: ArticleInput) {
    await mutateAsync(values);
    router.replace(`/article/${id}`);
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white dark:bg-gray-900">
      <ArticleForm
        submitLabel="Save Changes"
        initialValues={{
          title: article.title,
          content: article.content,
          category: article.category,
          tags: article.tags,
          coverImage: article.coverImage,
        }}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}
