import { Tabs } from 'expo-router'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@/context/AuthContext'
import { HapticTab } from '@/components/haptic-tab'

export default function TabLayout() {
  const { user } = useAuth()

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#2563EB',
          borderTopColor: 'transparent',
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#BFDBFE',
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          color: '#ffffff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nexus',
          headerShown: true,
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="libros"
        options={{
          title: 'Nuestros Libros',
          headerShown: false,
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu-book" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="carrito"
        options={{
          title: 'Carrito',
          headerShown: true,
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
          tabBarLabel: '',
          href: !user ? null : undefined,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="shopping-cart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: user ? 'Perfil' : 'Login',
          headerShown: true,
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="faq"
        options={{
          title: 'Preguntas Frecuentes',
          headerShown: true,
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="help" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
