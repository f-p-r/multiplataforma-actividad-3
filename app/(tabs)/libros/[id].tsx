// app/(tabs)/libros/[id].tsx - Pantalla de detalle del libro
import { getBookById, getCoverImagePath, type Book } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'

import BookImage from '@/components/BookImage'
import { useAuth } from '@/context/AuthContext'
import useCart from '@/hooks/useCart'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import formatPrice from '@/utils/formatPrice'

export default function LibroDetalleScreen() {
  const { id } = useLocalSearchParams()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart() as any
  const { triggerSuccess, triggerError } = useHapticFeedback()

  const loadBook = useCallback(async () => {
    try {
      setLoading(true)
      if (id) {
        const bookIdStr = Array.isArray(id) ? id[0] : id
        const data = await getBookById(bookIdStr)
        setBook(data)
      }
    } catch (err) {
      setError(err as Error)
      console.error('Error loading book:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadBook()
  }, [loadBook])

  const handleAddToCart = async () => {
    if (!book) return

    // Si no hay usuario, guardar el libro pendiente y redirigir a login
    if (!user) {
      await AsyncStorage.setItem('pendingBookToAdd', JSON.stringify(book))
      // Guardar la ruta desde donde viene el usuario
      await AsyncStorage.setItem('returnRoute', '/(tabs)/libros/lista')
      Alert.alert(
        'Inicia sesión',
        'Necesitas iniciar sesión para añadir libros al carrito',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => router.push('/auth/login') },
        ]
      )
      return
    }

    const success = await addToCart(book)
    if (success) {
      await triggerSuccess()
      Alert.alert(
        'Éxito',
        `"${book.title}" ha sido añadido a tu carrito`,
        [
          { text: 'Seguir comprando', onPress: () => router.back() },
          { text: 'Ir al carrito', onPress: () => router.push('/(tabs)/carrito') },
        ]
      )
    } else {
      await triggerError()
      Alert.alert('Error', 'No se pudo añadir el libro al carrito')
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-2">Cargando detalle del libro…</Text>
      </SafeAreaView>
    )
  }

  if (error || !book) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-red-600 text-center mb-4">
          Error al cargar el libro
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen de portada */}
        <View className="bg-gray-100 py-8 px-4 items-center">
          <BookImage
            source={{ uri: getCoverImagePath(book.id) }}
            style={{ width: 160, height: 256, borderRadius: 8 }}
            resizeMode="cover"
            bookTitle={book.title}
          />
        </View>

        {/* Información del libro */}
        <View className="px-4 py-6">
          {/* Título */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {book.title}
          </Text>

          {/* Autor */}
          <Text className="text-gray-600 text-base mb-4">
            <Text className="font-semibold">{typeof book.author === 'object' ? book.author.name : book.author}</Text>
          </Text>

          {/* Badges */}
          <View className="flex-row gap-2 mb-4">
            {(book.bestSeller || book.bestSeller === 1) ? (
              <View className="bg-amber-400 rounded-lg px-2.5 py-1.5">
                <Text className="text-white text-xs font-black">MÁS VENDIDO</Text>
              </View>
            ) : null}
            {book.new ? (
              <View className="bg-red-500 rounded-lg px-2.5 py-1.5">
                <Text className="text-white text-xs font-black">NUEVO</Text>
              </View>
            ) : null}
          </View>

          {/* Precio */}
          <View className="bg-blue-50 rounded-lg p-4 mb-6 flex-row items-center justify-between">
            <Text className="text-gray-700 font-semibold">Precio:</Text>
            <Text className="text-3xl font-bold text-blue-600">
              {formatPrice(book.price)}
            </Text>
          </View>

          {/* Editorial y otros datos */}
          <View className="mb-6">
            <InfoRow label="Editorial" value={typeof book.publisher === 'object' ? book.publisher?.name : book.publisher} />
            <InfoRow label="Categoría" value={typeof book.category === 'object' ? book.category?.name : book.category} />
            <InfoRow label="ISBN" value={book.isbn} />
            {book.year && (
              <InfoRow label="Año de publicación" value={book.year.toString()} />
            )}
          </View>

          {/* Descripción */}
          {book.description && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Descripción
              </Text>
              <Text className="text-gray-700 leading-6 text-justify">
                {book.description}
              </Text>
            </View>
          )}

          {/* Reseñas/Valoración */}
          {book.rating && (
            <View className="bg-yellow-50 rounded-lg p-4 mb-8">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                ⭐ Valoración: {book.rating}/5
              </Text>
              <Text className="text-sm text-gray-600">
                Basado en reseñas de usuarios
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón de compra */}
      <View className="px-4 py-6 border-t border-gray-200 bg-white">
        <Pressable 
          onPress={handleAddToCart}
          className="bg-blue-600 rounded-lg py-4 items-center"
        >
          <Text className="font-semibold text-white text-base">
            Añadir al carrito
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-gray-100">
      <Text className="text-gray-600">{label}</Text>
      <Text className="font-semibold text-gray-900 flex-1 text-right ml-2">
        {value || 'No disponible'}
      </Text>
    </View>
  )
}

