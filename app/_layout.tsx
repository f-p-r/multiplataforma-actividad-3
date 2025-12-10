import '../global.css'
import { AuthProvider } from '@/context/AuthContext'
import { Stack } from 'expo-router'
import React from 'react'

export const unstable_settings = {
  anchor: '(tabs)',
}

const RootLayout: React.FC = () => {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  )
}

export default RootLayout
