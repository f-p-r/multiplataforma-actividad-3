// app/(tabs)/perfil.tsx - Pantalla de perfil de usuario
import { DangerButton } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useRef } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

export default function PerfilScreen() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const { triggerWarning } = useHapticFeedback()
  const isLoggingOut = useRef(false)

  // Redirigir a login si no hay usuario SOLO cuando la tab está enfocada
  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user && !isLoggingOut.current) {
        router.replace('/auth/login')
      }
      // Resetear flag al enfocar
      isLoggingOut.current = false
    }, [isLoading, user, router])
  )

  const handleLogout = async () => {
    await triggerWarning()
    // Marcar que estamos haciendo logout para evitar redirección a login
    isLoggingOut.current = true
    // Limpiar carrito y hacer logout
    await AsyncStorage.removeItem('carrito')
    await logout()
    // Redirigir a inicio
    router.push('/(tabs)')
  }

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#4B5563' }}>Cargando perfil...</Text>
      </SafeAreaView>
    )
  }

  // Si no hay usuario después de cargar, no renderizar nada (el useEffect redirigirá)
  if (!user) {
    return null
  }

  const ProfileField = ({
    label,
    value,
  }: {
    label: string
    value: string
  }) => (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: '#4B5563',
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: '#F9FAFB',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 8,
          padding: 16,
        }}
      >
        <Text style={{ color: '#1F2937', fontSize: 16 }}>
          {value || 'No disponible'}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            backgroundColor: '#2563EB',
            paddingHorizontal: 16,
            paddingVertical: 32,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#ffffff',
              borderRadius: 40,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <Text
            style={{
              color: '#ffffff',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            {user.name} {user.surname}
          </Text>
          <Text style={{ color: '#BFDBFE', fontSize: 14 }}>
            @{user.username}
          </Text>
        </View>

        {/* Información del perfil */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 32,
            backgroundColor: '#ffffff',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: 24,
            }}
          >
            Información Personal
          </Text>

          <ProfileField
            label="Nombre Completo"
            value={`${user.name} ${user.surname}`}
          />
          <ProfileField label="Usuario" value={user.username} />
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Teléfono" value={user.phone} />

          {/* Botón de cerrar sesión */}
          <View style={{ marginTop: 32, marginBottom: 16 }}>
            <DangerButton title="Cerrar Sesión" onPress={handleLogout} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
