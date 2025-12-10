// hooks/useHapticFeedback.ts - Hook para feedback háptico
import * as Haptics from 'expo-haptics'

/**
 * Hook para proporcionar feedback háptico en diferentes contextos
 */
export function useHapticFeedback() {
  // Vibración de éxito (p.ej., login, añadir al carrito)
  const triggerSuccess = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch (error) {
      console.error('Haptic error:', error)
    }
  }

  // Vibración de error
  const triggerError = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } catch (error) {
      console.error('Haptic error:', error)
    }
  }

  // Vibración de aviso
  const triggerWarning = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    } catch (error) {
      console.error('Haptic error:', error)
    }
  }

  // Vibración táctil ligera (feedback general)
  const triggerLight = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch (error) {
      console.error('Haptic error:', error)
    }
  }

  return {
    triggerSuccess,
    triggerError,
    triggerWarning,
    triggerLight,
  }
}
