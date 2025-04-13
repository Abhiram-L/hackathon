import { Stack } from 'expo-router/stack';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

export default function Layout() {
  const { user } = useAuthStore(); // Get the user from the auth store
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // This is the first segment of the route (e.g., "generate" in "/generate/id")
    const firstSegment = segments[0];
    
    // Only perform redirects for initial app load or specific protected paths
    const isInitialLoad = segments.length === 0 || 
                          (segments.length === 1 && segments[0] === '');
    
    if (isInitialLoad) {
      // Initial app load, redirect based on authentication
      if (user) {
        router.replace('(tabs)');
      } else {
        router.replace('/login');
      }
      return;
    }
    
    // For specific protected routes that require authentication
    const protectedRoutes = ['generate','display'];
    const needsAuth = protectedRoutes.includes(firstSegment);
    
    if (needsAuth && !user) {
      // User is trying to access a protected route but is not logged in
      router.replace('/login');
    }
    
    // Skip redirecting to (tabs) if the user is navigating to a specific route
    // This allows navigation to routes like /generate/id to work properly
    
  }, [user, segments]);

  return (
    <Stack>
      {/* Define your screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false, headerTitle: false }} />
      <Stack.Screen name="aboutyou" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="generate/[id]" options={{ headerShown: false,headerTitle:false }} />
      <Stack.Screen name="display" options={{ headerShown: false,headerTitle:false }} />
    </Stack>
  );
}