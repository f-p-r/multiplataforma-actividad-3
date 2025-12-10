// services/api.ts - Adaptado para React Native con tipos
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://lawebdeperez.es/apifpr',
  headers: { 'Content-Type': 'application/json' },
})

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type ApiParams = Record<string, any>

// Tipado básico de libro (campos usados en la app)
export interface Book {
  id: number
  title: string
  price: number
  description?: string
  author?: { id: number; name: string } | string
  publisher?: { id: number; name: string } | string
  category?: { id: number; name: string } | string
  isbn?: string
  year?: number
  rating?: number
  stock?: number
  new?: boolean
  bestSeller?: boolean | number
}

async function apiRequest<T = any>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body: any = null,
  params?: ApiParams
): Promise<T> {
  try {
    const response = await api.request<T>({
      url: endpoint,
      method,
      data: body,
      params,
    })
    return response.data
  } catch (error: any) {
    console.error(`❌ Error en ${endpoint}:`, error?.response?.status, error?.response?.data)
    throw error
  }
}

// ------------------------------------------------------
// 📚 Funciones específicas de acceso a la API
// ------------------------------------------------------

export const getBooks = (params: ApiParams = {}) => apiRequest<Book[]>('/books', 'GET', null, params)
export const getBookById = (id: string | number) => apiRequest<Book>(`/books/${id}`)
export const getAuthors = () => apiRequest('/authors')
export const getCategories = () => apiRequest('/categories')
export const getPublishers = () => apiRequest('/publishers')
export const getReviewsByBook = (bookId: string | number) => apiRequest('/reviews/search', 'GET', null, { bookId })
export const getLibraryInfo = () => apiRequest('/library')

// 🖼️ URLs completas para imágenes (React Native necesita URLs absolutas)
// Estructura de servidor:
// - landing.jpg (imagen principal)
// - carrusel/ (imágenes de carrusel)
// - portadas/ (portadas de libros)

export const getCoverImagePath = (bookId: string | number) => {
  return `https://lawebdeperez.es/apifpr/img/portadas/${bookId}.jpg`
}

export const getCarouselImagePath = (index: number) => {
  return `https://lawebdeperez.es/apifpr/img/carrusel/${index}.jpg`
}

export const getLandingImagePath = () => {
  return 'https://lawebdeperez.es/apifpr/img/landing.jpg'
}
