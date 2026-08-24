import { Image, Text, View } from 'react-native';

import { Comment } from '../types';

interface Props {
  comment: Comment;
}

export function CommentItem({ comment }: Props) {
  return (
    <View className="mb-4 flex-row">
      {comment.author.avatarUrl ? (
        <Image source={{ uri: comment.author.avatarUrl }} className="mr-3 h-8 w-8 rounded-full" />
      ) : (
        <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <Text className="text-xs font-semibold text-gray-500 dark:text-gray-300">
            {comment.author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="mr-2 font-medium text-gray-900 dark:text-gray-100">
            {comment.author.name}
          </Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text className="text-gray-700 dark:text-gray-300">{comment.text}</Text>
      </View>
    </View>
  );
}
