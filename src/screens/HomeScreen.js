import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  Share,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext'; // Make sure this path is correct

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const initialChannels = [
  { id: '1', name: 'general' },
  { id: '2', name: 'random' },
  { id: '3', name: 'react-native' },
];

const initialDMs = [
  {
    id: 'u1',
    name: 'Gokul',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 'u2',
    name: 'Priya',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 'u3',
    name: 'Alex',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

const workspaceName = 'SlackClone';
const userAvatar = require('../../assets/profile-icon.png');
const userName = 'Karthik_MD student'; 
const userEmail = 'karthikd062004@gmail.com';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { profileImage } = useProfile() || {}; // <-- fallback to avoid undefined error
  const [channels, setChannels] = useState(initialChannels);
  const [dms, setDMs] = useState(initialDMs);
  const [modalVisible, setModalVisible] = useState(false);
  const [dmModalVisible, setDMModalVisible] = useState(false);
  const [jumpModalVisible, setJumpModalVisible] = useState(false);
  const [newChannel, setNewChannel] = useState('');
  const [newDMName, setNewDMName] = useState('');
  const [newDMAvatar, setNewDMAvatar] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortType, setSortType] = useState('sections'); // or 'recent'
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [userStatus, setUserStatus] = useState(''); // State for user status
  const [isUserActive, setIsUserActive] = useState(true); // State for user active status

  // Dropdown state
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDMsOpen] = useState(true);

  // Sort channels and DMs based on sortType
  const sortedChannels = [...channels];
  const sortedDMs = [...dms];

  if (sortType === 'recent') {
    sortedChannels.sort((a, b) => Number(b.id) - Number(a.id));
    sortedDMs.sort((a, b) => Number(b.id) - Number(a.id));
  }

  const filteredChannels = sortedChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredDMs = sortedDMs.filter(dm =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddChannel = () => {
    if (newChannel.trim()) {
      setChannels([
        ...channels,
        { id: Date.now().toString(), name: newChannel.trim() },
      ]);
      setNewChannel('');
      setModalVisible(false);
    }
  };

  const handleAddDM = () => {
    if (newDMName.trim()) {
      setDMs([
        ...dms,
        {
          id: Date.now().toString(),
          name: newDMName.trim(),
          avatar: newDMAvatar.trim() || 'https://randomuser.me/api/portraits/lego/1.jpg',
        },
      ]);
      setNewDMName('');
      setNewDMAvatar('');
      setDMModalVisible(false);
    }
  };

  // For Jump To modal, combine channels and DMs
  const jumpList = [
    ...channels.map(c => ({ ...c, type: 'channel' })),
    ...dms.map(d => ({ ...d, type: 'dm' })),
  ].filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dropdown toggle handlers
  const toggleChannels = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChannelsOpen(open => !open);
  };
  const toggleDMs = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDMsOpen(open => !open);
  };

  const handleShareLink = async () => {
    setDMModalVisible(false);
    try {
      await Share.share({
        message: 'Join my SlackClone workspace! Here is your invite link: https://yourapp.com/invite/12345',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the link.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setMenuModalVisible(true)}>
            <Ionicons name="menu" size={28} color={theme.text} style={{ marginRight: 12 }} />
          </TouchableOpacity>
          <Image
            source={require('../../assets/slack-logo.png')} 
            style={{ width: 32, height: 32, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={[styles.workspaceText, { color: theme.text }]}>{workspaceName}</Text>
        </View>
        <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
          <Image
            source={profileImage || require('../../assets/profile-icon.png')}
            style={styles.avatar}
          />
          {/* Status indicator */}
          <View style={[styles.statusIndicatorContainer]}>
            <View style={[styles.statusIndicator, { backgroundColor: isUserActive ? theme.online : theme.away }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.secondaryText} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Jump to..."
          placeholderTextColor={theme.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setJumpModalVisible(true)}
        />
      </View>

      {/* Channels Section (Dropdown) */}
      <TouchableOpacity style={styles.sectionHeaderRow} onPress={toggleChannels} activeOpacity={0.7}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name={channelsOpen ? 'chevron-down' : 'chevron-forward'}
            size={20}
            color="#A3A3A3"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.sectionHeader, { color: theme.secondaryText }]}>Channels</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#4A99E9" />
        </TouchableOpacity>
      </TouchableOpacity>
      {channelsOpen && (
        <FlatList
          data={filteredChannels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.channelRow}
              onPress={() => navigation.navigate('Chat', { channel: item })}
            >
              <Ionicons name="pricetag-outline" size={20} color="#4A99E9" style={{ marginRight: 12 }} />
              <Text style={[styles.channelName, { color: theme.text }]}># {item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#A3A3A3', textAlign: 'center', marginTop: 40 }}>
              No channels yet. Add one!
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      )}

      {/* DMs Section (Dropdown) */}
      <View style={styles.sectionHeaderRow}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          onPress={toggleDMs}
          activeOpacity={0.7}
        >
          <Ionicons
            name={dmsOpen ? 'chevron-down' : 'chevron-forward'}
            size={20}
            color="#A3A3A3"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.sectionHeader, { color: theme.secondaryText }]}>Direct Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDMModalVisible(true)}>
          <Ionicons name="add" size={24} color="#4A99E9" />
        </TouchableOpacity>
      </View>
      {dmsOpen && (
        <FlatList
          data={filteredDMs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dmRow}
              onPress={() => navigation.navigate('Chat', { dmUser: item })}
            >
              <Image source={{ uri: item.avatar }} style={styles.dmAvatar} />
              <Text style={[styles.dmName, { color: theme.text }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#A3A3A3', textAlign: 'center', marginTop: 10 }}>
              No direct messages yet.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Floating Add Channel Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accent }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Channel Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Channel</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
              placeholder="Channel name"
              placeholderTextColor={theme.placeholder}
              value={newChannel}
              onChangeText={setNewChannel}
              autoFocus
            />
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]}>
              <Text style={[styles.addButtonText, { color: '#fff' }]}>Add</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Add DM Modal */}
      <Modal
        visible={dmModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDMModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDMModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Invite people to join your team
            </Text>
            {/* Share a link */}
            <TouchableOpacity
              style={[styles.addButton, { marginBottom: 12, width: '100%' }]}
              onPress={handleShareLink}
            >
              <Ionicons name="share-social-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.addButtonText}>Share a link</Text>
            </TouchableOpacity>
            {/* Add from contacts */}
            <TouchableOpacity
              style={[styles.addButton, { marginBottom: 12, width: '100%' }]}
              onPress={() => {
                setDMModalVisible(false);
                Alert.alert('Coming Soon', 'Add from contacts feature coming soon!');
              }}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.addButtonText}>Add from contacts</Text>
            </TouchableOpacity>
            {/* Add by email */}
            <TouchableOpacity
              style={[styles.addButton, { width: '100%' }]}
              onPress={() => {
                setDMModalVisible(false);
                navigation.navigate('InviteByEmailScreen');
              }}
            >
              <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.addButtonText}>Add by email</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Jump To Modal (Bottom Sheet) */}
      <Modal
        visible={jumpModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setJumpModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setJumpModalVisible(false)}>
          <View style={[styles.jumpModalContent, { backgroundColor: theme.card }]}>
            <Text style={styles.modalTitle}>Jump to…</Text>
            <FlatList
              data={jumpList}
              keyExtractor={item => `${item.type}-${item.id}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.jumpRow}
                  onPress={() => {
                    setJumpModalVisible(false);
                    if (item.type === 'channel') {
                      navigation.navigate('Chat', { channel: item });
                    } else {
                      navigation.navigate('Chat', { dmUser: item });
                    }
                  }}
                >
                  {item.type === 'channel' ? (
                    <Ionicons name="pricetag-outline" size={20} color="#4A99E9" style={{ marginRight: 12 }} />
                  ) : (
                    <Image source={{ uri: item.avatar }} style={styles.dmAvatar} />
                  )}
                  <Text style={[styles.jumpName, { color: theme.text }]}>
                    {item.type === 'channel' ? `# ${item.name}` : item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ color: '#A3A3A3', textAlign: 'center', marginTop: 10 }}>
                  No results.
                </Text>
              }
            />
          </View>
        </Pressable>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setProfileModalVisible(false)}>
          <View style={[styles.profileModalContent, { backgroundColor: theme.card }]}>
            {/* Make profile photo clickable */}
            <TouchableOpacity
              onPress={() => {
                setProfileModalVisible(false);
                navigation.navigate('ProfileScreen', { 
                  avatar: userAvatar, 
                  name: userName, 
                  email: userEmail,
                  userStatus: userStatus,
                  isUserActive: isUserActive,
                });
              }}
            >
              <Image source={userAvatar} style={styles.profileAvatar} />
            </TouchableOpacity>
            <Text style={[styles.profileName, { color: theme.text }]}>{userName}</Text>
            <Text style={[styles.profileEmail, { color: theme.secondaryText }]}>{userEmail}</Text>

            {/* Update your status */}
            <TouchableOpacity
              style={styles.profileAction}
              onPress={() => {
                setProfileModalVisible(false);
                setStatusModalVisible(true);
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#4A99E9" style={{ marginRight: 10 }} />
              <Text style={[styles.profileActionText, { color: theme.text }]}>Update your status</Text>
            </TouchableOpacity>

            {/* Set yourself as active/away */}
            <TouchableOpacity
              style={styles.profileAction}
              onPress={() => {
                setProfileModalVisible(false);
                setIsUserActive(prevState => !prevState);
                Alert.alert('Status Updated', `You are now ${isUserActive ? 'away' : 'active'}.`);
              }}
            >
              <Ionicons name="ellipse-outline" size={20} color="#4A99E9" style={{ marginRight: 10 }} />
              <Text style={[styles.profileActionText, {color: theme.text}]}>Set yourself as active/away</Text>
            </TouchableOpacity>

            {/* View Profile */}
            <TouchableOpacity
              style={[styles.profileAction, { backgroundColor: theme.input }]}
              onPress={() => {
                setProfileModalVisible(false);
                navigation.navigate('ProfileScreen', { 
                  avatar: userAvatar, 
                  name: userName, 
                  email: userEmail,
                  userStatus: userStatus,
                  isUserActive: isUserActive,
                });
              }}
            >
              <Ionicons name="person-outline" size={20} color={theme.accent} style={{ marginRight: 10 }} />
              <Text style={[styles.profileActionText, { color: theme.text }]}>View Profile</Text>
            </TouchableOpacity>

            {/* Preferences */}
            <TouchableOpacity
              style={styles.profileAction}
              onPress={() => {
                setProfileModalVisible(false);
                navigation.navigate('PreferencesScreen');
              }}
            >
              <Ionicons name="settings-outline" size={20} color="#4A99E9" style={{ marginRight: 10 }} />
              <Text style={[styles.profileActionText,{ color: theme.text }]}>Preferences</Text>
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              style={styles.profileAction}
              onPress={() => {
                setProfileModalVisible(false);
                navigation.navigate('NotificationsScreen');
              }}
            >
              <Ionicons name="notifications-outline" size={20} color="#4A99E9" style={{ marginRight: 10 }} />
              <Text style={[styles.profileActionText,{ color: theme.text }]}>Notifications</Text>
            </TouchableOpacity>

            {/* Invitations to connect */}
            <TouchableOpacity
              style={styles.profileAction}
              onPress={() => {
                setProfileModalVisible(false);
                navigation.navigate('InviteByEmailScreen');
              }}
            >
              <Ionicons name="person-add-outline" size={20} color="#4A99E9" style={{ marginRight: 10 }} />
              <Text style={[styles.profileActionText,{ color: theme.text }]}>Invitations to connect</Text>
            </TouchableOpacity>

            {/* Sign Out */}
            <TouchableOpacity
              style={[styles.profileAction, { marginTop: 12 }]}
              onPress={() => setProfileModalVisible(false)}
            >
              <Ionicons name="log-out-outline" size={20} color="#E53935" style={{ marginRight: 10 }} />
              <Text style={[styles.profileActionText, { color: '#E53935' }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setStatusModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Update your status</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
              placeholder="What's your status?"
              placeholderTextColor={theme.placeholder}
              value={userStatus}
              onChangeText={setUserStatus}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.accent }]} 
              onPress={() => {
                Alert.alert('Status Saved', `Your status: ${userStatus}`);
                setStatusModalVisible(false);
              }}
            >
              <Text style={[styles.addButtonText, { color: '#fff' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={menuModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuModalVisible(false)}>
          <View style={[styles.menuModal, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuModalVisible(false);
                // Already on Home, so do nothing or scroll to top
              }}
            >
              <Ionicons name="home-outline" size={20} color={theme.text} style={{ marginRight: 12 }} />
              <Text style={[styles.menuText, { color: theme.text }]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuModalVisible(false);
                navigation.navigate('PreferencesScreen');
              }}
            >
              <Ionicons name="settings-outline" size={20} color={theme.text} style={{ marginRight: 12 }} />
              <Text style={[styles.menuText, { color: theme.text }]}>Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuModalVisible(false);
                setSortModalVisible(true); // Show sort modal instead of Alert
              }}
            >
              <Ionicons name="swap-vertical-outline" size={20} color={theme.text} style={{ marginRight: 12 }} />
              <Text style={[styles.menuText, { color: theme.text }]}>Sort</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.sortModalContent}>
            <Text style={styles.modalTitle}>Sort by</Text>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortType === 'sections' && { backgroundColor: '#232129' }
              ]}
              onPress={() => {
                setSortType('sections');
                setSortModalVisible(false);
                // Optionally, sort your lists here
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Sections</Text>
              {sortType === 'sections' && (
                <Ionicons name="checkmark" size={20} color="#4A99E9" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortType === 'recent' && { backgroundColor: '#232129' }
              ]}
              onPress={() => {
                setSortType('recent');
                setSortModalVisible(false);
                // Optionally, sort your lists here
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Recent Activity</Text>
              {sortType === 'recent' && (
                <Ionicons name="checkmark" size={20} color="#4A99E9" style={{ marginLeft: 8 }} />
              )}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  workspaceText: { fontSize: 22, fontWeight: 'bold' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#4A99E9', // You can keep accent color
  },
  statusIndicatorContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16, // Container size to center the dot better
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#121212', // Use a darker border for contrast
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#232129',
  },
  channelName: {
   fontSize: 17,
   fontWeight: '500'
},
  dmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#232129',
  },
  dmAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  dmName: {
   fontSize: 16,
   fontWeight: '500'
},
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    backgroundColor: '#4A99E9',
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#232129',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  jumpModalContent: {
    backgroundColor: '#232129',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    maxHeight: '70%',
  },
  jumpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    width: '100%',
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#18171C',
  },
  jumpName: {
    color: '#fff',
    fontSize: 16,
  },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    width: '100%',
    backgroundColor: '#18171C',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4A99E9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  profileModalContent: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#4A99E9',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 18,
  },
  profileAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  profileActionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuModal: {
    borderRadius: 12,
    marginTop: 60,
    marginLeft: 20,
    paddingVertical: 8,
    minWidth: 180,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sortModalContent: {
    backgroundColor: '#18171C',
    borderRadius: 14,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
});