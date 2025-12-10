// app/(tabs)/faq.tsx - Preguntas Frecuentes
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: '¿Cuáles son los métodos de pago disponibles?',
    answer: 'Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), transferencia bancaria, PayPal y Apple Pay. Todos los pagos se procesan de forma segura con encriptación SSL.'
  },
  {
    id: 2,
    question: '¿Cuánto tiempo tarda en llegar mi pedido?',
    answer: 'Los pedidos se envían dentro de 24-48 horas hábiles. El tiempo de entrega depende de tu ubicación: dentro de la península (3-5 días), islas (5-7 días), e internacional (7-15 días).'
  },
  {
    id: 3,
    question: '¿Hay gastos de envío?',
    answer: 'El envío es completamente GRATIS para todos los pedidos sin importar el monto. Incluye tracking para que puedas seguir tu compra en tiempo real.'
  },
  {
    id: 4,
    question: '¿Puedo cambiar o cancelar mi pedido?',
    answer: 'Puedes cancelar tu pedido dentro de las primeras 2 horas después de realizar la compra. Para cambios, contacta con nuestro equipo de atención al cliente. Los pedidos ya enviados tienen un plazo de devolución de 30 días.'
  },
  {
    id: 5,
    question: '¿Cómo funciona la devolución de libros?',
    answer: 'Si el libro llega dañado o no es lo que esperabas, puedes devolverlo dentro de 30 días sin preguntas. Cubrimos los costos de envío de retorno. El reembolso se procesa en 5-7 días hábiles.'
  },
  {
    id: 6,
    question: '¿Tienen ediciones en tapa dura y rústica?',
    answer: 'Algunos títulos están disponibles en múltiples formatos. Filtra por formato en la búsqueda avanzada o contacta al servicio técnico para disponibilidad específica.'
  },
  {
    id: 7,
    question: '¿Hacen envíos internacionales?',
    answer: 'Sí, hacemos envíos a más de 150 países. Los costos y tiempos varían según el destino. Aplican aranceles según la legislación local.'
  },
  {
    id: 8,
    question: '¿Hay descuentos por cantidad?',
    answer: 'Para compras en grandes cantidades (más de 50 libros), contacta directamente con nuestro equipo de ventas corporativas para obtener presupuestos especiales.'
  },
  {
    id: 9,
    question: '¿Cómo puedo recuperar mi contraseña?',
    answer: 'En la pantalla de login, haz clic en "¿Olvidaste tu contraseña?" e ingresa tu email. Recibirás un enlace para restablecerla en los próximos minutos.'
  },
  {
    id: 10,
    question: '¿Cómo contacto con soporte?',
    answer: 'Puedes escribirnos a support@nexus.es, llamar al +34 900 123 456 (lunes a viernes, 9-18h), o usar el chat en vivo disponible en la web.'
  },
]

export default function FAQScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const FAQItem = ({ item }: { item: FAQItem }) => {
    const isExpanded = expandedId === item.id

    return (
      <View
        className="mb-3 border border-gray-200 rounded-lg overflow-hidden bg-white"
      >
        <Pressable
          onPress={() => toggleExpand(item.id)}
          className={`flex-row justify-between items-center px-4 py-4 ${isExpanded ? 'bg-blue-50' : 'bg-white'}`}
        >
          <Text
            className="flex-1 text-sm font-semibold text-gray-900 mr-3"
            numberOfLines={2}
          >
            {item.question}
          </Text>
          <MaterialIcons
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color="#2563EB"
          />
        </Pressable>

        {isExpanded && (
          <View
            className="px-4 py-3 border-t border-gray-200 bg-gray-50"
          >
            <Text className="text-gray-700 text-sm leading-6">
              {item.answer}
            </Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header simplificado */}
        <View className="bg-white px-4 py-6">
          <Text className="text-gray-900 text-lg font-semibold">
            Encuentra respuestas a las preguntas más comunes
          </Text>
        </View>

        {/* FAQ Items */}
        <View className="px-4 py-6">
          {faqData.map((item) => (
            <FAQItem key={item.id} item={item} />
          ))}

          {/* Contact Section */}
          <View
            className="mt-8 mb-8 bg-yellow-50 rounded-lg p-4 border-l-4 border-l-amber-400"
          >
            <Text className="text-base font-bold text-gray-900 mb-2">
              ¿No encuentras lo que buscas?
            </Text>
            <Text className="text-gray-700 text-sm mb-3">
              Nuestro equipo de soporte está disponible para ayudarte.
            </Text>
            <Text className="text-yellow-900 text-xs font-semibold">
              📧 support@nexus.es
            </Text>
            <Text className="text-yellow-900 text-xs font-semibold mt-1">
              📞 +34 900 123 456 (L-V 9-18h)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
