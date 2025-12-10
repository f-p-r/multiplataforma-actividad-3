// components/ui/Button.tsx
import React from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

interface ButtonProps {
  onPress: () => void
  title: string
  disabled?: boolean
  loading?: boolean
}

export function PrimaryButton({ onPress, title, disabled = false, loading = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{ width: '100%', marginVertical: 12 }}
    >
      <View
        style={{
          backgroundColor: disabled || loading ? '#9CA3AF' : '#2563EB',
          borderRadius: 8,
          paddingVertical: 16,
          paddingHorizontal: 24,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 48,
          borderWidth: 2,
          borderColor: '#1E40AF',
          opacity: disabled || loading ? 0.6 : 1,
        }}
      >
        {loading && (
          <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
        )}
        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
          {loading ? 'Cargando...' : title}
        </Text>
      </View>
    </Pressable>
  )
}

export function SecondaryButton({ onPress, title, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        borderWidth: 2,
        borderColor: '#2563EB',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        opacity: pressed && !disabled ? 0.8 : 1,
        marginLeft: 8,
      })}
    >
      <Text style={{ color: '#2563EB', fontWeight: '700', fontSize: 16, textAlign: 'center' }}>
        {title}
      </Text>
    </Pressable>
  )
}

export function DangerButton({ onPress, title, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{ width: '100%', marginVertical: 12 }}
    >
      <View
        style={{
          backgroundColor: disabled ? '#9CA3AF' : '#DC2626',
          borderRadius: 8,
          paddingVertical: 14,
          paddingHorizontal: 24,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 48,
          borderWidth: 1,
          borderColor: '#991B1B',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          {title}
        </Text>
      </View>
    </Pressable>
  )
}
