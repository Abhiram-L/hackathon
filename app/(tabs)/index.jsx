import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/auth';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://your-backend-url.com'; 

const PhotoUpload = () => {
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigation = useNavigation();
  const { user } = useAuthStore();
  
  // Upload photo to backend
  const uploadPhotoToServer = async (uri) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      
      // Reset progress
      setUploadProgress(0);
      
      // Create form data for the upload
      const formData = new FormData();
      
      // Platform-specific code for getting the image
      if (Platform.OS === 'web') {
        // For web: Fetch the image as a blob
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('image', blob, `photo-${Date.now()}.jpg`);
      } else {
        // For native platforms: Use the URI directly
        formData.append('image', {
          uri: uri,
          type: 'image/jpeg',
          name: `photo-${Date.now()}.jpg`,
        });
      }
      
      // Add the user ID to form data
      formData.append('userId', user?.id?.toString() || '1');

      // Get authentication token from the user object
      const token = user?.token || '';
      
      // Setup axios config with proper authentication
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = progressEvent.loaded / progressEvent.total;
            // Update the progress display
            setUploadProgress(progress);
          }
        }
      };
      
      // Send request using axios
      const response = await axios.post(
        `${API_URL}/api/analyze-product`, 
        formData, 
        config
      );
      
      // Complete the progress
      setUploadProgress(1);
      setIsUploading(false);
      setUploadComplete(true);
      setUploadResult(response.data);
      
      // Navigate to Display screen with the data
      setTimeout(() => {
        navigation.navigate('Display', { data: response.data });
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      let errorMessage = 'There was a problem uploading your photo. Please try again.';
      
      if (error.response) {
        // The server responded with an error
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUploadError(errorMessage);
      setIsUploading(false);
      Alert.alert('Upload Failed', errorMessage, [{ text: 'OK' }]);
      setUploadProgress(0);
    }
  };

  const handleImageSelected = (result) => {
    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setPhoto(selectedUri);
      
      // Upload the photo after a short delay to let UI update
      setTimeout(() => {
        uploadPhotoToServer(selectedUri);
      }, 500);
    }
  };

  const handleChoosePhoto = async () => {
    // Request permissions for accessing the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Permission to access the photo library is required!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1]
    });

    handleImageSelected(result);
  };

  const handleTakePhoto = async () => {
    // Request permissions for accessing the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Permission to access the camera is required!');
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1]
    });

    handleImageSelected(result);
  };

  const renderPhotoContainer = () => {
    if (isUploading) {
      return (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>Analyzing product...</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${uploadProgress * 100}%` }]} />
          </View>
          <Text style={styles.uploadingSubtext}>This may take a moment</Text>
        </View>
      );
    }
    
    if (uploadError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#f44336" />
          <Text style={styles.errorText}>Upload Failed</Text>
          <Text style={styles.errorSubtext}>{uploadError}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setPhoto(null);
              setUploadError(null);
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (uploadComplete) {
      return (
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-sharp" size={60} color="#fff" />
          </View>
          <Text style={styles.successText}>Analysis Complete!</Text>
          <Text style={styles.successSubtext}>Taking you to results...</Text>
        </View>
      );
    }
    
    if (photo) {
      return (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          >
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={() => setPhoto(null)}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      );
    }
    
    return (
      <View style={styles.placeholderContainer}>
        <Ionicons name="image-outline" size={80} color="#ccc" />
        <Text style={styles.placeholderText}>Take a photo of food product</Text>
        <Text style={styles.placeholderSubtext}>We'll analyze ingredients and suggest alternatives</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Food Scanner</Text>
        <Text style={styles.subtitle}>Analyze food products for healthier choices</Text>
      </View>
      
      <View style={styles.photoArea}>
        {renderPhotoContainer()}
      </View>
      
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={() => handleTakePhoto()}
            activeOpacity={0.9}
            disabled={isUploading || uploadComplete}
          >
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.buttonGradient}
            >
              <Ionicons name="camera" size={28} color="#fff" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.button, styles.galleryButton]}
            onPress={() => handleChoosePhoto()}
            activeOpacity={0.9}
            disabled={isUploading || uploadComplete}
          >
            <LinearGradient
              colors={['#00c6ff', '#0072ff']}
              style={styles.buttonGradient}
            >
              <MaterialIcons name="photo-library" size={26} color="#fff" />
              <Text style={styles.buttonText}>Choose Photo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#303f9f',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  photoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    padding: 20,
  },
  placeholderText: {
    marginTop: 20,
    fontSize: 18,
    color: '#ccc',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholderSubtext: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  photoContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 15,
    paddingBottom: 15,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  retakeText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
  uploadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
  },
  uploadingText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#303f9f',
    fontWeight: 'bold',
  },
  uploadingSubtext: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#303030',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#303f9f',
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 10,
  },
  successSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f44336',
    marginTop: 10,
  },
  errorSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  buttonWrapper: {
    width: '45%',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  }
});

export default PhotoUpload;