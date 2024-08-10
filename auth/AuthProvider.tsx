import React from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { signIn, signUp, confirmSignUp, resendConfirmation } from './authService';
import { InitiateAuthCommandOutput, SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider';

interface SessionObject {
    email?: string,
    confirmation_status?: string,
    login_status?: string,
    idToken?: string,
    accessToken?: string,
    refreshToken?: string,
}

const AuthContext = React.createContext<{
  signIn: (email: string, pw: string) => void;
  signUp: (email: string, pw:string) => Promise<boolean>;
  signOut: () => void;
  confirmUser: (code: string) => void;
  resendConfirmation: () => void;
  session?: SessionObject | null;
  setSession: (session: SessionObject | null) => void;
  isLoading: boolean;
}>({
  signIn: async () => null,
  signUp: async () => false,
  confirmUser: async () => null,
  resendConfirmation: async () => null,
  signOut: () => null,
  session: null,
  setSession: () => null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const session = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!session) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return session;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, sessionString], setSessionString] = useStorageState('authsession');
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  let session: { 
    email?: string,
    confirmation_status?: string,
    idToken?: string,
    accessToken?: string,
    refreshToken?: string,
   } = {};

  if (sessionString) {
    session = JSON.parse(sessionString);
  }
  const setSession = (newSession: Object | null) => {
    setSessionString(JSON.stringify(newSession));
  }

  async function signInSession(email: string, password: string) {
    const AuthResult : InitiateAuthCommandOutput | undefined = await signIn(email, password);
      if (!AuthResult || AuthResult.AuthenticationResult?.AccessToken === undefined) {
        console.error('Error signing in');
        return;
        }
        setSession({
          email: email,
          idToken: AuthResult.AuthenticationResult.IdToken,
          accessToken: AuthResult.AuthenticationResult.AccessToken,
          refreshToken: AuthResult.AuthenticationResult.RefreshToken,
          confirmation_status: 'confirmed',
        });
  }
  async function signUpSession(email: string, password: string){
    const AuthResult: SignUpCommandOutput | undefined = await signUp(email, password);
    if (!AuthResult) {
        setSession({});
        return false;
    }
    if (AuthResult.UserConfirmed === false) {
        setSession({email: email, confirmation_status: 'unconfirmed'});
        return true;
    }
    else {
        console.log('User confirmed');
        // Redirect to the sign-in page
        return false;
    }
  }
  async function confirmUserSession(code: string) {
      if (!session.email) {
          setSession({});
          return;
      }
      // Perform confirm user logic here
      const AuthResult = await confirmSignUp(session.email, code);

      // If the response has status code 200, then the user is confirmed
      if (!AuthResult) {
          setSession({...session, confirmation_status: 'unconfirmed'});
      }
      else {
          setSession({...session, confirmation_status: 'confirmed'});
          // Redirect to the sign-in page
      }
      return;
  }

  return (
    <AuthContext.Provider
      value={{
        signIn: signInSession,
        signOut: () => {
          console.log('Signing out');
          setSession({});
        },
        signUp: signUpSession,
        confirmUser: confirmUserSession,
        resendConfirmation: async () => {
          if (!session.email) {
            setSession({});
            return;
          }
          await resendConfirmation(session.email);
          return;
        },
        session,
        setSession,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
