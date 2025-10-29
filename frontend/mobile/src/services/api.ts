import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ApiResponse,
    AuthResponse,
    LoginData,
    RegisterData,
    QuestionnaireAnswers,
    SuggestionsResponse,
    Preference,
} from '../types';

// API Base URL - Change this to your actual backend URL
// Pour Android Emulator
const API_URL = 'http://10.0.2.2:3000/api';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add token to requests automatically
        this.api.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Handle errors globally
        this.api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    await AsyncStorage.removeItem('authToken');
                    // Redirect to login screen (handled by navigation)
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
        const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', data);
        if (response.data.success && response.data.data?.token) {
            await AsyncStorage.setItem('authToken', response.data.data.token);
        }
        return response.data;
    }

    async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
        const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', data);
        if (response.data.success && response.data.data?.token) {
            await AsyncStorage.setItem('authToken', response.data.data.token);
        }
        return response.data;
    }

    async logout(): Promise<void> {
        await AsyncStorage.removeItem('authToken');
    }

    async getProfile(): Promise<ApiResponse> {
        const response = await this.api.get('/auth/profile');
        return response.data;
    }

    // Suggestions endpoints
    async generateSuggestions(
        answers: QuestionnaireAnswers
    ): Promise<ApiResponse<SuggestionsResponse>> {
        const response = await this.api.post<ApiResponse<SuggestionsResponse>>(
            '/suggestions/generate',
            answers
        );
        return response.data;
    }

    async saveToHistory(meal: {
        mealType: string;
        mealId: string;
        mealName: string;
        mealImage?: string;
        cookingTime?: number;
        budget: string;
        rating?: number;
    }): Promise<ApiResponse> {
        const response = await this.api.post('/suggestions/history', meal);
        return response.data;
    }

    async getHistory(): Promise<ApiResponse> {
        const response = await this.api.get('/suggestions/history');
        return response.data;
    }

    // Preferences endpoints
    async getPreferences(): Promise<ApiResponse<Preference>> {
        const response = await this.api.get<ApiResponse<Preference>>('/preferences');
        return response.data;
    }

    async updatePreferences(preferences: Partial<Preference>): Promise<ApiResponse<Preference>> {
        const response = await this.api.put<ApiResponse<Preference>>('/preferences', preferences);
        return response.data;
    }

    async deletePreferences(): Promise<ApiResponse> {
        const response = await this.api.delete('/preferences');
        return response.data;
    }

    // Check if user is authenticated
    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem('authToken');
        return !!token;
    }
}

export default new ApiService();