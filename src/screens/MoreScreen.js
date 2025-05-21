import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function MoreScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => navigation.replace('Login'), // Replace to clear stack
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, { backgroundColor: '#E53935' }]}
        onPress={handleLogout}>
        <Text style={styles.optionText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  option: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
});
