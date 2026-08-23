import { Redirect } from 'expo-router';

// Phase 1-এ এখানে auth state চেক করে (auth) বা (tabs)-এ redirect করা হবে।
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
