import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/auth';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeOutDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const AboutUsScreen = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('Fitness Tracking');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const { user } = useAuthStore();
  const router = useRouter();
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  const buttonScale = useSharedValue(1);
  
  // Animate header on mount
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 1000 });
    cardScale.value = withSpring(1);
  }, []);
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ scale: cardScale.value }],
    };
  });

  const submitButtonAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const pressInAnimation = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };
  
  const pressOutAnimation = () => {
    buttonScale.value = withSpring(1);
  };

  const toggleSelection = (item, selection, setSelection) => {
    if (selection.includes(item)) {
      setSelection(selection.filter((i) => i !== item));
    } else {
      setSelection([...selection, item]);
    }
  };

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleSubmit = async () => {
    // Basic Validation
    if (!age || !gender || !height) {
      Alert.alert('Error', 'Please fill out all personal information fields.');
      return;
    }
    if (isNaN(age) || age <= 0) {
      Alert.alert('Error', 'Please enter a valid age.');
      return;
    }

    // Prepare Payload
    const payload = {
      personalInfo: { age, gender, height },
      purpose: selectedPurpose,
      allergies: selectedAllergies,
      diseases: selectedDiseases,
      healthGoals: selectedGoals,
    };

    // Make API Call
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Show success animation
        setIsLoading(false);
        // Navigate after animation
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to save your preferences. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving your preferences.');
      setIsLoading(false);
    }
  };

  const renderSectionIndicator = () => {
    return (
      <Animated.View 
        entering={FadeInDown.delay(200).duration(500)}
        style={styles.progressIndicator}
      >
        <View style={styles.progressSteps}>
          <View style={[styles.progressStep, activeSection === 'personal' && styles.activeStep]}>
            <Ionicons 
              name="person-outline" 
              size={18} 
              color={activeSection === 'personal' ? '#fff' : '#999'} 
            />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.progressStep, activeSection === 'purpose' && styles.activeStep]}>
            <Ionicons 
              name="compass-outline" 
              size={18} 
              color={activeSection === 'purpose' ? '#fff' : '#999'} 
            />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.progressStep, activeSection === 'health' && styles.activeStep]}>
            <Ionicons 
              name="medkit-outline" 
              size={18} 
              color={activeSection === 'health' ? '#fff' : '#999'} 
            />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.progressStep, activeSection === 'goals' && styles.activeStep]}>
            <Ionicons 
              name="trophy-outline" 
              size={18} 
              color={activeSection === 'goals' ? '#fff' : '#999'} 
            />
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderPersonalInfo = () => {
    return (
      <Animated.View 
        entering={FadeInUp.delay(300).duration(500)}
        exiting={FadeOutDown.duration(300)}
        style={styles.sectionContainer}
      >
        <View style={styles.inputContainer}>
          <MaterialIcons name="cake" size={20} color="#6366F1" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            placeholderTextColor="#aaa"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="#6366F1" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            placeholderTextColor="#aaa"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <MaterialIcons name="height" size={20} color="#6366F1" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Height (in cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
            placeholderTextColor="#aaa"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => setActiveSection('purpose')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderPurpose = () => {
    return (
      <Animated.View 
        entering={FadeInUp.delay(300).duration(500)}
        exiting={FadeOutDown.duration(300)}
        style={styles.sectionContainer}
      >
        <Text style={styles.sectionHeader}>
          <Ionicons name="compass" size={20} color="#6366F1" /> Purpose
        </Text>
        <View style={styles.optionsContainer}>
          {[
            { value: 'Fitness Tracking', icon: 'fitness-center' },
            { value: 'Health Monitoring', icon: 'monitor-heart' },
            { value: 'Weight Management', icon: 'monitor-weight' }
          ].map((item, index) => (
            <Animated.View 
              key={index}
              entering={FadeInDown.delay(300 + index * 100).duration(400)}
            >
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  item.value === selectedPurpose && styles.selectedOptionCard
                ]}
                onPress={() => setSelectedPurpose(item.value)}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name={item.icon} 
                  size={24} 
                  color={item.value === selectedPurpose ? '#fff' : '#6366F1'} 
                />
                <Text style={[
                  styles.optionText,
                  item.value === selectedPurpose && styles.selectedOptionText
                ]}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setActiveSection('personal')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => setActiveSection('health')}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderHealthInfo = () => {
    return (
      <Animated.View 
        entering={FadeInUp.delay(300).duration(500)}
        exiting={FadeOutDown.duration(300)}
        style={styles.sectionContainer}
      >
        <Text style={styles.sectionHeader}>
          <Ionicons name="medkit" size={20} color="#6366F1" /> Health Information
        </Text>
        
        <Text style={styles.subSectionHeader}>Allergies</Text>
        <View style={styles.chipsContainer}>
          {['Nuts', 'Dairy', 'Gluten'].map((item, index) => (
            <Animated.View 
              key={index}
              entering={FadeInDown.delay(300 + index * 100).duration(400)}
            >
              <TouchableOpacity
                style={[
                  styles.chip,
                  selectedAllergies.includes(item) && styles.selectedChip
                ]}
                onPress={() => toggleSelection(item, selectedAllergies, setSelectedAllergies)}
                activeOpacity={0.7}
              >
                <FontAwesome5 
                  name="allergies" 
                  size={16} 
                  color={selectedAllergies.includes(item) ? '#fff' : '#6366F1'} 
                  style={styles.chipIcon}
                />
                <Text style={[
                  styles.chipText,
                  selectedAllergies.includes(item) && styles.selectedChipText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.subSectionHeader}>Medical Conditions</Text>
        <View style={styles.chipsContainer}>
          {[
            { value: 'Diabetes', icon: 'syringe' },
            { value: 'Hypertension', icon: 'heartbeat' },
            { value: 'Asthma', icon: 'lungs' }
          ].map((item, index) => (
            <Animated.View 
              key={index}
              entering={FadeInDown.delay(400 + index * 100).duration(400)}
            >
              <TouchableOpacity
                style={[
                  styles.chip,
                  selectedDiseases.includes(item.value) && styles.selectedChip
                ]}
                onPress={() => toggleSelection(item.value, selectedDiseases, setSelectedDiseases)}
                activeOpacity={0.7}
              >
                <FontAwesome5 
                  name={item.icon} 
                  size={16} 
                  color={selectedDiseases.includes(item.value) ? '#fff' : '#6366F1'} 
                  style={styles.chipIcon}
                />
                <Text style={[
                  styles.chipText,
                  selectedDiseases.includes(item.value) && styles.selectedChipText
                ]}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setActiveSection('purpose')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => setActiveSection('goals')}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderGoals = () => {
    return (
      <Animated.View 
        entering={FadeInUp.delay(300).duration(500)}
        exiting={FadeOutDown.duration(300)}
        style={styles.sectionContainer}
      >
        <Text style={styles.sectionHeader}>
          <Ionicons name="trophy" size={20} color="#6366F1" /> Health Goals
        </Text>
        
        <View style={styles.goalsContainer}>
          {[
            { value: 'Gain Weight', icon: 'weight' },
            { value: 'Lose Weight', icon: 'dumbbell' },
            { value: 'Improve Stamina', icon: 'running' }
          ].map((item, index) => (
            <Animated.View 
              key={index}
              entering={FadeInDown.delay(300 + index * 100).duration(400)}
              style={styles.goalCardContainer}
            >
              <TouchableOpacity
                style={[
                  styles.goalCard,
                  selectedGoals.includes(item.value) && styles.selectedGoalCard
                ]}
                onPress={() => toggleSelection(item.value, selectedGoals, setSelectedGoals)}
                activeOpacity={0.7}
              >
                <FontAwesome5 
                  name={item.icon} 
                  size={24} 
                  color={selectedGoals.includes(item.value) ? '#fff' : '#6366F1'} 
                />
                <Text style={[
                  styles.goalCardText,
                  selectedGoals.includes(item.value) && styles.selectedGoalCardText
                ]}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setActiveSection('health')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <Animated.View style={[styles.submitButtonWrapper, submitButtonAnimStyle]}>
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={isLoading}
              onPressIn={pressInAnimation}
              onPressOut={pressOutAnimation}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Save Profile</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.headerBackButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Tell Us About Yourself</Text>
          <Text style={styles.subtitle}>Help us personalize your experience</Text>
        </View>
      </Animated.View>

      {renderSectionIndicator()}
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {activeSection === 'personal' && renderPersonalInfo()}
        {activeSection === 'purpose' && renderPurpose()}
        {activeSection === 'health' && renderHealthInfo()}
        {activeSection === 'goals' && renderGoals()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#1A1A1A',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  headerBackButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerContent: {
    marginLeft: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  progressIndicator: {
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3A3A3A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  activeStep: {
    backgroundColor: '#6366F1',
    borderColor: '#8183ff',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  progressLine: {
    flex: 1,
    height: 4,
    backgroundColor: '#2C2C2C',
    marginHorizontal: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 18,
    marginTop: 5,
  },
  subSectionHeader: {
    fontSize: 18,
    color: '#ddd',
    marginTop: 18,
    marginBottom: 12,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 16,
    marginBottom: 18,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  optionsContainer: {
    marginVertical: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedOptionCard: {
    backgroundColor: '#6366F1',
    borderColor: '#8183ff',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 14,
    color: '#ddd',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedChip: {
    backgroundColor: '#6366F1',
    borderColor: '#8183ff',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  chipIcon: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 15,
    color: '#ddd',
    fontWeight: '400',
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: '500',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  goalCardContainer: {
    width: width < 350 ? '100%' : '48%',  // Responsive width based on screen size
    marginBottom: 18,
  },
  goalCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    height: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedGoalCard: {
    backgroundColor: '#6366F1',
    borderColor: '#8183ff',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  goalCardText: {
    marginTop: 15,
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedGoalCardText: {
    color: '#fff',
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 22,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  submitButtonWrapper: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 10,
  },
});

export default AboutUsScreen;