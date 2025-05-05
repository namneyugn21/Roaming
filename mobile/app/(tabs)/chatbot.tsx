import React, { useEffect } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import { getAIResponse } from "@/services/chatbot";
import * as Animatable from "react-native-animatable";
import Markdown from "react-native-markdown-display";
import { useFocusEffect } from "expo-router";

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
  
    const aiResponse = await getAIResponse(input);
    if (aiResponse) {
      const aiMessage = { role: "ai", text: String(aiResponse).trim() };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    } else {
      Alert.alert("Error", "Failed to get a response from the AI.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setInput("");
    }, [])
  )
  
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
          ref={(ref) => {
          if (ref) {
            ref.scrollToEnd({ animated: true });
          }
          }}
        >
          {/* AI Chatbot Section */}
          <View style={{ marginTop: 10 }}>
            {messages.map((msg, index) => (
              <Animatable.View
                key={index}
                animation={"fadeIn"}
                duration={400}
                style={[
                  styles.messageBubble,
                  msg.role === "user" ? styles.userBubble : styles.aiBubble
                ]}
              >
                <Markdown style={{
                  body: styles.messageText,
                }}>{msg.text}</Markdown>
              </Animatable.View>
            ))}

            {isTyping && (
              <Animatable.View
                animation="fadeIn"
                iterationCount="infinite"
                direction="alternate"
                style={[styles.messageBubble, styles.aiBubble]}
              >
                <Text
                  style={{ 
                    fontSize: 15, 
                    color: theme.secondary, 
                    fontStyle: "italic",
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                  }}
                >
                  I am thinking...
                </Text>
              </Animatable.View>
            )}
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
            <Animatable.View animation={"bounceIn"} duration={500}>
              <Ionicons name="send" size={24} color={theme.secondary} />
            </Animatable.View>
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
    lineHeight: 20,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: theme.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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