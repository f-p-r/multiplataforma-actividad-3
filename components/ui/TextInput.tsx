// components/ui/TextInput.tsx - Input de texto reutilizable
import React from 'react'
import { TextInput as RNTextInput, Text, View, TextInputProps } from 'react-native'

interface TextInputComponentProps extends TextInputProps {
  label?: string
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  secureTextEntry?: boolean
  error?: string
}

export default function TextInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  ...props
}: TextInputComponentProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <RNTextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 2,
          borderColor: error ? '#EF4444' : '#D1D5DB',
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: '#1F2937',
          fontSize: 16,
          backgroundColor: '#ffffff',
        }}
        placeholderTextColor="#999"
        {...props}
      />
      {error && (
        <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  )
}
