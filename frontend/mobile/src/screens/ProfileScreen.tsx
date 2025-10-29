import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import apiService from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

interface UserProfile {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
}

export default function ProfileScreen({ navigation }: Props) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiService.getProfile();
            if (response.success && response.data) {
                setProfile(response.data);
            } else {
                Alert.alert('Erreur', 'Impossible de charger le profil');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Vous devez être connecté pour accéder à votre profil', [
                {
                    text: 'Se connecter',
                    onPress: () => navigation.navigate('Login'),
                },
                {
                    text: 'Annuler',
                    onPress: () => navigation.navigate('Home'),
                    style: 'cancel',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
            {
                text: 'Annuler',
                style: 'cancel',
            },
            {
                text: 'Déconnexion',
                style: 'destructive',
                onPress: async () => {
                    await apiService.logout();
                    navigation.navigate('Home');
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorEmoji}>😕</Text>
                <Text style={styles.errorText}>Impossible de charger le profil</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
                    <Text style={styles.retryButtonText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{profile.name?.[0]?.toUpperCase() || '👤'}</Text>
                    </View>
                    <Text style={styles.name}>{profile.name || 'Utilisateur'}</Text>
                    <Text style={styles.email}>{profile.email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mon compte</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemEmoji}>👤</Text>
                        <Text style={styles.menuItemText}>Modifier le profil</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Preferences')}
                    >
                        <Text style={styles.menuItemEmoji}>🍴</Text>
                        <Text style={styles.menuItemText}>Préférences alimentaires</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('History')}
                    >
                        <Text style={styles.menuItemEmoji}>📜</Text>
                        <Text style={styles.menuItemText}>Historique des repas</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Paramètres</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemEmoji}>🔔</Text>
                        <Text style={styles.menuItemText}>Notifications</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemEmoji}>🌙</Text>
                        <Text style={styles.menuItemText}>Mode sombre</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemEmoji}>ℹ️</Text>
                        <Text style={styles.menuItemText}>À propos</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Se déconnecter</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 1.0.0</Text>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorEmoji: {
        fontSize: 60,
        marginBottom: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 20,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        padding: 15,
        paddingBottom: 10,
        backgroundColor: '#F8F8F8',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuItemEmoji: {
        fontSize: 24,
        marginRight: 15,
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    menuItemArrow: {
        fontSize: 24,
        color: '#CCC',
    },
    logoutButton: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#FF6B6B',
    },
    logoutButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    version: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginTop: 30,
        marginBottom: 20,
    },
});