// src/screens/RegisterScreen.js
import React from 'react';
import {
  View, Text, TextInput, Button, StyleSheet
} from 'react-native';
import { colors } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput placeholder="Name" placeholderTextColor={colors.subText} style={styles.input} />
      <TextInput placeholder="Email" placeholderTextColor={colors.subText} style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor={colors.subText} secureTextEntry style={styles.input} />
      <Button title="Register" color={colors.accent} onPress={() => navigation.replace('Main')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { color: colors.text, fontSize: 24, marginBottom: 20 },
  input: { backgroundColor: colors.surface, width: '100%', padding: 10, borderRadius: 8, marginBottom: 15, color: colors.text },
});
