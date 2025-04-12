import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

export default function ChatBotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to the chat
    const userMessage = { text: input, isBot: false };
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

      // Add the bot's reply to the chat
      const botReply = { text: data.botReply, isBot: true };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Display an error message if the fetch call fails
      const errorMessage = { text: "Failed to get a response. Please try again later.", isBot: true };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput(""); // Clear the input field
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingVertical: 10 }}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.isBot ? styles.botBubble : styles.userBubble,
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
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    maxWidth: "75%",
    alignSelf: "flex-start",
  },
  botBubble: {
    backgroundColor: "#d1e7dd",
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#0d6efd",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#fff",
  },
  botText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#0d6efd",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});