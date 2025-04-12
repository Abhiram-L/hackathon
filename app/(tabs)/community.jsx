// CommunityScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Simulated user-uploaded blog post
const communityPosts = [
  {
    id: 1,
    author: 'Aarohi Jain',
    time: '14 hours ago',
    category: 'Nutrition',
    title: 'Must-Try Superfoods to Elevate Your Nutrition Game!',
    content: [
      '🥑 Did you know that avocados contain more potassium than bananas? 🍌 One medium avocado has about 485 mg of potassium, while a medium banana has around 422 mg.',
      '🌱 Chia seeds are an excellent source of omega-3 fatty acids. Just 2 tablespoons of chia seeds contain around 4.9 grams of these healthy fats.',
      '♦️ Dark chocolate is rich in antioxidants. 💪 One ounce of dark chocolate (70–85% cocoa) contains more than 50% of the daily recommended intake.'
    ]
  },
  {
    id: 2,
    author: 'Ravi Sharma',
    time: '1 day ago',
    category: 'Fitness',
    title: '3 Simple Ways to Boost Your Daily Step Count',
    content: [
      '🚶‍♂️ Take short walking breaks every hour while working.',
      '🧹 Do household chores actively — sweeping and cleaning can add steps!',
      '🗺️ Park your car farther from entrances to walk more without effort.'
    ]
  },
  {
    id: 1,
    author: 'Aarohi Jain',
    time: '14 hours ago',
    category: 'Nutrition',
    title: 'Must-Try Superfoods to Elevate Your Nutrition Game!',
    content: [
      '🥑 Did you know that avocados contain more potassium than bananas? 🍌 One medium avocado has about 485 mg of potassium, while a medium banana has around 422 mg.',
      '🌱 Chia seeds are an excellent source of omega-3 fatty acids. Just 2 tablespoons of chia seeds contain around 4.9 grams of these healthy fats.',
      '♦️ Dark chocolate is rich in antioxidants. 💪 One ounce of dark chocolate (70–85% cocoa) contains more than 50% of the daily recommended intake.'
    ]
  },
  {
    id: 1,
    author: 'Aarohi Jain',
    time: '14 hours ago',
    category: 'Nutrition',
    title: 'Must-Try Superfoods to Elevate Your Nutrition Game!',
    content: [
      '🥑 Did you know that avocados contain more potassium than bananas? 🍌 One medium avocado has about 485 mg of potassium, while a medium banana has around 422 mg.',
      '🌱 Chia seeds are an excellent source of omega-3 fatty acids. Just 2 tablespoons of chia seeds contain around 4.9 grams of these healthy fats.',
      '♦️ Dark chocolate is rich in antioxidants. 💪 One ounce of dark chocolate (70–85% cocoa) contains more than 50% of the daily recommended intake.'
    ]
  },
  {
    id: 1,
    author: 'Aarohi Jain',
    time: '14 hours ago',
    category: 'Nutrition',
    title: 'Must-Try Superfoods to Elevate Your Nutrition Game!',
    content: [
      '🥑 Did you know that avocados contain more potassium than bananas? 🍌 One medium avocado has about 485 mg of potassium, while a medium banana has around 422 mg.',
      '🌱 Chia seeds are an excellent source of omega-3 fatty acids. Just 2 tablespoons of chia seeds contain around 4.9 grams of these healthy fats.',
      '♦️ Dark chocolate is rich in antioxidants. 💪 One ounce of dark chocolate (70–85% cocoa) contains more than 50% of the daily recommended intake.'
    ]
  }
];

const CommunityScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {communityPosts.map((post) => (
        <View key={post.id} style={styles.card}>
          <Text style={styles.category}>📌 {post.category}</Text>
          <Text style={styles.meta}>By {post.author} • {post.time}</Text>
          <Text style={styles.title}>{post.title}</Text>

          {post.content.map((para, index) => (
            <Text key={index} style={styles.text}>{para}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16
  },
  card: {
    backgroundColor: '#fef6f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2
  },
  category: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#d46a6a',
    marginBottom: 4
  },
  meta: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20
  }
});

export default CommunityScreen;
