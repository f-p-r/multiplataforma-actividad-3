import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Haptics from 'expo-haptics'
import { useCallback, useEffect, useState } from 'react'

export interface CartItem {
  id: number
  title: string
  author: string | { name: string }
  price: number
  quantity: number
  cover?: string
}

/**
 * Hook para manejar el carrito de compras con retroalimentación háptica
 * @returns {object} { cart, addToCart, removeFromCart, updateQuantity, clearCart, total, loadCart, isLoading }
 */
export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCart = useCallback(async () => {
    try {
      const savedCart = await AsyncStorage.getItem('carrito')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar carrito al iniciar
  useEffect(() => {
    loadCart()
  }, [loadCart])

  const saveCart = useCallback(async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('carrito', JSON.stringify(newCart))
      setCart(newCart)
    } catch (error) {
      console.error('Error al guardar carrito:', error)
    }
  }, [])

  // ✅ Añadir al carrito con feedback háptico
  const addToCart = useCallback(
    async (book: CartItem) => {
      try {
        // Feedback háptico: vibración corta de éxito
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        const existingItem = cart.find((item) => item.id === book.id)

        let newCart: CartItem[]
        if (existingItem) {
          newCart = cart.map((item) =>
            item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        } else {
          newCart = [...cart, { ...book, quantity: 1 }]
        }

        await saveCart(newCart)
        return true
      } catch (error) {
        console.error('Error al añadir al carrito:', error)
        return false
      }
    },
    [cart, saveCart]
  )

  // ✅ Eliminar del carrito con feedback háptico
  const removeFromCart = useCallback(
    async (bookId: number) => {
      try {
        // Feedback háptico: vibración de aviso (lighter)
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)

        const newCart = cart.filter((item) => item.id !== bookId)
        await saveCart(newCart)
        return true
      } catch (error) {
        console.error('Error al eliminar del carrito:', error)
        return false
      }
    },
    [cart, saveCart]
  )

  // Actualizar cantidad
  const updateQuantity = useCallback(
    async (bookId: number, quantity: number | string) => {
      try {
        const qty = Number(quantity)
        if (Number.isNaN(qty)) {
          console.warn('updateQuantity called with invalid quantity', quantity)
          return false
        }

        if (qty <= 0) {
          return removeFromCart(bookId)
        }

        const newCart = cart.map((item) =>
          item.id === bookId ? { ...item, quantity: qty } : item
        )
        await saveCart(newCart)
        return true
      } catch (error) {
        console.error('Error al actualizar cantidad:', error)
        return false
      }
    },
    [cart, saveCart, removeFromCart]
  )

  // Vaciar carrito
  const clearCart = useCallback(async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      await saveCart([])
      return true
    } catch (error) {
      console.error('Error al vaciar carrito:', error)
      return false
    }
  }, [saveCart])

  // Calcular total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    total,
  }
}
