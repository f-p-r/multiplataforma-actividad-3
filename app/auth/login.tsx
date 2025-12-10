// app/auth/login.tsx
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button'
import TextInput from '@/components/ui/TextInput'
import { useAuth } from '@/context/AuthContext'
import useCart from '@/hooks/useCart'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface FormData {
  username: string
  password: string
  name: string
  surname: string
  email: string
  phone: string
}

interface FormErrors {
  [key: string]: string
}

export default function LoginScreen() {
  const { login } = useAuth()
  const { addToCart } = useCart() as any
  const { triggerSuccess, triggerError } = useHapticFeedback()
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (isRegister) {
      if (!formData.username) newErrors.username = 'Usuario requerido'
      if (!formData.password) newErrors.password = 'Contraseña requerida'
      if (!formData.name) newErrors.name = 'Nombre requerido'
      if (!formData.surname) newErrors.surname = 'Apellido requerido'
      if (!formData.email) newErrors.email = 'Email requerido'
      if (!formData.phone) newErrors.phone = 'Teléfono requerido'
    } else {
      if (!formData.username) newErrors.username = 'Usuario requerido'
      if (!formData.password) newErrors.password = 'Contraseña requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      const { username, password, name, surname, email, phone } = formData

      if (isRegister) {
        if (username === 'user') {
          await triggerError()
          setErrors({ username: 'El usuario ya existe' })
          setLoading(false)
          return
        }

        const success = await login({
          username,
          name,
          surname,
          email,
          phone,
        })

        if (success) {
          await triggerSuccess()
          Alert.alert('Éxito', 'Usuario registrado correctamente')
          setFormData({
            username: '',
            password: '',
            name: '',
            surname: '',
            email: '',
            phone: '',
          })
        }
      } else {
        // Trim espacios en blanco
        const trimmedUsername = username.trim().toLowerCase()
        const trimmedPassword = password.trim()

        if (trimmedUsername === 'user' && trimmedPassword === 'user') {
          const success = await login({
            username: 'user',
            name: 'Usuario',
            surname: 'Demo',
            email: 'user@demo.com',
            phone: '+34 600 123 456',
          })

          if (success) {
            await triggerSuccess()

            // Limpiar carrito anterior
            await AsyncStorage.removeItem('carrito')

            // Comprobar si hay un libro pendiente de añadir al carrito
            const pendingBook = await AsyncStorage.getItem('pendingBookToAdd')
            if (pendingBook) {
              const book = JSON.parse(pendingBook)
              await addToCart(book)
              await AsyncStorage.removeItem('pendingBookToAdd')

              // Obtener la ruta de retorno guardada
              const returnRoute = (await AsyncStorage.getItem('returnRoute')) || '/(tabs)'
              await AsyncStorage.removeItem('returnRoute')

              Alert.alert(
                'Éxito',
                `"${book.title}" ha sido añadido a tu carrito`,
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace(returnRoute as any),
                  },
                ]
              )
              return // No navegar automáticamente, esperar a que el usuario cierre el alert
            }

            // Obtener la ruta de retorno guardada (por defecto /(tabs))
            const returnRoute = (await AsyncStorage.getItem('returnRoute')) || '/(tabs)'
            await AsyncStorage.removeItem('returnRoute')
            router.replace(returnRoute as any)
          } else {
            await triggerError()
            Alert.alert(
              'Error',
              'No se pudo iniciar sesión. Intenta de nuevo.'
            )
          }
        } else {
          await triggerError()
          setErrors({
            password: 'Usuario o contraseña incorrectos. Usa: user/user',
          })
          Alert.alert(
            'Credenciales incorrectas',
            `Usuario introducido: "${trimmedUsername}"\nContraseña introducida: "${trimmedPassword}"\n\nUsa: user/user`
          )
        }
      }
    } catch {
      await triggerError()
      Alert.alert(
        'Error',
        'Ha ocurrido un error al procesar tu solicitud'
      )
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setFormData({
      username: '',
      password: '',
      name: '',
      surname: '',
      email: '',
      phone: '',
    })
    setErrors({})
  }

  return (
    <>
      {/* Set status bar style and background for better contrast */}
      <ExpoStatusBar style="light" backgroundColor="#2563EB" />
      {/* Top safe area filler with app header color so the status bar area isn't white */}
      <SafeAreaView edges={['top']} className="bg-blue-600" />
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
            className="bg-white"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: 24,
                paddingVertical: 32,
              }}
              className="bg-white"
            >
              {/* Logo/Header */}
              <View className="items-center mb-8">
                <Text className="text-4xl font-bold text-blue-600 mb-2">
                  📚 Nexus
                </Text>
                <Text className="text-lg text-gray-700 text-center mb-4">
                  {isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}
                </Text>

                {/* Credenciales de demo */}
                {!isRegister && (
                  <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 w-full">
                    <Text className="text-blue-900 font-semibold text-center mb-1">
                      🔑 Credenciales de prueba:
                    </Text>
                    <Text className="text-blue-800 text-center">
                      Usuario:{' '}
                      <Text className="font-bold">user</Text>
                    </Text>
                    <Text className="text-blue-800 text-center">
                      Contraseña:{' '}
                      <Text className="font-bold">user</Text>
                    </Text>
                  </View>
                )}
              </View>

              {/* Formulario */}
              <View className="w-full bg-white">
                <TextInput
                  label="Usuario"
                  placeholder="Ingresa tu usuario"
                  value={formData.username}
                  onChangeText={(value: string) =>
                    handleChange('username', value)
                  }
                  error={errors.username}
                  autoCapitalize="none"
                />

                <TextInput
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChangeText={(value: string) =>
                    handleChange('password', value)
                  }
                  secureTextEntry
                  error={errors.password}
                />

                {isRegister && (
                  <>
                    <TextInput
                      label="Nombre"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChangeText={(value: string) =>
                        handleChange('name', value)
                      }
                      error={errors.name}
                    />

                    <TextInput
                      label="Apellido"
                      placeholder="Tu apellido"
                      value={formData.surname}
                      onChangeText={(value: string) =>
                        handleChange('surname', value)
                      }
                      error={errors.surname}
                    />

                    <TextInput
                      label="Email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChangeText={(value: string) =>
                        handleChange('email', value)
                      }
                      error={errors.email}
                      keyboardType="email-address"
                    />

                    <TextInput
                      label="Teléfono"
                      placeholder="+34 600 123 456"
                      value={formData.phone}
                      onChangeText={(value: string) =>
                        handleChange('phone', value)
                      }
                      error={errors.phone}
                      keyboardType="phone-pad"
                    />
                  </>
                )}

                {/* Botón principal */}
                <PrimaryButton
                  title={isRegister ? 'Registrarse' : 'Iniciar sesión'}
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading}
                />

                {/* Cambiar modo */}
                <View className="flex-row justify-center items-center mt-6">
                  <Text className="text-gray-500">
                    {isRegister
                      ? '¿Ya tienes cuenta? '
                      : '¿No tienes cuenta? '}
                  </Text>
                  <SecondaryButton
                    title={isRegister ? 'Inicia sesión' : 'Registrate'}
                    onPress={toggleMode}
                  />
                </View>
                {/* Botón para volver a la página inicial en lugar de usar los tabs */}
                <View className="mt-6 items-center">
                  <SecondaryButton
                    title="Volver a inicio"
                    onPress={() => router.replace('/(tabs)')}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  )
}
