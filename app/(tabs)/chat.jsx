import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Keyboard,
  Dimensions,
  Platform
} from "react-native";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  SlideInRight,
  SlideInLeft,
  FadeIn,
  ZoomIn,
  interpolateColor
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ChatBotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef();
  const inputRef = useRef();
  
  // Animation values
  const sendButtonScale = useSharedValue(1);
  const inputAreaHeight = useSharedValue(60);
  const loadingOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
    
    // Show typing indicator for bot messages
    if (messages.length > 0 && messages[messages.length - 1].isBot === false) {
      setIsTyping(true);
      loadingOpacity.value = withTiming(1, { duration: 300 });
      
      // Simulate bot typing delay
      setTimeout(() => {
        setIsTyping(false);
        loadingOpacity.value = withTiming(0, { duration: 300 });
      }, 1000);
    }
  }, [messages]);

  // Animated styles
  const sendButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: sendButtonScale.value }],
    };
  });
  
  const inputAreaAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: inputAreaHeight.value,
    };
  });
  
  const loadingAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: loadingOpacity.value,
    };
  });
  
  // Button press animation
  const onPressIn = () => {
    sendButtonScale.value = withSpring(0.9);
  };
  
  const onPressOut = () => {
    sendButtonScale.value = withSpring(1);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to the chat
    const userMessage = { text: input, isBot: false, timestamp: new Date().toISOString() };
    setMessages([...messages, userMessage]);

    try {
      // Make a fetch call to the backend
      const response = await fetch("http://localhost:3000/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Add the bot's reply to the chat after a short delay to simulate typing
      setTimeout(() => {
        const botReply = { text: data.botReply, isBot: true, timestamp: new Date().toISOString() };
        setMessages((prevMessages) => [...prevMessages, botReply]);
      }, 1500);
      
    } catch (error) {
      console.error("Error sending message:", error);

      // Display an error message if the fetch call fails
      setTimeout(() => {
        const errorMessage = { 
          text: "Failed to get a response. Please try again later.", 
          isBot: true, 
          isError: true,
          timestamp: new Date().toISOString() 
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }, 1000);
    }

    setInput(""); // Clear the input field
  };
  
  const renderBubble = (message, index) => {
    const isLastMessage = index === messages.length - 1;
    
    return (
      <Animated.View
        key={index}
        entering={message.isBot ? SlideInLeft.delay(200).springify() : SlideInRight.springify()}
        style={[
          styles.messageBubbleContainer,
          { alignSelf: message.isBot ? "flex-start" : "flex-end" }
        ]}
      >
        {message.isBot && (
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={message.isError ? ['#ff4d4d', '#cc0000'] : ['#7597de', '#4c669f']}
              style={styles.avatar}
            >
              <Ionicons name={message.isError ? "alert" : "chatbubble-ellipses"} size={14} color="#fff" />
            </LinearGradient>
          </View>
        )}
        
        <View
          style={[
            styles.messageBubble,
            message.isBot 
              ? message.isError 
                ? styles.errorBubble 
                : styles.botBubble 
              : styles.userBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.isBot ? styles.botText : styles.userText,
            ]}
          >
            {message.text}
          </Text>
          
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        {!message.isBot && isLastMessage && (
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#6366F1', '#8183ff']}
              style={styles.avatar}
            >
              <Ionicons name="person" size={14} color="#fff" />
            </LinearGradient>
          </View>
        )}
      </Animated.View>
    );
  };
  
  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <Animated.View
        style={[styles.typingContainer, loadingAnimatedStyle]}
      >
        <View style={styles.typingBubble}>
          <View style={styles.typingDot} />
          <View style={[styles.typingDot, styles.typingDotMiddle]} />
          <View style={styles.typingDot} />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeIn.delay(300).duration(500)}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <Text style={styles.headerSubtitle}>Ask me anything</Text>
      </Animated.View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesList}
      >
        <Animated.View 
          entering={ZoomIn.delay(500).duration(800)}
          style={styles.welcomeContainer}
        >
          <LinearGradient 
            colors={['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)']}
            style={styles.welcomeGradient}
          >
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeText}>
              How can I help you today? Feel free to ask me any questions.
            </Text>
          </LinearGradient>
        </Animated.View>
        
        {messages.map(renderBubble)}
        
        {renderTypingIndicator()}
      </ScrollView>
      
      <Animated.View style={[styles.inputContainer, inputAreaAnimatedStyle]}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
          onFocus={() => {
            inputAreaHeight.value = withTiming(Platform.OS === 'ios' ? 80 : 70);
          }}
          onBlur={() => {
            inputAreaHeight.value = withTiming(60);
          }}
        />
        <Animated.View style={sendButtonAnimatedStyle}>
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={sendMessage}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366F1', '#4338CA']}
              style={styles.sendButtonGradient}
            >
              <MaterialIcons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  welcomeContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  welcomeGradient: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#CCC',
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '80%',
  },
  avatarContainer: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 8,
    maxWidth: '90%',
  },
  botBubble: {
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: "#3A1A1A",
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#6366F1",
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#eee",
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderColor: "#2A2A2A",
  },
  textInput: {
    flex: 1,
    height: 45,
    backgroundColor: "#2A2A2A",
    borderRadius: 22,
    paddingHorizontal: 15,
    color: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  sendButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  typingContainer: {
    padding: 10,
    marginLeft: 36,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginHorizontal: 4,
    opacity: 0.6,
    transform: [{ scale: 1 }],
    animationName: 'typingAnimation',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
  },
  typingDotMiddle: {
    animationDelay: '0.2s',
    opacity: 0.8,
  },
});