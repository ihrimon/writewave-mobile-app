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
      className="border-b border-gray-100"
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
              isActive ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
            }`}
          >
            <Text className={isActive ? 'font-medium text-white' : 'text-gray-700'}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
