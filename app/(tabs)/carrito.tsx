// app/(tabs)/carrito.tsx - Pantalla de carrito de compras (protegida)
import BookImage from '@/components/BookImage'
import { DangerButton, PrimaryButton } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import useCart from '@/hooks/useCart'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { getCoverImagePath } from '@/services/api'
import formatPrice from '@/utils/formatPrice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Redirect, useFocusEffect, useNavigation, useRouter } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'

export default function CarritoScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const { user } = useAuth()
  const { cart, isLoading, removeFromCart, updateQuantity, clearCart, total, loadCart } = useCart() as any
  const { triggerWarning, triggerSuccess } = useHapticFeedback()

  // Actualizar título con suma total de cantidades
  useEffect(() => {
    const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
    navigation.setOptions({
      title: `Carrito (${totalItems})`,
    })
  }, [navigation, cart])

  // Recargar carrito cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      loadCart()
    }, [loadCart])
  )

  // Protección: redirigir a login si no está autenticado (después de todos los hooks)
  if (!user) {
    // Guardar la ruta del carrito para retornar después del login
    AsyncStorage.setItem('returnRoute', '/(tabs)/carrito').catch(err => 
      console.error('Error saving returnRoute:', err)
    )
    return <Redirect href="/auth/login" />
  }

  const handleRemoveItem = async (bookId: number) => {
    try {
      const ok = await removeFromCart(bookId)
      if (ok) {
        await triggerWarning()
        await loadCart()
      }
    } catch (err) {
      console.error('Error removing item from cart:', err)
    }
  }

  const handleUpdateQuantity = async (bookId: number, quantity: number) => {
    try {
      const ok = await updateQuantity(bookId, quantity)
      if (ok) {
        await triggerSuccess()
        await loadCart()
      }
    } catch (err) {
      console.error('Error updating quantity:', err)
    }
  }

  const handleClearCart = async () => {
    await triggerWarning()
    clearCart()
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return
    }
    await triggerSuccess()
    router.push('/checkout' as any)
  }

  const CartItem = ({ item }: { item: any }) => {
    const currentQty = item.quantity ?? item.cantidad ?? 0
    return (
      <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3 flex-row">
        <BookImage
          source={{ uri: getCoverImagePath(item.id) }}
          style={{ width: 80, height: 120, borderRadius: 6, marginRight: 14 }}
          resizeMode="cover"
          bookTitle={item.title}
        />

        <View className="flex-1">
          <Text className="font-bold text-gray-900 mb-1" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-xs text-gray-600 mb-2">
            {typeof item.author === 'object' ? item.author.name : item.author}
          </Text>
          <Text className="text-sm font-bold text-blue-600 mb-3">
            {formatPrice(item.price)}
          </Text>

          <View className="flex-row items-center">
            <Pressable
              onPress={() => handleUpdateQuantity(item.id, currentQty - 1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              <Text className="text-sm font-bold">−</Text>
            </Pressable>
            <Text className="mx-3 font-semibold">{currentQty}</Text>
            <Pressable
              onPress={() => handleUpdateQuantity(item.id, currentQty + 1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              <Text className="text-sm font-bold">+</Text>
            </Pressable>
            <View className="flex-1" />
            <Pressable
              onPress={() => handleRemoveItem(item.id)}
              className="bg-red-100 px-3 py-1 rounded"
            >
              <Text className="text-red-600 text-base font-black">✕</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Cargando carrito…</Text>
        </View>
      ) : cart.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-6xl mb-4">🛒</Text>
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Tu carrito está vacío
          </Text>
          <Text className="text-gray-600 text-center">
            Explora nuestro catálogo y añade libros a tu carrito
          </Text>
        </View>
      ) : (
        <View className="flex-1 bg-white">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="px-4 py-4 bg-white">
              <FlatList
                data={cart}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id?.toString()}
                scrollEnabled={false}
              />
            </View>

            <View className="px-4 py-6 bg-gray-50 border-t border-gray-200">
              <View className="flex-row justify-between mb-4">
                <Text className="text-gray-700">Subtotal:</Text>
                <Text className="font-semibold">{formatPrice(total)}</Text>
              </View>
              <View className="flex-row justify-between mb-4">
                <Text className="text-gray-700">Envío:</Text>
                <Text className="font-semibold">Gratis</Text>
              </View>
              <View className="h-px bg-gray-300 mb-4" />
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-gray-900">Total:</Text>
                <Text className="text-lg font-bold text-blue-600">
                  {formatPrice(total)}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="px-4 py-4 border-t border-gray-200 bg-white">
            <PrimaryButton title="Proceder al pago" onPress={handleCheckout} />
            <DangerButton title="Vaciar carrito" onPress={handleClearCart} />
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
