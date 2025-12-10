// components/BookCard.tsx - Tarjeta de libro tipada para React Native
import formatPrice from '@/utils/formatPrice'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { getCoverImagePath, type Book } from '../services/api'
import BookImage from './BookImage'

interface BookCardProps {
  book: Book
  onPress?: () => void
}

export default function BookCard({ book, onPress }: BookCardProps) {
  const authorName = typeof book.author === 'object' ? book.author?.name : book.author
  const publisherName = typeof book.publisher === 'object' ? book.publisher?.name : book.publisher

  const isNew = Boolean(book.new)
  const isBestseller = Boolean(book.bestSeller && book.bestSeller !== 0)

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-lg mb-4 py-3 shadow-sm"
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        elevation: 2,
      })}
    >
      {/* Wrapper con flex layout y márgenes laterales */}
      <View className="flex-row items-start gap-3.5">
        {/* Imagen a la izquierda: 25% del ancho */}
        <View style={{ flex: 0.4 }} className="justify-start">
          <BookImage
            source={{ uri: getCoverImagePath(book.id) }}
            style={{ width: '100%', aspectRatio: 2 / 3, borderRadius: 8 }}
            resizeMode="cover"
            bookTitle={book.title}
          />
        </View>

        {/* Detalles a la derecha: */}
        <View style={{ flex: 0.6 }} className="justify-start">
          <Text className="text-base font-bold text-gray-900 mb-1.5" numberOfLines={2}>
            {book.title}
          </Text>

          <Text className="text-sm text-gray-500 mb-1" numberOfLines={1}>
            {authorName || 'Autor desconocido'}
          </Text>

          <Text className="text-sm text-gray-500 mb-2" numberOfLines={1}>
            {publisherName || ''}
          </Text>

          <Text className="text-base font-bold text-blue-600">
            {formatPrice(book.price)}
          </Text>

          {/* Badges debajo del precio */}
          <View className="flex-row gap-2 mt-2">
            {isNew ? (
              <View className="bg-red-500 rounded-lg px-2 py-1">
                <Text className="text-white text-xs font-black">NUEVO</Text>
              </View>
            ) : null}
            {isBestseller ? (
              <View className="bg-amber-400 rounded-lg px-2 py-1">
                <Text className="text-white text-xs font-black">MÁS VENDIDO</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  )
}
