import { router } from 'expo-router';
import { View } from 'react-native';

import { ArticleForm } from '../../src/components/ArticleForm';
import { ArticleInput } from '../../src/api/articles';
import { useCreateArticle } from '../../src/hooks/useCreateArticle';

export default function CreateArticleScreen() {
  const { mutateAsync } = useCreateArticle();

  async function handleSubmit(values: ArticleInput) {
    const article = await mutateAsync(values);
    router.replace(`/article/${article.id}`);
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <ArticleForm submitLabel="Publish" onSubmit={handleSubmit} />
    </View>
  );
}
