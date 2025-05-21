import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const activityData = [
  { id: '1', activity: 'Gokul joined #tech-talk.' },
  { id: '2', activity: 'Gopi reacted to your message in #general.' },
];

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={activityData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>{item.activity}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  activityItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityText: {
    color: '#fff',
    fontSize: 16,
  },
});
