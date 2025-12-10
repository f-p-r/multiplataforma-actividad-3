import React from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View
} from 'react-native';
import { useFonts, Playfair_700Bold } from '@expo-google-fonts/playfair';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    onPress?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onPress }) => {
    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
    };

    return (
        <Pressable onPress={handlePress} className="active:opacity-70">
            <View className="bg-gray-100 rounded-lg p-4 mb-3">
                <View className="flex-row items-center mb-2">
                    <Text className="text-2xl mr-3">{icon}</Text>
                    <Text className="text-base font-bold text-gray-800">
                        {title}
                    </Text>
                </View>
                <Text className="text-gray-600 text-sm leading-5">
                    {description}
                </Text>
            </View>
        </Pressable>
    );
};

export default function HomeScreen() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        Playfair_700Bold,
        SpaceMono_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="px-4 py-6 bg-white">
                        {/* Sección de bienvenida */}
                        <View className="bg-blue-50 rounded-lg p-6 mb-6">
                            <Text style={{ fontFamily: 'Playfair_700Bold', fontSize: 36, color: '#1F2937', marginBottom: 12 }}>
                                Bienvenido a Nexus
                            </Text>
                            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 14, lineHeight: 20, color: '#374151' }}>
                                Nexus es tu punto de encuentro diseñado para estudiantes,
                                jóvenes profesionales y docentes. Un espacio multifuncional que
                                integra librería universitaria, coworking y cafetería.
                            </Text>
                        </View>

                        {/* Descripción */}
                        <View className="mb-8">
                            <Text className="text-lg font-bold text-gray-800 mb-3">
                                ¿Qué ofrecemos?
                            </Text>

                            <View>
                                <FeatureCard
                                    icon="📚"
                                    title="Catálogo Completo"
                                    description="Acceso a miles de libros universitarios y profesionales"
                                    onPress={() => router.push('/(tabs)/libros' as any)}
                                />

                                <View className="bg-gray-100 rounded-lg p-4 mb-3">
                                    <View className="flex-row items-center mb-2">
                                        <Text className="text-2xl mr-3">🛒</Text>
                                        <Text className="text-base font-bold text-gray-800">
                                            Compra Fácil
                                        </Text>
                                    </View>
                                    <Text className="text-gray-600 text-sm leading-5">
                                        Carrito intuitivo y proceso de compra seguro
                                    </Text>
                                </View>

                                <View className="bg-gray-100 rounded-lg p-4 mb-3">
                                    <View className="flex-row items-center mb-2">
                                        <Text className="text-2xl mr-3">👥</Text>
                                        <Text className="text-base font-bold text-gray-800">
                                            Comunidad
                                        </Text>
                                    </View>
                                    <Text className="text-gray-600 text-sm leading-5">
                                        Conecta con otros estudiantes y profesionales
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
