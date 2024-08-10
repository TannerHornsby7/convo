import React from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { signIn, signUp, confirmSignUp } from './authService';
import { Redirect } from 'expo-router';
import { InitiateAuthCommandOutput, SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider';

const AuthContext = React.createContext<{
  signIn: (username: string, pw: string) => void;
  signUp: (email: string, pw:string) => Promise<boolean>;
  signOut: () => void;
  confirmUser: (username: string, code: string) => Promise<boolean>;
  session?: string | null;
  setSession: (value: string | null) => void;
  isLoading: boolean;
}>({
  signIn: async () => null,
  signUp: async () => false,
  confirmUser: async () => false,
  signOut: () => null,
  session: null,
  setSession: () => null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (username: string, password: string) => {
          // setEmail
          // Perform sign-in logic here
          const AuthResult : InitiateAuthCommandOutput | undefined = await signIn(username, password);
          if (!AuthResult || AuthResult.AuthenticationResult?.AccessToken === undefined) {
            console.error('Error signing in');
            setSession(null);
            return;
            }
            //   sessionStorge.setItem("idToken", AuthenticationResult.IdToken || '');
            //   sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || '');
            //   sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || '');
            console.log('Sign in successful');
            console.log('Access token: ', AuthResult.AuthenticationResult.AccessToken);
          setSession(AuthResult.AuthenticationResult.AccessToken);
          // TODO:
          // figure out storing id and refresh tokens as well
          // figure out how to handle token expiry
        },
        signOut: () => {
          setSession(null);
        },
        signUp: async (username, password) => {
            // setEmail
            // Perform sign-up logic here
            const AuthResult: SignUpCommandOutput | undefined = await signUp(username, password);
            // set the state of auth provider to note the user has performed
            // sign-up action based on the response from the server
            if (!AuthResult) {
                console.error('Error signing up');
                setSession(null);
                return false;
            }
            if (AuthResult.UserConfirmed === false) {
                console.log('User not confirmed');
                // Redirect to the confirmation page
                setSession('confirming');
                return true;
            }
            else {
                console.log('User confirmed');
                // Redirect to the sign-in page
                return false;
            }
        },
        confirmUser: async (username, code) => {
            // Perform confirm user logic here
            const AuthResult : boolean = await confirmSignUp(username, code);

            // If the response has status code 200, then the user is confirmed
            if (!AuthResult) {
                console.error('Error confirming user');
                setSession('confirming');
                return false;
            }
            else {
                console.log('User confirmed');
                console.log('Sign in on next page');
                setSession(null);
                // Redirect to the sign-in page
                return true;
            }
        },
        session,
        setSession,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
