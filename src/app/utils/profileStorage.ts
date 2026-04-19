import { UserProfile } from '../types';

const PROFILE_KEY = 'user_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Administrator',
  email: 'admin@kampus.ac.id',
  phone: '+62 812-3456-7890',
  department: 'Keamanan & Pengawasan Kampus',
  role: 'Administrator',
  joinDate: new Date().toISOString()
};

export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch (error) {
    console.error('Error loading profile:', error);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}
