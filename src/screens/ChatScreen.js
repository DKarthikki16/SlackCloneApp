import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { usePreferences } from '../context/PreferencesContext';

const currentUser = {
  id: '1',
  name: 'Karthik',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
};

const initialMessages = {
  'channel:1': [
    {
      id: '1',
      text: 'Hey there!',
      createdAt: new Date(Date.now() - 3600000),
      user: {
        _id: '2',
        name: 'Gokul',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
    },
    {
      id: '2',
      text: 'Hi, how are you?',
      createdAt: new Date(Date.now() - 1800000),
      user: currentUser,
    },
    {
      id: '3',
      text: 'Welcome to #general channel!',
      createdAt: new Date(),
      user: {
        _id: 'system',
        name: 'System',
        avatar: 'https://cdn-icons-png.flaticon.com/512/124/124558.png',
      },
    },
  ],
  'dm:u1': [
    {
      id: '1',
      text: `Hey ${currentUser.name}!`,
      createdAt: new Date(Date.now() - 3600000),
      user: {
        id: 'u1',
        name: 'Gokul',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
    },
    {
      id: '2',
      text: 'Hi, how are you?',
      createdAt: new Date(Date.now() - 1800000),
      user: currentUser,
    },
  ],
};

// Dummy DM user list – customize as needed
const dmUserList = [
  { id: 'u1', name: 'Gokul', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 'u2', name: 'Priya', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 'u3', name: 'Alex', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

export default function ChatScreen({ route, navigation }) {
  const { underlineLinks, showTypingIndicators, raiseHand, compactMode } = usePreferences();
  let channel = route?.params?.channel;
  let dmUser = route?.params?.dmUser;
  const isDM = !!dmUser;
  const { theme } = useTheme();

  // State for Huddle modal
  const [huddleModalVisible, setHuddleModalVisible] = useState(false);

  // When no channel or DM is provided, show DM list first
  if (!channel && !dmUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerText, { color: theme.text, textAlign: 'center', marginVertical: 16 }]}>
          Direct Messages
        </Text>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {dmUserList.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.dmListItem}
              onPress={() => navigation.navigate('Chat', { dmUser: item })}
            >
              <Image source={{ uri: item.avatar }} style={styles.dmListAvatar} />
              <Text style={[styles.dmListName, { color: theme.text }]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const chatKey = isDM ? `dm:${dmUser.id}` : `channel:${channel?.id}`;
  const [allMessages, setAllMessages] = useState(initialMessages);
  const messages = allMessages[chatKey] || [];
  const [newMessage, setNewMessage] = useState('');
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const flatListRef = useRef();

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const messageData = {
      id: Date.now().toString(),
      text: newMessage,
      createdAt: new Date(),
      user: currentUser,
    };
    setAllMessages(prev => ({
      ...prev,
      [chatKey]: [messageData, ...(prev[chatKey] || [])],
    }));
    setNewMessage('');
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.user.id === currentUser.id || item.user._id === currentUser.id;
    return (
      <View style={[
        styles.messageWrapper,
        isCurrentUser ? styles.messageRight : styles.messageLeft,
        compactMode && { marginBottom: 8 }
      ]}>
        {!isCurrentUser && (
          <Image
            source={{ uri: item.user.avatar }}
            style={[
              styles.avatar,
              compactMode && { width: 24, height: 24, borderRadius: 12, marginRight: 6, marginTop: 2 }
            ]}
          />
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser
            ? { backgroundColor: theme.accent, borderTopRightRadius: 0 }
            : { backgroundColor: theme.card, borderTopLeftRadius: 0 },
          compactMode && { padding: 6, borderRadius: 10, maxWidth: '85%' }
        ]}>
          {!isCurrentUser && (
            <Text style={[
              styles.senderName,
              { color: theme.secondaryText },
              compactMode && { fontSize: 10 }
            ]}>
              {item.user.name}
            </Text>
          )}
          <Text style={[
            styles.messageText,
            { color: theme.text },
            compactMode && { fontSize: 13 }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            { color: theme.secondaryText },
            compactMode && { fontSize: 9 }
          ]}>
            {item.createdAt && new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  // Huddle modal handlers
  const handleShareVideos = () => {
    setHuddleModalVisible(false);
    alert('Share your videos clicked!');
  };
  const handleAddReactions = () => {
    setHuddleModalVisible(false);
    alert('Add reactions & stickers clicked!');
  };
  const handleKeepTrackNotes = () => {
    setHuddleModalVisible(false);
    alert('Keep track of notes in threads clicked!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        {!isDM ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[styles.headerText, { color: theme.text }]}>
              #{channel?.name || 'general'}
            </Text>
            <TouchableOpacity onPress={() => setHuddleModalVisible(true)} style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 20 }}>🎧</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: dmUser.avatar }} style={styles.dmHeaderAvatar} />
            <Text style={[styles.headerText, { color: theme.text }]}>{dmUser.name}</Text>
          </View>
        )}
        <View style={{ width: 24 }} />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Typing Indicator Hook – if enabled via preferences */}
      {showTypingIndicators && (
        <Text style={{ color: 'gray', margin: 8 }}>Someone is typing...</Text>
      )}

      {/* Input and Action Modal */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setActionModalVisible(true)}>
            <Ionicons name="add" size={24} color={theme.accent} />
          </TouchableOpacity>
          <TextInput
            style={[styles.textInput, { backgroundColor: theme.input, color: theme.text }]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={isDM ? `Message ${dmUser.name}` : `Message #${channel?.name || 'general'}`}
            placeholderTextColor={theme.placeholder}
            multiline
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={22} color={newMessage.trim() ? theme.accent : theme.secondaryText} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }}
          onPress={() => setActionModalVisible(false)}>
          <View style={{
            backgroundColor: theme.card,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: 24,
            alignItems: 'center',
          }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}
              onPress={() => {
                setActionModalVisible(false);
                alert('Attach photos and videos clicked!');
              }}>
              <Ionicons name="images-outline" size={24} color={theme.accent} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.text, fontSize: 16 }}>Attach photos and videos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}
              onPress={() => {
                setActionModalVisible(false);
                alert('Record an audio clicked!');
              }}>
              <Ionicons name="mic-outline" size={24} color={theme.accent} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.text, fontSize: 16 }}>Record an audio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}
              onPress={() => {
                setActionModalVisible(false);
                alert('Record a video clicked!');
              }}>
              <Ionicons name="videocam-outline" size={24} color={theme.accent} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.text, fontSize: 16 }}>Record a video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
              onPress={() => {
                setActionModalVisible(false);
                alert('Upload a file clicked!');
              }}>
              <Ionicons name="document-outline" size={24} color={theme.accent} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.text, fontSize: 16 }}>Upload a file</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 16 }} onPress={() => setActionModalVisible(false)}>
              <Text style={{ color: theme.secondaryText, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Huddle Modal */}
      <Modal
        visible={huddleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setHuddleModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setHuddleModalVisible(false)}>
          <View style={[styles.huddleModalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Huddle Options</Text>
            <TouchableOpacity style={styles.huddleOption} onPress={handleShareVideos}>
              <Text style={[styles.huddleOptionText, { color: theme.text }]}>Share your videos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.huddleOption} onPress={handleAddReactions}>
              <Text style={[styles.huddleOptionText, { color: theme.text }]}>Add reactions & stickers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.huddleOption} onPress={handleKeepTrackNotes}>
              <Text style={[styles.huddleOptionText, { color: theme.text }]}>Keep track of notes in threads</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 16 }} onPress={() => setHuddleModalVisible(false)}>
              <Text style={{ color: theme.secondaryText, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  dmHeaderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  messagesContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
  },
  senderName: {
    fontSize: 12,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 120,
    minHeight: 40,
  },
  iconButton: {
    paddingHorizontal: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dmListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
  },
  dmListAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  dmListName: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  huddleModalContent: {
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  huddleOption: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  huddleOptionText: {
    fontSize: 16,
  },
});
