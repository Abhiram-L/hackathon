import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Platform,
  StatusBar 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  interpolate,
  runOnJS,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  SlideInDown
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const PhotoUpload = () => {
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  // Animation values
  const buttonScale = useSharedValue(1);
  const imageOpacity = useSharedValue(0);
  const uploadProgress = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  
  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
      transform: [
        { scale: interpolate(imageOpacity.value, [0, 1], [0.8, 1]) }
      ]
    };
  });
  
  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${uploadProgress.value * 100}%`,
    };
  });
  
  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkmarkScale.value }],
      opacity: checkmarkScale.value,
    };
  });
  
  const onButtonPress = (button) => {
    // Button press animation
    buttonScale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 15 });
    }, 100);
    
    if (button === 'camera') {
      handleTakePhoto();
    } else {
      handleChoosePhoto();
    }
  };
  
  const simulateUpload = () => {
    setIsUploading(true);
    
    // Reset progress
    uploadProgress.value = 0;
    
    // Animate progress
    uploadProgress.value = withTiming(1, { duration: 2000 }, (finished) => {
      if (finished) {
        runOnJS(setIsUploading)(false);
        runOnJS(setUploadComplete)(true);
        
        // Animate checkmark
        checkmarkScale.value = withSpring(1, { damping: 10 });
        
        // Reset after some time
        setTimeout(() => {
          checkmarkScale.value = withTiming(0, { duration: 300 });
          setTimeout(() => {
            runOnJS(setUploadComplete)(false);
          }, 300);
        }, 2000);
      }
    });
  };

  const handleImageSelected = (result) => {
    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setPhoto(selectedUri);
      
      // Animate image appearance
      imageOpacity.value = withTiming(1, { duration: 800 });
      
      // Simulate upload process
      setTimeout(() => {
        simulateUpload();
      }, 500);
    }
  };

  const handleChoosePhoto = async () => {
    // Request permissions for accessing the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access the photo library is required!');
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
      alert('Permission to access the camera is required!');
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
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={styles.uploadingContainer}
        >
          <Text style={styles.uploadingText}>Uploading photo...</Text>
          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
          </View>
        </Animated.View>
      );
    }
    
    if (uploadComplete) {
      return (
        <Animated.View 
          entering={ZoomIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.successContainer}
        >
          <Animated.View style={[styles.successCircle, checkmarkAnimatedStyle]}>
            <Ionicons name="checkmark-sharp" size={60} color="#fff" />
          </Animated.View>
          <Text style={styles.successText}>Upload Complete!</Text>
        </Animated.View>
      );
    }
    
    if (photo) {
      return (
        <Animated.View style={[styles.photoContainer, imageAnimatedStyle]}>
          <Image source={{ uri: photo }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          >
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={() => {
                imageOpacity.value = withTiming(0, { duration: 300 });
                setTimeout(() => setPhoto(null), 300);
              }}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      );
    }
    
    return (
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.placeholderContainer}
      >
        <Ionicons name="image-outline" size={80} color="#ccc" />
        <Text style={styles.placeholderText}>No photo selected</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View 
        entering={SlideInDown.delay(300).springify()}
        style={styles.header}
      >
        <Text style={styles.title}>Photo Upload</Text>
        <Text style={styles.subtitle}>Take or choose a photo</Text>
      </Animated.View>
      
      <View style={styles.photoArea}>
        {renderPhotoContainer()}
      </View>
      
      <View style={styles.buttonsContainer}>
        <Animated.View style={[buttonAnimatedStyle, styles.buttonWrapper]}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={() => onButtonPress('camera')}
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
        </Animated.View>
        
        <Animated.View style={[buttonAnimatedStyle, styles.buttonWrapper]}>
          <TouchableOpacity
            style={[styles.button, styles.galleryButton]}
            onPress={() => onButtonPress('gallery')}
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
        </Animated.View>
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
    backgroundColor: '#f0f0f0',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
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
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
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