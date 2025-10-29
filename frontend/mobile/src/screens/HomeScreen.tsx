import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>🍽️</Text>
                    <Text style={styles.title}>FoodDecider</Text>
                    <Text style={styles.subtitle}>
                        Vous ne savez pas quoi manger ? On vous aide à décider !
                    </Text>
                </View>

                {/* Main Button */}
                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={() => navigation.navigate('Questionnaire')}
                >
                    <Text style={styles.mainButtonText}>Commencer</Text>
                    <Text style={styles.mainButtonEmoji}>🎯</Text>
                </TouchableOpacity>

                {/* Secondary Buttons */}
                <View style={styles.secondaryButtons}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.secondaryButtonText}>Se connecter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, styles.registerButton]}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={[styles.secondaryButtonText, styles.registerButtonText]}>
                            S'inscrire
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Features */}
                <View style={styles.features}>
                    <View style={styles.feature}>
                        <Text style={styles.featureEmoji}>⚡</Text>
                        <Text style={styles.featureText}>Rapide et simple</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureEmoji}>🎨</Text>
                        <Text style={styles.featureText}>Personnalisé</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureEmoji}>💡</Text>
                        <Text style={styles.featureText}>Suggestions intelligentes</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    mainButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mainButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
    },
    mainButtonEmoji: {
        fontSize: 24,
    },
    secondaryButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: '#FF6B6B',
    },
    registerButton: {
        backgroundColor: '#FF6B6B',
    },
    secondaryButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    registerButtonText: {
        color: '#fff',
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    feature: {
        alignItems: 'center',
        flex: 1,
    },
    featureEmoji: {
        fontSize: 30,
        marginBottom: 8,
    },
    featureText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});