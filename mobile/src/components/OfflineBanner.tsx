import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export function OfflineBanner() {
  // state.isConnected শুরুতে null থাকে (এখনো জানা যায়নি) — সেটাকে "offline" হিসেবে
  // ধরলে অ্যাপ চালু হওয়ার মুহূর্তে একটা ভুল "সংযোগ নেই" ফ্ল্যাশ দেখাবে, তাই strictly
  // === false চেক করা হয়েছে।
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <View className="bg-red-600 px-4 py-2">
      <Text className="text-center text-sm font-medium text-white">
        No internet connection — some features may not work
      </Text>
    </View>
  );
}
