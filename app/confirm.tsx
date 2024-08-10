import React, { useState } from 'react';
import { Redirect } from 'expo-router';
import { useSession } from '../auth/AuthProvider';
import { formatErrorMessage } from '@/auth/authService';
import { TextInput, StyleSheet } from 'react-native';
import { Text, View, Button } from 'tamagui';
import { ToastViewport, useToastController } from '@tamagui/toast';
import AlertToast from '@/components/AlertToast';
import DancingBars from '@/components/DancingBars';


const ConfirmUserPage: React.FC = () => {
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const { session, confirmUser, isLoading, signOut } = useSession();
  const toast = useToastController();
  const [newCodeRequestable, setNewCodeRequestable] = useState<boolean>(false);

  if (isLoading) {
    return <DancingBars />;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (session !== 'confirming') {
    return <Redirect href="/(app)" />;
  }

  const handleSubmit = async () => {
    try {
      await confirmUser(email, confirmationCode);
    } catch (error) {
      if (newCodeRequestable) {
        if (error) {
          // prevent error from logging in console
          toast.show('Confirmation Failed!', {
            message: formatErrorMessage(error as Error),
          })
        } else {
          toast.show('Confirmation Failed!', {
            message: 'An unknown error occurred',
          })
        }
      }
    }
    setNewCodeRequestable(true);
  };

  return (
    <View style={styles.container}>
      <ToastViewport flexDirection="column-reverse" top={50} right={0} />
      <AlertToast />
      {/* back chevron */}
        <Button style={{ position: 'absolute', top: 50, left: 50, fontSize: 24, color: 'white', background: "transparent" }} onPress={() => {
          signOut();
        }}>
          {'<'}
        </Button>
      <Text style={styles.title}>Confirm Account</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Confirmation Code"
          value={confirmationCode}
          onChangeText={setConfirmationCode}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button mb={16} onPress={handleSubmit}>
          Confirm Account
        </Button>
        {newCodeRequestable && (
          <Button onPress={() => {}}>
            Resend Confirmation Code
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'black',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
});

export default ConfirmUserPage;