import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { CommentItem } from './CommentItem';
import { useComments } from '../hooks/useComments';
import { useCreateComment } from '../hooks/useCreateComment';

interface Props {
  articleId: string;
}

// নেস্টেড VirtualizedList-in-ScrollView সমস্যা এড়াতে (এই কম্পোনেন্ট বসে Article Detail-এর
// বাইরের ScrollView-এর ভেতরে) FlatList ব্যবহার না করে সরাসরি .map() + "আরও দেখাও" বাটন।
export function CommentsSection({ articleId }: Props) {
  const [draft, setDraft] = useState('');
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useComments(articleId);
  const { mutateAsync, isPending } = useCreateComment(articleId);

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  async function handleSubmit() {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await mutateAsync(text);
  }

  return (
    <View className="mt-2">
      <Text className="mb-4 text-lg font-semibold text-gray-900">
        মন্তব্য{comments.length > 0 ? ` (${comments.length})` : ''}
      </Text>

      <View className="mb-6 flex-row items-center">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="একটা মন্তব্য লেখো..."
          className="mr-2 flex-1 rounded-lg border border-gray-300 px-4 py-3"
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

      {isLoading ? (
        <ActivityIndicator />
      ) : comments.length === 0 ? (
        <Text className="text-gray-400">এখনো কোনো মন্তব্য নেই — প্রথম মন্তব্যটা তোমার হোক</Text>
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
            <Text className="text-blue-600">আরও মন্তব্য দেখাও</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
