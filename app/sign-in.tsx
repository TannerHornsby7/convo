import React, { useState } from 'react';
import { useSession } from '../auth/AuthProvider';
import { formatErrorMessage } from '../auth/authService';
import { Redirect } from 'expo-router';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text, YStack, XStack, Button } from 'tamagui';
import AlertToast from '@/components/AlertToast';

import 'react-native-get-random-values';
import { ToastViewport, Toast, useToastController, useToastState } from '@tamagui/toast';
import DancingBars from '@/components/DancingBars';
// import { v4 as uuidv4 } from 'uuid';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, session } = useSession();
  const toast = useToastController();


  // Redirect to the home page if the user is already signed in.
  if (session && session.email) {
    if (session.accessToken) {
      return <Redirect href="/(app)" />;
    } else if (session.confirmation_status === 'unconfirmed') {
      return <Redirect href="/confirm" />;
    }
  }

  const handleSignIn = async () => {
    try {
      const response = await signIn(email, password);
    } catch (error) {
        // if the error is an Error type
        if (error instanceof Error) {
          // if the error name is UserNotConfirmedException, redirect to the confirmation page
          if (error.name === 'UserNotConfirmedException') {
            toast.show('Sign-In Failed!', {
              message: 'User not confirmed',
            });
            // setSession({email: email, confirmation_status: 'unconfirmed'});
          }
          // prevent error from logging in console
          toast.show('Sign-In Failed!', {
            message: formatErrorMessage(error as Error),
          })
        // prevent error from logging in console
        toast.show('Sign-In Failed!', {
          message: formatErrorMessage(error as Error),
        })
      } else {
        toast.show('Sign-In Failed!', {
          message: 'An unknown error occurred',
        })
      }
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
    } catch (error) {
      if (error) {
        // prevent error from logging in console
        toast.show('Sign-up Failed!', {
          message: formatErrorMessage(error as Error),
        })
      } else {
        toast.show('Sign-up Failed!', {
          message: 'An unknown error occurred',
        })
      }
    }
  };

  return (
      <View style={styles.container}>
        <ToastViewport flexDirection="column-reverse" top={50} right={0} />
        <AlertToast />
        <XStack justifyContent="space-evenly">
          <DancingBars />
          <Text style={styles.title}>Welcome To Convo</Text> 
          <DancingBars />
        </XStack>
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
          <Button onPress={isSignUp ? handleSignUp : handleSignIn}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </View>
        <Button onPress={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </Button>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    color: 'white',
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
    color: 'white',
    backgroundColor: 'transparent',
  },
});

export default LoginPage;