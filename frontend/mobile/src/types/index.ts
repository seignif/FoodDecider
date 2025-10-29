// Navigation types
export type RootStackParamList = {
    Home: undefined;
    Questionnaire: undefined;
    Results: { answers: QuestionnaireAnswers };
    Auth: undefined;
    Login: undefined;
    Register: undefined;
    Profile: undefined;
    History: undefined;
    Preferences: undefined;
};

// User types
export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name?: string;
}

// Questionnaire types
export interface QuestionnaireAnswers {
    wantToCook: boolean;
    timeAvailable: number;
    budget: 'low' | 'medium' | 'high';
    mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    dietaryRestrictions?: string[];
}

// Suggestion types
export interface Suggestion {
    id: string;
    name: string;
    image: string;
    type: 'recipe' | 'restaurant';
    cookingTime?: number;
    difficulty?: string;
    rating?: number;
    budget: string;
    description?: string;
    url?: string;
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface SuggestionsResponse {
    suggestions: Suggestion[];
    filters: QuestionnaireAnswers;
}

// Preference types
export interface Preference {
    id: string;
    userId: string;
    dietaryRestrictions: string[];
    allergies: string[];
    cuisinePreferences: string[];
    spiceLevel: number;
}