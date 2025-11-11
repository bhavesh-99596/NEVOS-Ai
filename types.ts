export enum Severity {
  Normal = 'Normal',
  Mild = 'Mild',
  Moderate = 'Moderate',
  Serious = 'Serious',
  // Add a fallback for unexpected values
  Unknown = 'Unknown',
}

export interface AnalysisPrediction {
    name: string;
    confidence: number;
}

export interface AnalysisResult {
  conditionName: string;
  severity: Severity;
  confidence: number;
  description: string;
  recommendations: string[];
  disclaimer: string;
  allPredictions: AnalysisPrediction[];
}


// Represents a record saved in the 'analyses' Supabase table
export interface AnalysisRecord {
    id: number;
    created_at: string; // ISO 8601 timestamp
    image_preview: string; // The base64 data URL for the image preview
    condition_name: string;
    severity: Severity;
    confidence: number | null;
    description: string;
    recommendation: string; // Note: DB stores a single string, app can join/split
}

export enum MessageSender {
  User = 'user',
  Bot = 'bot',
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}

// --- Auth Types ---
export interface User {
  id: string;
  email: string;
  user_metadata: {
    fullName?: string;
    [key: string]: any;
  };
  // Add other user properties as needed
}

export interface Session {
  user: User;
  access_token: string;
  // Add other session properties as needed
}

// Represents AI-generated info for a nearby hospital
export interface HospitalInfo {
  name: string;
  address: string;
  phone: string;
  website: string;
}

// Represents an appointment request record for the database
export interface Appointment {
    user_id: string;
    service_type: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
}