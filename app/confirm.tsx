import React, { useState } from 'react';
import { Redirect } from 'expo-router';
import { useSession } from '../auth/AuthProvider';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const ConfirmUserPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const { session, confirmUser } = useSession();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (session !== 'confirming') {
    return <Redirect href="/(app)" />;
  }

  const handleSubmit = async () => {
    try {
      await confirmUser(email, confirmationCode);
      Alert.alert("Account confirmed successfully!\nSign in on next page.");
    } catch (error) {
      Alert.alert(`Failed to confirm account: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Account</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmation Code"
          value={confirmationCode}
          onChangeText={setConfirmationCode}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button title="Confirm Account" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default ConfirmUserPage;