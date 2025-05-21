import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { commonStyles } from '../styles/commonStyles';

export default function DMList({ users, onSelect }) {
  return (
    <ScrollView>
      {users.map((user, idx) => (
        <TouchableOpacity key={idx} onPress={() => onSelect(user)}>
          <Text style={commonStyles.listItem}>{user}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
