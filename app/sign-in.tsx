import React, { useState } from 'react';
import { useSession } from '../auth/AuthProvider';
import { Redirect } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, session } = useSession();

  // Redirect to the home page if the user is already signed in.
  if (session) {
    if (session !== 'confirming') {
      return <Redirect href="/(app)" />;
    } else if (session === 'confirming') {
      return <Redirect href="/confirm" />;
    }
  }

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      alert(`Sign in failed: ${error}`);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await signUp(email, password);
      console.log('Sign up successful');
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>{isSignUp ? 'Sign up to create an account' : 'Sign in to your account'}</Text>
      <View style={styles.form}>
        {isSignUp && (
            <TextInput
              style={styles.input}
                placeholder="Username" 
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}
        <Button title={isSignUp ? 'Sign Up' : 'Sign In'} onPress={isSignUp ? handleSignUp : handleSignIn} />
      </View>
      <Button title={isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'} onPress={() => setIsSignUp(!isSignUp)} />
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
  subtitle: {
    fontSize: 18,
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

export default LoginPage;