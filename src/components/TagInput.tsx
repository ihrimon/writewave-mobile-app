import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const MAX_TAGS = 10;

export function TagInput({ tags, onChange }: Props) {
  const [draft, setDraft] = useState('');

  function commitDraft() {
    const cleaned = draft.trim().toLowerCase();
    if (cleaned && !tags.includes(cleaned) && tags.length < MAX_TAGS) {
      onChange([...tags, cleaned]);
    }
    setDraft('');
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <View>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={commitDraft}
        placeholder="ট্যাগ লিখে Enter চাপো (যেমন: react-native)"
        autoCapitalize="none"
        className="rounded-lg border border-gray-300 px-4 py-3"
      />
      {tags.length > 0 ? (
        <View className="mt-2 flex-row flex-wrap">
          {tags.map((tag) => (
            <Pressable
              key={tag}
              onPress={() => removeTag(tag)}
              className="mb-2 mr-2 flex-row items-center rounded-full bg-gray-100 px-3 py-1"
            >
              <Text className="text-xs text-gray-600">#{tag} ✕</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
