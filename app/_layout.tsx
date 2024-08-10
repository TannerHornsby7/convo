import { Slot } from 'expo-router';
import { SessionProvider } from '../auth/AuthProvider';
import { ToastProvider } from '@tamagui/toast';

import { TamaguiProvider, createTamagui } from 'tamagui' // or 'tamagui'
import { config } from '@tamagui/config/v3'

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config)

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig
declare module '@tamagui/core' { // or 'tamagui'
  interface TamaguiCustomConfig extends Conf {}
}

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <TamaguiProvider config={tamaguiConfig}>
      <ToastProvider>
        <Slot />
      </ToastProvider>
      </TamaguiProvider>
    </SessionProvider>
  );
}