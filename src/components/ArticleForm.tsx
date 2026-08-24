import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

import { uploadImageToCloudinary } from '../api/cloudinary';
import { ArticleInput } from '../api/articles';
import { CategoryPicker } from './CategoryPicker';
import { TagInput } from './TagInput';
import { ThemedTextInput } from './ThemedTextInput';

interface Props {
  initialValues?: Partial<ArticleInput>;
  onSubmit: (values: ArticleInput) => Promise<void>;
  submitLabel: string;
}

export function ArticleForm({ initialValues, onSubmit, submitLabel }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [category, setCategory] = useState<string | null>(initialValues?.category ?? null);
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [coverImage, setCoverImage] = useState<string | undefined>(initialValues?.coverImage);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('ছবি বেছে নিতে গ্যালারি অ্যাক্সেসের অনুমতি দরকার');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    setError(null);
    setIsUploadingImage(true);
    try {
      const url = await uploadImageToCloudinary(result.assets[0].uri);
      setCoverImage(url);
    } catch {
      setError('ছবি আপলোড করতে সমস্যা হয়েছে, আবার চেষ্টা করো');
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleSubmit() {
    if (!category) {
      setError('একটা category বেছে নাও');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        coverImage,
      });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'কিছু একটা ভুল হয়েছে')
        : 'কিছু একটা ভুল হয়েছে';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isValid = title.trim().length >= 3 && content.trim().length >= 10 && Boolean(category);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900" contentContainerClassName="p-4 pb-10">
      <Text className="mb-1 text-sm text-gray-600 dark:text-gray-400">Cover Image</Text>
      <Pressable
        onPress={handlePickImage}
        className="mb-4 h-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
      >
        {isUploadingImage ? (
          <ActivityIndicator />
        ) : coverImage ? (
          <Image source={{ uri: coverImage }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <Text className="text-gray-400 dark:text-gray-500">ছবি বেছে নিতে ট্যাপ করো</Text>
        )}
      </Pressable>

      <Text className="mb-1 text-sm text-gray-600 dark:text-gray-400">Title</Text>
      <ThemedTextInput
        value={title}
        onChangeText={setTitle}
        placeholder="আর্টিকেলের শিরোনাম"
        className="mb-4"
      />

      <Text className="mb-1 text-sm text-gray-600 dark:text-gray-400">Category</Text>
      <View className="mb-4">
        <CategoryPicker value={category} onChange={setCategory} />
      </View>

      <Text className="mb-1 text-sm text-gray-600 dark:text-gray-400">Tags</Text>
      <View className="mb-4">
        <TagInput tags={tags} onChange={setTags} />
      </View>

      <Text className="mb-1 text-sm text-gray-600 dark:text-gray-400">Content</Text>
      <ThemedTextInput
        value={content}
        onChangeText={setContent}
        placeholder="তোমার আর্টিকেল লেখো..."
        multiline
        textAlignVertical="top"
        className="mb-4 min-h-[160px]"
      />

      {error ? <Text className="mb-4 text-red-500 dark:text-red-400">{error}</Text> : null}

      <Pressable
        onPress={handleSubmit}
        disabled={!isValid || isSubmitting || isUploadingImage}
        className="items-center rounded-lg bg-blue-600 py-3 disabled:opacity-50"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-semibold text-white">{submitLabel}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
