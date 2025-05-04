import React, { useEffect } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, FlatList, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";

export default function CreateScreen() {
  const [messages, setMessages] = React.useState([
    { role: "ai", text: "Hey there! How can I help you?" },
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
  
    // Simulate AI response (replace with Gemini or your backend)
    setTimeout(() => {
      const aiResponse = { role: "ai", text: "Here’s what I found! ✨" };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: "flex-end" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* AI Chatbot Section */}
          <View style={{ marginTop: 30 }}>
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.role === "user" ? styles.userBubble : styles.aiBubble
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}

            {isTyping && <Text style={{ fontStyle: "italic", color: theme.textColor, marginTop: 5, marginLeft: 20, fontSize: 15 }}>AI is typing...</Text>}
          </View>
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ask the AI something..."
            style={styles.chatInput}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            placeholderTextColor={theme.secondary}
            autoFocus={true}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={24} color={theme.secondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  messageText: {
    color: theme.secondary,
    fontSize: 15,
  },
  postButton: {
    backgroundColor: theme.accent,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  postButtonActive: {
    backgroundColor: theme.secondary,
  },
  postButtonText: {
    color: theme.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImageContainer: {
    flexDirection: "row",
    height: 250,
    marginTop: 10,
  },
  previewImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.accent,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: theme.primary,
    alignSelf: "flex-end",
    marginRight: 15,
  },
  aiBubble: {
    backgroundColor: theme.accent,
    alignSelf: "flex-start",
    marginLeft: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: theme.accent,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 15,
  },
  chatInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: theme.secondary,
  },  
});
