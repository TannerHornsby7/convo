import { InitiateAuthCommandOutput, CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand, AuthFlowType } from "@aws-sdk/client-cognito-identity-provider";
import config from "../config.json";
import { ReadableStream } from "web-streams-polyfill";
    
if (typeof global.ReadableStream === "undefined") {
   global.ReadableStream = ReadableStream;
}

export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
});

export const signIn : (email: string, password: string) => Promise<InitiateAuthCommandOutput | undefined> = async (email: string, password: string) => {
  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: config.clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };
  try {
    const command = new InitiateAuthCommand(params);
    const AuthenticationResult: InitiateAuthCommandOutput = await cognitoClient.send(command);
    if (AuthenticationResult) {
      return AuthenticationResult;
    }
  } catch (error) {
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  const params = {
    ClientId: config.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    throw error;
  }
};

export const confirmSignUp = async (email: string, code: string) => {
  const params = {
    ClientId: config.clientId,
    Username: email,
    ConfirmationCode: code,
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    return await cognitoClient.send(command);
  } catch (error) {
    throw error;
  }
};

export const resendConfirmation = async (email: string) => {
  const params = {
    ClientId: config.clientId,
    Username: email,
  };
  try {
    const command = new ResendConfirmationCodeCommand(params);
    await cognitoClient.send(command);
    return true;
  } catch (error) {
    throw error;
  }
}

export const formatErrorMessage = (error: Error) => {
  const messages = error.message.split(";");  
  if (error) {
    return `${error.name}:\n ${messages.map((message) => `• ${message}\n`).join("")}`; 
  }
  return "An unknown error occurred";
}