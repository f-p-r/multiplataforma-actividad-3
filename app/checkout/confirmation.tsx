import { PrimaryButton } from '@/components/ui/Button'
import useCart from '@/hooks/useCart'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import formatPrice from '@/utils/formatPrice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'

export default function ConfirmationScreen() {
  const router = useRouter()
  const { cart, total, clearCart } = useCart() as any
  const { triggerSuccess } = useHapticFeedback()
  const [loading, setLoading] = useState(false)

  const handleConfirmOrder = async () => {
    setLoading(true)
    try {
      await triggerSuccess()
      
      // Simular confirmación de pedido
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Limpiar carrito y datos del formulario de checkout
      await clearCart()
      await AsyncStorage.removeItem('checkoutData')
      
      Alert.alert(
        '¡Pedido Confirmado!',
        'Tu pedido ha sido realizado exitosamente. Te enviaremos un email con los detalles.',
        [
          {
            text: 'Volver al inicio',
            onPress: () => {
              router.replace('/(tabs)')
            },
          },
        ]
      )
    } catch (error) {
      Alert.alert('Error', 'No se pudo confirmar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Resumen de la orden */}
          <View className="items-center mb-8">
            <Text className="text-5xl mb-4">📋</Text>
            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
              Resumen del Pedido
            </Text>
            <Text className="text-gray-600 text-center">
              Revisa los detalles antes de confirmar
            </Text>
          </View>

          {/* Detalles del pedido */}
          <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <Text className="text-base font-bold text-gray-900 mb-4">
              Artículos del Pedido
            </Text>

            {cart.map((item: any) => (
              <View
                key={item.id}
                className="flex-row justify-between py-3 border-b border-gray-200"
              >
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Cantidad: {item.quantity}
                  </Text>
                </View>
                <Text className="text-blue-600 font-bold ml-3">
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}

            {/* Total */}
            <View className="mt-4 pt-4 border-t-2 border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-900">
                  Total a Pagar:
                </Text>
                <Text className="text-2xl font-bold text-blue-600">
                  {formatPrice(total)}
                </Text>
              </View>
            </View>
          </View>

          {/* Información importante */}
          <View className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
            <Text className="text-yellow-900 font-semibold mb-2">
              ⚠️ Información Importante
            </Text>
            <Text className="text-yellow-800 text-sm leading-relaxed">
              Al confirmar este pedido, aceptas los términos y condiciones. Tu pedido será procesado inmediatamente.
            </Text>
          </View>

          {/* Botones de acción */}
          <View className="mb-8">
            <PrimaryButton
              title="Confirmar Pedido"
              onPress={handleConfirmOrder}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
