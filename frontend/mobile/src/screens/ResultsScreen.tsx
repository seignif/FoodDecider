import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Suggestion } from '../types';
import apiService from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
    const { answers } = route.params;
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await apiService.generateSuggestions(answers);
            if (response.success && response.data) {
                setSuggestions(response.data.suggestions);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de charger les suggestions');
        } finally {
            setLoading(false);
        }
    };

    const renderSuggestionCard = (suggestion: Suggestion) => (
        <View key={suggestion.id} style={styles.card}>
            <Image source={{ uri: suggestion.image }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.mealName}>{suggestion.name}</Text>
                <Text style={styles.description}>{suggestion.description}</Text>

                <View style={styles.infoRow}>
                    {suggestion.cookingTime && (
                        <View style={styles.infoItem}>
                            <Text style={styles.infoEmoji}>⏱️</Text>
                            <Text style={styles.infoText}>{suggestion.cookingTime} min</Text>
                        </View>
                    )}
                    {suggestion.difficulty && (
                        <View style={styles.infoItem}>
                            <Text style={styles.infoEmoji}>📊</Text>
                            <Text style={styles.infoText}>{suggestion.difficulty}</Text>
                        </View>
                    )}
                    {suggestion.rating && (
                        <View style={styles.infoItem}>
                            <Text style={styles.infoEmoji}>⭐</Text>
                            <Text style={styles.infoText}>{suggestion.rating}/5</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelectMeal(suggestion)}
                >
                    <Text style={styles.selectButtonText}>Choisir ce plat</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleSelectMeal = async (suggestion: Suggestion) => {
        Alert.alert(
            suggestion.name,
            'Que voulez-vous faire ?',
            [
                {
                    text: 'Voir la recette',
                    onPress: () => {
                        // Open URL or navigate to recipe details
                        Alert.alert('Info', `Lien vers la recette : ${suggestion.url}`);
                    },
                },
                {
                    text: 'Sauvegarder',
                    onPress: async () => {
                        try {
                            await apiService.saveToHistory({
                                mealType: suggestion.type,
                                mealId: suggestion.id,
                                mealName: suggestion.name,
                                mealImage: suggestion.image,
                                cookingTime: suggestion.cookingTime,
                                budget: suggestion.budget,
                            });
                            Alert.alert('Succès', 'Plat sauvegardé dans l\'historique !');
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de sauvegarder');
                        }
                    },
                },
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.loadingText}>Recherche de suggestions...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Voici vos suggestions ! 🎉</Text>
                    <Text style={styles.headerSubtitle}>
                        {suggestions.length} plat{suggestions.length > 1 ? 's' : ''} trouvé
                        {suggestions.length > 1 ? 's' : ''}
                    </Text>
                </View>

                {suggestions.map((suggestion) => renderSuggestionCard(suggestion))}

                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.retryButtonText}>← Refaire le questionnaire</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#F0F0F0',
    },
    cardContent: {
        padding: 20,
    },
    mealName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    infoEmoji: {
        fontSize: 16,
        marginRight: 5,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
    },
    selectButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    selectButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    retryButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    retryButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});