export type SessionMode = "Online" | "In-person";

export type Therapist = {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  yearsExperience: number;
  sessionMode: SessionMode;
  fee: number; // USD
  rating: number; // 0-5
  languages: string[];
  recommendedReason?: string;
};

