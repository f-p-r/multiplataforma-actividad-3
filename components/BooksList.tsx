// components/BooksList.tsx - Lista de libros con FlatList tipada
import React from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { type Book } from '../services/api'
import BookCard from './BookCard'

interface BooksListProps {
  books?: Book[]
  loading?: boolean
  error?: unknown
  onBookPress: (book: Book) => void
}

export default function BooksList({ books = [], loading = false, error, onBookPress }: BooksListProps) {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-2">Cargando libros…</Text>
      </View>
    )
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : 'Error al cargar los libros'
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-red-600 text-center">{errorMessage}</Text>
      </View>
    )
  }

  if (!books || books.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-gray-600">No hay libros disponibles</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => (
        <View className="w-full mb-4">
          <BookCard book={item} onPress={() => onBookPress(item)} />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={1}
      scrollEnabled={true}
      // Padding para que los items no toquen los bordes y proporcionar espacio inferior
      contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8, paddingBottom: 32 }}
    />
  )
}
