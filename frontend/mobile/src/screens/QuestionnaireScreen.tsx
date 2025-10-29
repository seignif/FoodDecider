import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, QuestionnaireAnswers } from '../types';
import apiService from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Questionnaire'>;

export default function QuestionnaireScreen({ navigation }: Props) {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!answers.wantToCook || !answers.timeAvailable || !answers.budget || !answers.mealTime) {
            Alert.alert('Erreur', 'Veuillez répondre à toutes les questions');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.generateSuggestions(answers as QuestionnaireAnswers);
            if (response.success && response.data) {
                navigation.navigate('Results', { answers: answers as QuestionnaireAnswers });
            } else {
                Alert.alert('Erreur', response.error || 'Une erreur est survenue');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de contacter le serveur');
        } finally {
            setLoading(false);
        }
    };

    const renderQuestion = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionTitle}>Tu veux cuisiner ou commander ? 🍳</Text>
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                answers.wantToCook === true && styles.optionButtonSelected,
                            ]}
                            onPress={() => setAnswers({ ...answers, wantToCook: true })}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    answers.wantToCook === true && styles.optionTextSelected,
                                ]}
                            >
                                🍳 Je veux cuisiner
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                answers.wantToCook === false && styles.optionButtonSelected,
                            ]}
                            onPress={() => setAnswers({ ...answers, wantToCook: false })}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    answers.wantToCook === false && styles.optionTextSelected,
                                ]}
                            >
                                🛵 Je veux commander
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            case 2:
                return (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionTitle}>Combien de temps as-tu ? ⏱️</Text>
                        {[
                            { label: '10 min - Rapide', value: 10 },
                            { label: '30 min - Moyen', value: 30 },
                            { label: '60 min+ - Pas pressé', value: 60 },
                        ].map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionButton,
                                    answers.timeAvailable === option.value && styles.optionButtonSelected,
                                ]}
                                onPress={() => setAnswers({ ...answers, timeAvailable: option.value })}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        answers.timeAvailable === option.value && styles.optionTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            case 3:
                return (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionTitle}>Quel est ton budget ? 💰</Text>
                        {[
                            { label: '€ - Économique', value: 'low' },
                            { label: '€€ - Moyen', value: 'medium' },
                            { label: '€€€ - Pas de limite', value: 'high' },
                        ].map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionButton,
                                    answers.budget === option.value && styles.optionButtonSelected,
                                ]}
                                onPress={() =>
                                    setAnswers({
                                        ...answers,
                                        budget: option.value as 'low' | 'medium' | 'high',
                                    })
                                }
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        answers.budget === option.value && styles.optionTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            case 4:
                return (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionTitle}>C'est pour quel moment ? 🕐</Text>
                        {[
                            { label: '🌅 Petit-déjeuner', value: 'breakfast' },
                            { label: '☀️ Déjeuner', value: 'lunch' },
                            { label: '🌙 Dîner', value: 'dinner' },
                            { label: '🍿 Snack', value: 'snack' },
                        ].map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionButton,
                                    answers.mealTime === option.value && styles.optionButtonSelected,
                                ]}
                                onPress={() =>
                                    setAnswers({
                                        ...answers,
                                        mealTime: option.value as 'breakfast' | 'lunch' | 'dinner' | 'snack',
                                    })
                                }
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        answers.mealTime === option.value && styles.optionTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            default:
                return null;
        }
    };

    const isStepComplete = () => {
        switch (step) {
            case 1:
                return answers.wantToCook !== undefined;
            case 2:
                return answers.timeAvailable !== undefined;
            case 3:
                return answers.budget !== undefined;
            case 4:
                return answers.mealTime !== undefined;
            default:
                return false;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4].map((s) => (
                        <View
                            key={s}
                            style={[styles.progressDot, s <= step && styles.progressDotActive]}
                        />
                    ))}
                </View>

                {/* Question */}
                {renderQuestion()}

                {/* Navigation Buttons */}
                <View style={styles.buttonContainer}>
                    {step > 1 && (
                        <TouchableOpacity
                            style={[styles.navButton, styles.backButton]}
                            onPress={() => setStep(step - 1)}
                        >
                            <Text style={styles.backButtonText}>Retour</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.navButton,
                            styles.nextButton,
                            !isStepComplete() && styles.nextButtonDisabled,
                        ]}
                        onPress={handleNext}
                        disabled={!isStepComplete() || loading}
                    >
                        <Text style={styles.nextButtonText}>
                            {loading ? 'Chargement...' : step === 4 ? 'Voir les suggestions' : 'Suivant'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#ddd',
        marginHorizontal: 5,
    },
    progressDotActive: {
        backgroundColor: '#FF6B6B',
    },
    questionContainer: {
        marginBottom: 40,
    },
    questionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    optionButton: {
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    optionButtonSelected: {
        borderColor: '#FF6B6B',
        backgroundColor: '#FFF5F5',
    },
    optionText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    optionTextSelected: {
        color: '#FF6B6B',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    navButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 25,
        marginHorizontal: 5,
    },
    backButton: {
        backgroundColor: '#F5F5F5',
    },
    backButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#FF6B6B',
    },
    nextButtonDisabled: {
        backgroundColor: '#FFB6B6',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});