import { Pressable, ScrollView, Text } from 'react-native';

const CATEGORIES = ['All', 'Technology', 'Sports', 'Politics', 'Health'];

interface Props {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryChips({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-gray-100 dark:border-gray-800"
      contentContainerClassName="flex-row items-center gap-2 px-4 py-3"
    >
      {CATEGORIES.map((category) => {
        const value = category === 'All' ? null : category;
        const isActive = selected === value;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(value)}
            className={`rounded-full border px-4 py-2 ${
              isActive
                ? 'border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500'
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
