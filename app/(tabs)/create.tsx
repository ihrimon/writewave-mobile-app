import { router } from 'expo-router';

import { ArticleForm } from '../../src/components/ArticleForm';
import { ArticleInput } from '../../src/api/articles';
import { useCreateArticle } from '../../src/hooks/useCreateArticle';

export default function CreateArticleScreen() {
  const { mutateAsync } = useCreateArticle();

  async function handleSubmit(values: ArticleInput) {
    const article = await mutateAsync(values);
    router.replace(`/article/${article.id}`);
  }

  return <ArticleForm submitLabel="Publish" onSubmit={handleSubmit} />;
}
