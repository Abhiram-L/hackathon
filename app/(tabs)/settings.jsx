import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from '../../store/auth';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring 
} from "react-native-reanimated";
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

export default function Settings() {
  const { logout } = useAuthStore();
  const router = useRouter();
  
  // Animation values
  const cardScale = useSharedValue(0.95);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  
  // Animate cards on mount
  React.useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 800 });
    cardScale.value = withSpring(1);
  }, []);
  
  const cardsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ scale: cardScale.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const pressInAnimation = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };
  
  const pressOutAnimation = () => {
    buttonScale.value = withSpring(1);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const navigateToAboutYou = () => {
    router.push("/aboutyou");
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={styles.headerContainer}
      >
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your app experience</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[styles.sectionContainer, cardsAnimatedStyle]}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={navigateToAboutYou}
            onPressIn={pressInAnimation}
            onPressOut={pressOutAnimation}
          >
            <View style={styles.settingItemIcon}>
              <Ionicons name="person-outline" size={22} color={COLORS.accent} />
            </View>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemText}>About You</Text>
              <Text style={styles.settingItemDescription}>Your personal info & health preferences</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={COLORS.textTertiary} />
          </TouchableOpacity>

          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemIcon}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.accent} />
            </View>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemText}>Notifications</Text>
              <Text style={styles.settingItemDescription}>Manage alert preferences</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View
          style={[styles.sectionContainer, cardsAnimatedStyle]}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={styles.sectionTitle}>App</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemIcon}>
              <Ionicons name="moon-outline" size={22} color={COLORS.accent} />
            </View>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemText}>Appearance</Text>
              <Text style={styles.settingItemDescription}>Dark mode & theme settings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemIcon}>
              <Ionicons name="language-outline" size={22} color={COLORS.accent} />
            </View>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemText}>Language</Text>
              <Text style={styles.settingItemDescription}>Change app language</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View
          style={[styles.sectionContainer, cardsAnimatedStyle]}
          entering={FadeInDown.delay(500).duration(500)}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemIcon}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.accent} />
            </View>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemText}>Help Center</Text>
              <Text style={styles.settingItemDescription}>FAQs & support resources</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemIcon}>
              <Ionicons name="document-text-outline" size={22} color={COLORS.accent} />
            </View>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemText}>Terms & Policies</Text>
              <Text style={styles.settingItemDescription}>Privacy policy & terms of use</Text>
            </View>
            <MaterialIcons name="chevron-right" size={26} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <Animated.View 
        style={styles.bottomContainer}
        entering={FadeInDown.delay(600).duration(500)}
      >
        <Animated.View style={[buttonAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            onPressIn={pressInAnimation}
            onPressOut={pressOutAnimation}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const COLORS = {
  background: "#121212",       // Primary Background
  cardBg: "#1E1E1E",           // Card background (gray)
  inputBg: "#2C2C2C",          // Input background
  border: "#333333",           // Dividers/Borders
  textPrimary: "#FFFFFF",      // Primary Text
  textSecondary: "#AAAAAA",    // Secondary Text
  textTertiary: "#777777",     // Tertiary Text for less important items
  dueBadge: "#FFB74D",         // Yellow for due members
  expiringBadge: "#EF5350",    // Red for expiring members
  activeBadge: "#4CAF50",      // Green for active members
  accent: "#4CAF50",           // Green accent
  buttonText: "#121212",       // Dark text for better contrast on bright backgrounds
  idBadgeBg: "#2C2C2C",        // Dark background for gym ID
  idBadgeText: "#FFFFFF",      // White text for gym ID
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingItemDescription: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  logoutButton: {
    backgroundColor: COLORS.expiringBadge,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});