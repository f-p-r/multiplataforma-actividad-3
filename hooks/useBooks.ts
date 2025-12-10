// hooks/useBooks.ts - Adaptado para React Native
import { useEffect, useState } from 'react'
import { getBooks } from '@/services/api'

interface UseBookParams {
  [key: string]: any
}

/**
 * Hook para cargar libros según filtros.
 * @param {object} filters – objeto de filtros para la carga de libros
 * @returns {object} { books, loading, error, refetch }
 */
export default function useBooks(filters: UseBookParams = {}) {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBooks(filters)
      setBooks(data || [])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  return { books, loading, error, refetch: fetchBooks }
}
