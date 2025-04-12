import { Stack } from 'expo-router/stack';
import { useAuthStore } from '@/store/auth'; // Import your auth store to check login status
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Layout() {
  const { user } = useAuthStore(); // Get the user from the auth store
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // If the user is logged in, redirect to the main tabs
      router.replace('(tabs)');
    } else {
      // If not logged in, redirect to the login page
      router.replace('/login');
    }
  }, [user]); // Run this effect when the user state changes

  return (
    <Stack>
      {/* Define your screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false ,headerTitle:false}} />
      <Stack.Screen name="aboutyou" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}