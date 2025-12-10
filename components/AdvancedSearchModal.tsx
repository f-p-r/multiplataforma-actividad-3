// components/AdvancedSearchModal.tsx - Modal de búsqueda avanzada de libros
import { getAuthors, getCategories, getPublishers } from '@/services/api'
import { Picker } from '@react-native-picker/picker'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'

interface AdvancedSearchModalProps {
  visible: boolean
  onClose: () => void
  onSearch: (filters: SearchFilters) => void
}

interface SearchFilters {
  title?: string
  authorId?: string
  categoryId?: string
  publisherId?: string
  new?: number
  bestSeller?: number
}

interface Author {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

interface Publisher {
  id: number
  name: string
}

export default function AdvancedSearchModal({
  visible,
  onClose,
  onSearch,
}: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    title: '',
    authorId: '',
    categoryId: '',
    publisherId: '',
  })

  const [showNovedades, setShowNovedades] = useState(false)
  const [showBestSellers, setShowBestSellers] = useState(false)

  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (visible) {
      setLoading(true)
      setError(null)
      Promise.all([getAuthors(), getCategories(), getPublishers()])
        .then(([a, c, p]) => {
          setAuthors(a as Author[])
          setCategories(c as Category[])
          setPublishers(p as Publisher[])
        })
        .catch((err) => {
          console.error('Error loading search options:', err)
          setError('Error al cargar opciones de búsqueda')
        })
        .finally(() => setLoading(false))
    }
  }, [visible])

  const handleSearch = () => {
    // Construir filtros activos (excluir valores vacíos)
    const activeFilters: SearchFilters = {}

    if (filters.title?.trim()) activeFilters.title = filters.title.trim()
    if (filters.authorId) activeFilters.authorId = filters.authorId
    if (filters.categoryId) activeFilters.categoryId = filters.categoryId
    if (filters.publisherId) activeFilters.publisherId = filters.publisherId
    if (showNovedades) activeFilters.new = 1
    if (showBestSellers) activeFilters.bestSeller = 1

    onSearch(activeFilters)
    onClose()
  }

  const handleClear = () => {
    setFilters({
      title: '',
      authorId: '',
      categoryId: '',
      publisherId: '',
    })
    setShowNovedades(false)
    setShowBestSellers(false)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View
        className="flex-1 justify-center px-5"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      >
        <View
          className="bg-white rounded-xl p-5"
          style={{ maxHeight: '90%' }}
        >
          {/* Header */}
          <Text
            className="text-xl font-bold text-gray-900 mb-4 text-center"
          >
            🔎 Búsqueda avanzada
          </Text>

          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#2563EB" />
              <Text className="text-gray-600 mt-2">
                Cargando opciones...
              </Text>
            </View>
          ) : error ? (
            <View className="py-8 items-center">
              <Text className="text-red-600 text-center">{error}</Text>
              <Pressable
                onPress={onClose}
                className="mt-4 px-6 py-2 bg-gray-300 rounded"
              >
                <Text className="font-semibold text-gray-700">Cerrar</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Campo título */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                  Título contiene:
                </Text>
                <TextInput
                  placeholder="Escribe parte del título..."
                  value={filters.title}
                  onChangeText={(v) => setFilters({ ...filters, title: v })}
                  className="border border-gray-300 p-3 rounded-lg text-base bg-gray-50"
                />
              </View>

              {/* Picker autor */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                  Autor:
                </Text>
                <View
                  className="border border-gray-300 rounded-lg bg-gray-50"
                >
                  <Picker
                    selectedValue={filters.authorId}
                    onValueChange={(v) => setFilters({ ...filters, authorId: v as string })}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Todos los autores" value="" />
                    {authors.map((a) => (
                      <Picker.Item key={a.id} label={a.name} value={a.id.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Picker categoría */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                  Categoría:
                </Text>
                <View
                  className="border border-gray-300 rounded-lg bg-gray-50"
                >
                  <Picker
                    selectedValue={filters.categoryId}
                    onValueChange={(v) => setFilters({ ...filters, categoryId: v as string })}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Todas las categorías" value="" />
                    {categories.map((c) => (
                      <Picker.Item key={c.id} label={c.name} value={c.id.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Picker editorial */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                  Editorial:
                </Text>
                <View
                  className="border border-gray-300 rounded-lg bg-gray-50"
                >
                  <Picker
                    selectedValue={filters.publisherId}
                    onValueChange={(v) => setFilters({ ...filters, publisherId: v as string })}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Todas las editoriales" value="" />
                    {publishers.map((p) => (
                      <Picker.Item key={p.id} label={p.name} value={p.id.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Checkboxes */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Filtros especiales:
                </Text>
                
                {/* Checkbox Novedades */}
                <Pressable
                  onPress={() => setShowNovedades(!showNovedades)}
                  className={`flex-row items-center py-2.5 px-3 rounded-lg mb-2 border ${
                    showNovedades ? 'bg-blue-50 border-blue-600' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <View
                    className={`w-6 h-6 rounded border-2 justify-center items-center mr-3 ${
                      showNovedades ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                    }`}
                  >
                    {showNovedades && (
                      <Text className="text-white text-base font-bold">✓</Text>
                    )}
                  </View>
                  <Text className="text-base text-gray-700 flex-1">
                    Solo novedades
                  </Text>
                </Pressable>

                {/* Checkbox Más vendidos */}
                <Pressable
                  onPress={() => setShowBestSellers(!showBestSellers)}
                  className={`flex-row items-center py-2.5 px-3 rounded-lg border ${
                    showBestSellers ? 'bg-blue-50 border-blue-600' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <View
                    className={`w-6 h-6 rounded border-2 justify-center items-center mr-3 ${
                      showBestSellers ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                    }`}
                  >
                    {showBestSellers && (
                      <Text className="text-white text-base font-bold">✓</Text>
                    )}
                  </View>
                  <Text className="text-base text-gray-700 flex-1">
                    Solo más vendidos
                  </Text>
                </Pressable>
              </View>

              {/* Botones de acción */}
              <View className="flex-row gap-3 mt-2">
                <Pressable
                  onPress={handleClear}
                  className="flex-1 p-3.5 bg-gray-300 rounded items-center"
                >
                  <Text className="font-semibold text-gray-700">Limpiar</Text>
                </Pressable>
                <Pressable
                  onPress={onClose}
                  className="flex-1 p-3.5 bg-gray-200 rounded items-center"
                >
                  <Text className="font-semibold text-gray-700">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleSearch}
                  className="flex-1 p-3.5 bg-blue-600 rounded items-center"
                >
                  <Text className="font-semibold text-white">Buscar</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  )
}
