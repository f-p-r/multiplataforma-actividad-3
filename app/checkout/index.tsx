import { PrimaryButton } from '@/components/ui/Button'
import TextInput from '@/components/ui/TextInput'
import { useAuth } from '@/context/AuthContext'
import useCart from '@/hooks/useCart'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import formatPrice from '@/utils/formatPrice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native'

export default function CheckoutScreen() {
  const router = useRouter()
  const { cart, total } = useCart() as any
  const { user } = useAuth()
  const { triggerSuccess } = useHapticFeedback()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar datos guardados al montar el componente, o datos del usuario si es la primera vez
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('checkoutData')
        if (savedData) {
          setFormData(JSON.parse(savedData))
        } else if (user) {
          // Si no hay datos guardados, cargar datos del usuario autenticado
          setFormData({
            fullName: `${user.name} ${user.surname}`,
            email: user.email || '',
            phone: user.phone || '',
            address: '',
            city: '',
            zipCode: '',
            country: '',
          })
        }
      } catch (_error) {
        console.error('Error al cargar datos del checkout:', _error)
      }
    }
    loadCheckoutData()
  }, [user])

  const handleChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    // Guardar en AsyncStorage automáticamente
    AsyncStorage.setItem('checkoutData', JSON.stringify(newFormData)).catch(
      (_error) => console.error('Error al guardar datos:', _error)
    )
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName) newErrors.fullName = 'Nombre completo requerido'
    if (!formData.email) newErrors.email = 'Email requerido'
    if (!formData.phone) newErrors.phone = 'Teléfono requerido'
    if (!formData.address) newErrors.address = 'Dirección requerida'
    if (!formData.city) newErrors.city = 'Ciudad requerida'
    if (!formData.zipCode) newErrors.zipCode = 'Código postal requerido'
    if (!formData.country) newErrors.country = 'País requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await triggerSuccess()
      // Los datos ya están guardados en handleChange
      // Navegar a confirmación
      router.push('/checkout/confirmation' as any)
    } catch (_error) {
      Alert.alert('Error', 'Ha ocurrido un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6 pb-6">
          {/* Resumen del carrito */}
          <View className="bg-gray-100 rounded-lg p-4 mb-6">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Resumen del Pedido
            </Text>
            <Text className="text-gray-600 mb-2">
              Artículos: {cart.length}
            </Text>
            <View className="border-t border-gray-200 pt-3">
              <Text className="text-lg font-bold text-blue-600">
                Total: {formatPrice(total)}
              </Text>
            </View>
          </View>

          {/* Formulario de envío */}
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Datos de Envío
          </Text>

          <TextInput
            label="Nombre Completo"
            placeholder="Tu nombre completo"
            value={formData.fullName}
            onChangeText={(value: string) => handleChange('fullName', value)}
            error={errors.fullName}
          />

          <TextInput
            label="Email"
            placeholder="tu@email.com"
            value={formData.email}
            onChangeText={(value: string) => handleChange('email', value)}
            error={errors.email}
            keyboardType="email-address"
          />

          <TextInput
            label="Teléfono"
            placeholder="+34 600 123 456"
            value={formData.phone}
            onChangeText={(value: string) => handleChange('phone', value)}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Dirección"
            placeholder="Calle, número y piso"
            value={formData.address}
            onChangeText={(value: string) => handleChange('address', value)}
            error={errors.address}
          />

          <TextInput
            label="Ciudad"
            placeholder="Tu ciudad"
            value={formData.city}
            onChangeText={(value: string) => handleChange('city', value)}
            error={errors.city}
          />

          <TextInput
            label="Código Postal"
            placeholder="Código postal"
            value={formData.zipCode}
            onChangeText={(value: string) => handleChange('zipCode', value)}
            error={errors.zipCode}
          />

          <TextInput
            label="País"
            placeholder="Tu país"
            value={formData.country}
            onChangeText={(value: string) => handleChange('country', value)}
            error={errors.country}
          />

          {/* Botón continuar */}
          <View className="mt-6 mb-8">
            <PrimaryButton
              title="Continuar a Confirmación"
              onPress={handleContinue}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
