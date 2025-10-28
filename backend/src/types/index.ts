// User types
export interface IUser {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserCreate {
    email: string;
    password: string;
    name?: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

// Preference types
export interface IPreference {
    id: string;
    userId: string;
    dietaryRestrictions: string[];
    allergies: string[];
    cuisinePreferences: string[];
    spiceLevel: number;
}

export interface IPreferenceCreate {
    dietaryRestrictions?: string[];
    allergies?: string[];
    cuisinePreferences?: string[];
    spiceLevel?: number;
}

// Questionnaire types
export interface IQuestionnaireAnswers {
    wantToCook: boolean;
    timeAvailable: number; // minutes
    budget: 'low' | 'medium' | 'high';
    mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    dietaryRestrictions?: string[];
}

// Suggestion types
export interface ISuggestion {
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

// History types
export interface IHistory {
    id: string;
    userId: string;
    mealType: string;
    mealId: string;
    mealName: string;
    mealImage?: string;
    cookingTime?: number;
    budget: string;
    rating?: number;
    createdAt: Date;
}

// JWT Payload
export interface IJWTPayload {
    userId: string;
    email: string;
}

// API Response types
export interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Request with user
export interface IAuthRequest extends Request {
    user?: IJWTPayload;
}