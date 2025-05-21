// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity
} from 'react-native';
import { colors } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/slack-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Slack Clone</Text>

      <TextInput placeholder="Email" placeholderTextColor={colors.subText} style={styles.input} />
      <TextInput placeholder="Password" placeholderTextColor={colors.subText} secureTextEntry style={styles.input} />

      <Button title="Login" color={colors.accent} onPress={() => navigation.replace('Main')} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>New user? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 70, height: 70, marginBottom: 20 },
  title: { color: colors.text, fontSize: 24, marginBottom: 20 },
  input: { backgroundColor: colors.surface, width: '100%', padding: 10, borderRadius: 8, marginBottom: 15, color: colors.text },
  link: { color: colors.accent, marginTop: 10 },
});
