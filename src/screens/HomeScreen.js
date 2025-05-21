// src/screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/theme';

const dummyChannels = ['general', 'tech-talk', 'random'];
const dummyDMs = ['Gokul', 'Gopi'];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Topbar */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/slack-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Slack Clone</Text>
        <Icon name="person-circle-outline" size={30} color={colors.text} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color={colors.subText} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor={colors.subText}
          style={styles.searchInput}
        />
      </View>

      {/* Channels Section */}
      <Text style={styles.sectionTitle}>Channels</Text>
      <ScrollView style={styles.sectionBox}>
        {dummyChannels.map((channel, index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemRow}
            onPress={() => navigation.navigate('Chat', { name: channel })}>
            <Icon name="chatbox-ellipses-outline" size={20} color={colors.accent} />
            <Text style={styles.itemText}>#{channel}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddChannel')}>
          <Text style={styles.addText}>+ Add Channel</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* DMs Section */}
      <Text style={styles.sectionTitle}>Direct Messages</Text>
      <ScrollView style={styles.sectionBox}>
        {dummyDMs.map((dm, index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemRow}
            onPress={() => navigation.navigate('Chat', { name: dm })}>
            <Icon name="person-outline" size={20} color={colors.success} />
            <Text style={styles.itemText}>{dm}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addText}>+ Add New Teammates</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 16,
  },
  searchInput: {
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  sectionBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  itemText: {
    marginLeft: 8,
    color: colors.text,
    fontSize: 15,
  },
  addButton: {
    marginTop: 10,
  },
  addText: {
    color: colors.accent,
    fontWeight: 'bold',
  },
});
