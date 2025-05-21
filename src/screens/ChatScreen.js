import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const messages = [
  { id: '1', sender: 'Gokul', text: 'Hey there!' },
  { id: '2', sender: 'Karthik', text: 'Hi, how are you?' },
];

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.sender === 'Karthik' ? styles.myMessage : styles.theirMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput placeholder="Type a message..." style={styles.input} />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1A73E8',
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#2A2A2A',
    borderTopWidth: 1,
    backgroundColor: '#1E1E1E',
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 25,
    paddingHorizontal: 15,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#1A73E8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
  },
});
