import { Stack } from 'expo-router'
import React from 'react'

export default function LibrosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Volver',
      }}
    >
      <Stack.Screen
        name="lista"
        options={{
          title: 'Nuestros Libros',
          headerShown: true,
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalle del Libro',
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#ffffff',
        }}
      />
    </Stack>
  )
}
