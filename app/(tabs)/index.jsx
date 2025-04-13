import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Platform,
  StatusBar,
  SafeAreaView,
  Animated,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Dark theme with violet accents
const COLORS = {
  background: "#121212",       // Dark background
  cardBg: "#1E1E1E",           // Dark card background
  cardShadow: "#000000",       // Shadow color
  inputBg: "#2C2C2C",          // Input background
  border: "#333333",           // Dark borders
  textPrimary: "#FFFFFF",      // White text
  textSecondary: "#CCCCCC",    // Light gray text
  textTertiary: "#999999",     // Medium gray text
  accent: "#9C27B0",           // Violet accent
  accentLight: "#BA68C8",      // Light violet
  accentDark: "#7B1FA2",       // Dark violet
  buttonGradient1: ["#9C27B0", "#673AB7"],   // Violet to purple gradient
  buttonGradient2: ["#7B1FA2", "#512DA8"],   // Dark violet gradient
  success: "#4CAF50",          // Green for success
  successLight: "#A5D6A7",     // Light green
  progressBar: "#9C27B0",      // Violet for progress
  danger: "#F44336",           // Red for danger/cancel
};

const PhotoUpload = () => {
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));
  
  useEffect(() => {
    // Animate component mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Generate a unique ID for the food item
  const generateFoodId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Navigate to the generate page
  const navigateToGeneratePage = (id) => {
    router.push(`/generate/${id}`);
  };
  
  const simulateUpload = () => {
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      
      // Navigate after a short delay
      setTimeout(() => {
        setUploadComplete(false);
        const foodId = generateFoodId();
        navigateToGeneratePage(foodId);
      }, 1000);
    }, 1500);
  };

  const handleImageSelected = (result) => {
    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setPhoto(selectedUri);
      
      // Simulate upload process
      setTimeout(() => {
        simulateUpload();
      }, 500);
    }
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access the photo library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1]
    });

    handleImageSelected(result);
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access the camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1]
    });

    handleImageSelected(result);
  };

  const renderMainContent = () => {
    if (isUploading) {
      return (
        <View style={styles.stateContainer}>
          <View style={styles.uploadingContainer}>
            <View style={styles.uploadingIconContainer}>
              <MaterialCommunityIcons name="food-apple" size={30} color={COLORS.accent} />
              <MaterialCommunityIcons 
                name="arrow-up-circle" 
                size={20} 
                color={COLORS.accentLight} 
                style={styles.cornerIcon}
              />
            </View>
            <Text style={styles.uploadingTitle}>Analyzing Food</Text>
            <Text style={styles.uploadingSubtitle}>Scanning for ingredients and nutrition</Text>
            
            <View style={styles.progressBarBackground}>
              <Animated.View style={[styles.progressBar, {
                width: '100%',
                backgroundColor: COLORS.accent
              }]} />
            </View>
          </View>
        </View>
      );
    }
    
    if (uploadComplete) {
      return (
        <View style={styles.stateContainer}>
          <View style={styles.successContainer}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark-sharp" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Food Analyzed!</Text>
            <Text style={styles.successSubtitle}>Preparing your results...</Text>
          </View>
        </View>
      );
    }
    
    if (photo) {
      return (
        <View style={styles.photoWrapper}>
          <Image source={{ uri: photo }} style={styles.image} />
          <TouchableOpacity 
            style={styles.retakeButton}
            onPress={() => setPhoto(null)}
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <Animated.View 
        style={[
          styles.startContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.instructionsCard}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="utensils" size={26} color={COLORS.accent} />
          </View>
          <Text style={styles.instructionsTitle}>Analyze Your Food</Text>
          <Text style={styles.instructionsText}>
            Take a photo of your dish to get detailed nutrition information and recipe ideas
          </Text>
        </View>

        <View style={styles.cameraOptionsContainer}>
          <TouchableOpacity 
            style={styles.cameraOption} 
            onPress={handleTakePhoto}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="camera" size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.optionLabel}>Take Photo</Text>
          </TouchableOpacity>
          
          <View style={styles.optionDivider} />
          
          <TouchableOpacity 
            style={styles.cameraOption} 
            onPress={handleChoosePhoto}
            activeOpacity={0.8}
          >
            <View style={styles.optionIcon}>
              <MaterialIcons name="photo-library" size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.optionLabel}>Gallery</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentExamples}>
          <Text style={styles.recentTitle}>Examples</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.examplesContainer}
          >
            {['pizza', 'salad', 'burger'].map((item, index) => (
              <View key={index} style={styles.exampleCard}>
                <View style={styles.exampleIconContainer}>
                  <MaterialCommunityIcons 
                    name={
                      item === 'pizza' ? 'pizza' : 
                      item === 'salad' ? 'food-apple' : 'food'
                    } 
                    size={24} 
                    color={COLORS.accent} 
                  />
                </View>
                <Text style={styles.exampleText}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.appName}>Safe Bite</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {renderMainContent()}
      </View>
      
      {!photo && !isUploading && !uploadComplete && (
        <View style={styles.appTagline}>
          <View style={styles.taglineIconContainer}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.accent} />
          </View>
          <Text style={styles.taglineText}>Food safety & nutrition assistant</Text>
        </View>
      )}
      
      {(photo || isUploading || uploadComplete) && (
        <TouchableOpacity
          style={styles.scanButton}
          disabled={isUploading || uploadComplete}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={COLORS.buttonGradient1}
            style={styles.scanButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.scanButtonText}>
              {isUploading ? "Analyzing..." : uploadComplete ? "Complete!" : "Rescan"}
            </Text>
            {!isUploading && !uploadComplete && (
              <Ionicons name="scan-outline" size={20} color="#FFFFFF" style={styles.scanIcon} />
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}

      <View style={styles.footerNote}>
        <Text style={styles.dateText}>Last updated: {new Date().toLocaleDateString()}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  settingsButton: {
    padding: 5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startContainer: {
    width: '100%',
    alignItems: 'center',
  },
  instructionsCard: {
    width: '100%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  cameraOptionsContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  cameraOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  optionDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  recentExamples: {
    width: '100%',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
    paddingLeft: 5,
  },
  examplesContainer: {
    paddingRight: 15,
  },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    marginLeft: 5,
    padding: 10,
    paddingRight: 15,
    borderRadius: 12,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  exampleText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  photoWrapper: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.accentDark,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  retakeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.6)',
  },
  stateContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingContainer: {
    width: '90%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.2)',
  },
  uploadingIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  cornerIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  uploadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  uploadingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '60%',
  },
  successContainer: {
    width: '90%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  successCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  appTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  taglineIconContainer: {
    marginRight: 6,
  },
  taglineText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  scanButton: {
    width: '90%',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.accentDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    alignSelf: 'center',
  },
  scanButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanIcon: {
    marginLeft: 8,
  },
  footerNote: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textTertiary,
  }
});

export default PhotoUpload;