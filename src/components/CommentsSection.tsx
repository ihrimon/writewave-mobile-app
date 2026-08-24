import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { CommentItem } from './CommentItem';
import { ThemedTextInput } from './ThemedTextInput';
import { useComments } from '../hooks/useComments';
import { useCreateComment } from '../hooks/useCreateComment';

interface Props {
  articleId: string;
}

// নেস্টেড VirtualizedList-in-ScrollView সমস্যা এড়াতে (এই কম্পোনেন্ট বসে Article Detail-এর
// বাইরের ScrollView-এর ভেতরে) FlatList ব্যবহার না করে সরাসরি .map() + "আরও দেখাও" বাটন।
export function CommentsSection({ articleId }: Props) {
  const [draft, setDraft] = useState('');
  const [postError, setPostError] = useState<string | null>(null);
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useComments(articleId);
  const { mutateAsync, isPending } = useCreateComment(articleId);

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  async function handleSubmit() {
    const text = draft.trim();
    if (!text) return;
    setPostError(null);
    try {
      // সফল হওয়ার আগে draft ক্লিয়ার করা হয় না — ব্যর্থ হলে ইউজারের লেখা টেক্সট হারিয়ে যাবে না
      await mutateAsync(text);
      setDraft('');
    } catch {
      setPostError('মন্তব্য পোস্ট করতে সমস্যা হয়েছে, আবার চেষ্টা করো');
    }
  }

  return (
    <View className="mt-2">
      <Text className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        মন্তব্য{comments.length > 0 ? ` (${comments.length})` : ''}
      </Text>

      <View className="mb-2 flex-row items-center">
        <ThemedTextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="একটা মন্তব্য লেখো..."
          className="mr-2 flex-1"
        />
        <Pressable
          onPress={handleSubmit}
          disabled={!draft.trim() || isPending}
          className="rounded-lg bg-blue-600 px-4 py-3 disabled:opacity-50"
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-medium text-white">Post</Text>
          )}
        </Pressable>
      </View>

      {postError ? (
        <Text className="mb-4 text-sm text-red-500 dark:text-red-400">{postError}</Text>
      ) : (
        <View className="mb-4" />
      )}

      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <View className="items-center py-4">
          <Text className="mb-2 text-gray-400 dark:text-gray-500">
            মন্তব্য লোড করতে সমস্যা হয়েছে
          </Text>
          <Text onPress={() => refetch()} className="font-medium text-blue-600 dark:text-blue-400">
            আবার চেষ্টা করো
          </Text>
        </View>
      ) : comments.length === 0 ? (
        <Text className="text-gray-400 dark:text-gray-500">
          এখনো কোনো মন্তব্য নেই — প্রথম মন্তব্যটা তোমার হোক
        </Text>
      ) : (
        comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
      )}

      {hasNextPage ? (
        <Pressable
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="items-center py-2"
        >
          {isFetchingNextPage ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-blue-600 dark:text-blue-400">আরও মন্তব্য দেখাও</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
