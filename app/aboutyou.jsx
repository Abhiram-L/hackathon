import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

const AboutUsScreen = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('Fitness Tracking');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [otherAllergy, setOtherAllergy] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedDietaryPreference, setSelectedDietaryPreference] = useState('');

  const toggleSelection = (item, selection, setSelection) => {
    if (selection.includes(item)) {
      setSelection(selection.filter(i => i !== item));
    } else {
      setSelection([...selection, item]);
    }
  };

  const handleSubmit = async () => {
    if (!age || !gender || !height) {
      Alert.alert('Error', 'Please fill out all personal information fields.');
      return;
    }

    const payload = {
      personalInfo: {
        age,
        gender,
        height,
      },
      purpose: selectedPurpose,
      allergies: [...selectedAllergies, otherAllergy].filter(Boolean), // Include otherAllergy if not empty
      diseases: selectedDiseases,
      healthGoals: selectedGoals,
      dietaryPreference: selectedDietaryPreference,
    };

    try {
      const response = await fetch('https://example.com/api/saveUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your information has been saved successfully!');
      } else {
        Alert.alert('Error', 'Failed to save your information. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving your information.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>About Us</Text>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Gender"
          value={gender}
          onChangeText={setGender}
        />

        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Height in cm"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
      </View>

      {/* Purpose of Using App */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Purpose of Using Our App</Text>
        {['Fitness Tracking', 'Health Monitoring', 'Diet/Nutrition Planning', 'Weight Management', 'Medical Condition Management', 'Physical Activity Motivation', 'Research Purposes'].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={item === selectedPurpose ? styles.selectedButton : styles.button}
            onPress={() => setSelectedPurpose(item)}
          >
            <Text style={item === selectedPurpose ? styles.buttonText : null}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Allergies */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Allergies</Text>
        {['Nuts', 'Dairy', 'Gluten', 'Seafood', 'Pollen', 'Latex', 'No known allergies'].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={selectedAllergies.includes(item) ? styles.selectedButton : styles.button}
            onPress={() => toggleSelection(item, selectedAllergies, setSelectedAllergies)}
          >
            <Text style={selectedAllergies.includes(item) ? styles.buttonText : null}>{item}</Text>
          </TouchableOpacity>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Allergies (Other)"
          value={otherAllergy}
          onChangeText={setOtherAllergy}
        />
      </View>

      {/* Diseases */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Diseases</Text>
        {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid Disorder', 'None'].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={selectedDiseases.includes(item) ? styles.selectedButton : styles.button}
            onPress={() => toggleSelection(item, selectedDiseases, setSelectedDiseases)}
          >
            <Text style={selectedDiseases.includes(item) ? styles.buttonText : null}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Health Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Health Goals</Text>
        {['Gain Weight', 'Maintain Weight', 'Weight loss', 'Improve Muscle Tone', 'Increase Stamina', 'Improve Health'].map((goal, index) => (
          <TouchableOpacity
            key={index}
            style={selectedGoals.includes(goal) ? styles.selectedButton : styles.button}
            onPress={() => toggleSelection(goal, selectedGoals, setSelectedGoals)}
          >
            <Text style={selectedGoals.includes(goal) ? styles.buttonText : null}>{goal}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dietary Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Dietary Preferences</Text>
        {['Vegetarian', 'Vegan', 'Pescatarian', 'Omnivore', 'Keto', 'Paleo', 'None'].map((pref, index) => (
          <TouchableOpacity
            key={index}
            style={pref === selectedDietaryPreference ? styles.selectedButton : styles.button}
            onPress={() => setSelectedDietaryPreference(pref)}
          >
            <Text style={pref === selectedDietaryPreference ? styles.buttonText : null}>{pref}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  label: {
    fontWeight: '500',
    marginTop: 8
  },
  text: {
    marginBottom: 4
  },
  button: {
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 4
  },
  selectedButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FF7F50',
    marginVertical: 4
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 8,
    borderRadius: 8
  },
  submitButton: {
    backgroundColor: '#FF7F50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default AboutUsScreen;