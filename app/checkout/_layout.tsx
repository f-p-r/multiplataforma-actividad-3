// app/checkout/_layout.tsx
import { Stack } from 'expo-router'

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Volver',
        headerStyle: { backgroundColor: '#2563EB' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Datos de Envío',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="confirmation"
        options={{
          title: 'Confirmación de Pedido',
          headerShown: true,
        }}
      />
    </Stack>
  )
}
