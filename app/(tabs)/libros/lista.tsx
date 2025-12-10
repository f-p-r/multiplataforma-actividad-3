// app/(tabs)/libros/lista.tsx - Pantalla de catálogo de libros
import AdvancedSearchModal from '@/components/AdvancedSearchModal'
import BooksList from '@/components/BooksList'
import useBooks from '@/hooks/useBooks'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  Text,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export default function LibrosListaScreen() {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchFilters, setSearchFilters] = useState<any>({})
  const router = useRouter()
  const navigation = useNavigation()
  const { triggerLight } = useHapticFeedback()

  // Cargamos libros combinando búsqueda avanzada
  const params = {
    ...searchFilters,
  }
  const { books, loading, error, refetch } = useBooks(params) as any

  const handleBookPress = async (book: any) => {
    await triggerLight()
    router.push(`/(tabs)/libros/${book.id}` as any)
  }

  const handleAdvancedSearch = async (filters: any) => {
    await triggerLight()
    setSearchFilters(filters)
  }

  // Configurar botón de búsqueda en el header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setShowSearchModal(true)}
          style={{ marginRight: 16 }}
        >
          <MaterialIcons name="search" size={24} color="#ffffff" />
        </Pressable>
      ),
    } as any)
  }, [navigation])

  // Abrir modal de búsqueda cuando ?search=1 está presente en la URL
  const paramsLocal = useLocalSearchParams()
  useEffect(() => {
    if (paramsLocal?.search === '1') {
      setShowSearchModal(true)
      // eliminar el parámetro de consulta para que no se reabra repetidamente
      // reemplazar ruta sin parámetros
      try {
        // usar router para reemplazar la ruta actual sin query
        router.replace('/(tabs)/libros/lista');
      } catch {
        // ignorar
      }
    }
  }, [paramsLocal?.search])

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {loading ? (
        <View className="py-8 items-center bg-white">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-600 mt-2">Cargando libros…</Text>
        </View>
      ) : error ? (
        <View className="py-8 items-center bg-white">
          <Text className="text-red-600 text-center mb-4">
            Error al cargar los libros
          </Text>
          <Pressable
            onPress={refetch}
            className="bg-blue-600 px-6 py-2 rounded"
          >
            <Text className="text-white font-semibold">
              Reintentar
            </Text>
          </Pressable>
        </View>
      ) : books && books.length > 0 ? (
        <BooksList
          books={books}
          loading={false}
          error={null}
          onBookPress={handleBookPress}
        />
      ) : (
        <View className="py-8 items-center bg-white">
          <Text className="text-gray-600">
            No hay libros disponibles
          </Text>
        </View>
      )}

      {/* Modal de búsqueda avanzada */}
      <AdvancedSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleAdvancedSearch}
      />
    </SafeAreaView>
  )
}

