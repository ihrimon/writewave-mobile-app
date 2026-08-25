import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { AppState, AppStateStatus, Platform } from 'react-native';

// TanStack Query মূলত ওয়েবের জন্য ডিজাইন করা — ব্রাউজারের navigator.onLine ও
// visibilitychange ইভেন্ট দিয়ে online/focus বোঝে। React Native-এ এসব নেই, তাই
// NetInfo ও AppState দিয়ে ম্যানুয়ালি integrate করতে হয় (TanStack Query-র নিজস্ব
// React Native গাইডেই এই প্যাটার্ন ডকুমেন্টেড)। এই ফাইল import করলেই সাইড-ইফেক্ট
// হিসেবে নিচের দুটো listener রেজিস্টার হয়ে যায়।

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(Boolean(state.isConnected));
  });
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

AppState.addEventListener('change', onAppStateChange);
