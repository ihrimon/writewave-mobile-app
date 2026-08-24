import { Pressable, ScrollView, Text } from 'react-native';

const CATEGORIES = ['Technology', 'Sports', 'Politics', 'Health'];

interface Props {
  value: string | null;
  onChange: (category: string) => void;
}

export function CategoryPicker({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row items-center gap-2"
    >
      {CATEGORIES.map((category) => {
        const isActive = value === category;
        return (
          <Pressable
            key={category}
            onPress={() => onChange(category)}
            className={`rounded-full border px-4 py-2 ${
              isActive
                ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
            }`}
          >
            <Text
              className={
                isActive ? 'font-medium text-white' : 'text-gray-700 dark:text-gray-300'
              }
            >
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
