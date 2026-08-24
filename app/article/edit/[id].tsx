import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !article) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-gray-500">আর্টিকেল পাওয়া যায়নি</Text>
      </View>
    );
  }

  if (article.author.id !== user?.id) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-gray-500">শুধু নিজের আর্টিকেল এডিট করা যায়</Text>
      </View>
    );
  }

  async function handleSubmit(values: ArticleInput) {
    await mutateAsync(values);
    router.replace(`/article/${id}`);
  }

  return (
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
  );
}
