export interface ClothingItem {
  type: 'baju' | 'celana' | 'sepatu';
  color: string;
  compliant: boolean;
  confidence: number;
  reason?: string;
}

export interface DetectionResult {
  items: ClothingItem[];
  isCompliant: boolean;
  timestamp: number;
}

export interface DetectionRecord extends DetectionResult {
  id: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string;
}
