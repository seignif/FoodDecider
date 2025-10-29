import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './mobile/src/types';

// Import screens (to be created)
import HomeScreen from './mobile/src/screens/HomeScreen';
import QuestionnaireScreen from './mobile/src/screens/QuestionnaireScreen';
import ResultsScreen from './mobile/src/screens/ResultsScreen';
import LoginScreen from './mobile/src/screens/LoginScreen';
import RegisterScreen from './mobile/src/screens/RegisterScreen';
import ProfileScreen from './mobile/src/screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#FF6B6B',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'FoodDecider' }}
                />
                <Stack.Screen
                    name="Questionnaire"
                    component={QuestionnaireScreen}
                    options={{ title: 'Que voulez-vous manger ?' }}
                />
                <Stack.Screen
                    name="Results"
                    component={ResultsScreen}
                    options={{ title: 'Suggestions' }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Connexion' }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: 'Inscription' }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ title: 'Mon Profil' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}