import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function AddChannelScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Add New Channel</Text>
      <TextInput placeholder="Channel name" />
      <Button title="Create" onPress={() => navigation.goBack()} />
    </View>
  );
}
