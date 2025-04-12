import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Wrap AsyncStorage in a custom storage adapter
const storage = {
  getItem: async (name) => {
    const item = await AsyncStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (phone_number, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number, password }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Invalid credentials');
          }
          const user = {
            id: data.id,
            name: data.name,
            phone_number: data.phone_number,
            token: data.token,
          };
          // Store user details in AsyncStorage via the custom adapter
          await AsyncStorage.setItem('authUser', JSON.stringify(user));
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      logout: async () => {
        try {
          // Remove user details and token from AsyncStorage
          await AsyncStorage.removeItem('authUser');
          set({ user: null, error: null });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
    }),
    {
      name: 'auth-store',
      storage,
    }
  )
);