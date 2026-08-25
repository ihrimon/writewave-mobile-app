import { useColorScheme } from 'nativewind';
import { TextInput, TextInputProps } from 'react-native';

// placeholderTextColor NativeWind-এর className দিয়ে সেট করা যায় না (এটা RN-এর নিজস্ব
// প্রপ, Tailwind-এর `placeholder:` variant না) — তাই colorScheme অনুযায়ী সরাসরি
// prop হিসেবে পাস করা হয়েছে। এই একটা কম্পোনেন্ট দিয়ে অ্যাপের সব TextInput dark-mode-aware।
export function ThemedTextInput({ className, ...props }: TextInputProps) {
  const { colorScheme } = useColorScheme();

  return (
    <TextInput
      placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
      className={`rounded-lg border border-gray-300 px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 ${className ?? ''}`}
      {...props}
    />
  );
}
