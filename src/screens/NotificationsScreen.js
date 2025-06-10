import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

export default function NotificationsScreen({ navigation }) {
  const [allNotifications, setAllNotifications] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [threadReplies, setThreadReplies] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[
        styles.headerRow,
        { backgroundColor: theme.background, borderBottomColor: theme.border }
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontSize: 18 }}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Push Notifications</Text>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>All new messages</Text>
            <Switch
              value={allNotifications}
              onValueChange={setAllNotifications}
              thumbColor={allNotifications ? theme.accent : theme.secondaryText}
            />
          </View>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Mentions & keywords</Text>
            <Switch
              value={mentions}
              onValueChange={setMentions}
              thumbColor={mentions ? theme.accent : theme.secondaryText}
            />
          </View>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Thread replies</Text>
            <Switch
              value={threadReplies}
              onValueChange={setThreadReplies}
              thumbColor={threadReplies ? theme.accent : theme.secondaryText}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Other</Text>
          <TouchableOpacity style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Do Not Disturb</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>Notification schedule</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12,
    borderBottomWidth: 1,
  },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, marginBottom: 8, fontWeight: 'bold' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderRadius: 10, marginBottom: 12,
  },
  label: { fontSize: 16 },
});