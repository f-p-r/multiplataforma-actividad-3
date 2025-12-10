// components/BookImage.tsx - Imagen de libro con fallback tipado
import React, { useState } from 'react'
import {
    Image,
    Text,
    View,
    type ImageResizeMode,
    type ImageSourcePropType,
    type ImageStyle,
    type StyleProp,
} from 'react-native'

interface BookImageProps {
  source: ImageSourcePropType
  style?: StyleProp<ImageStyle>
  resizeMode?: ImageResizeMode
  bookTitle?: string
}

export default function BookImage({
  source,
  style,
  resizeMode = 'cover',
  bookTitle = 'Libro',
}: BookImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <View
        style={[
          style,
          {
            backgroundColor: '#BFDBFE',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 8,
          },
        ]}
      >
        <Text style={{ fontSize: 32, textAlign: 'center' }}>📚</Text>
        <Text
          style={{
            color: '#1E40AF',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 10,
            marginTop: 8,
          }}
          numberOfLines={2}
        >
          {bookTitle}
        </Text>
      </View>
    )
  }

  return <Image source={source} style={style} resizeMode={resizeMode} onError={() => setImageError(true)} />
}
