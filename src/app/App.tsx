import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardEnhanced } from './components/DashboardEnhanced';
import { DetectionPageEnhanced } from './components/DetectionPageEnhanced';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { DetectionRecord, DetectionResult, UserProfile } from './types';
import { loadRecords, addRecord } from './utils/storage';
import { loadProfile, saveProfile } from './utils/profileStorage';

type Page = 'dashboard' | 'detection' | 'history' | 'profile';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [records, setRecords] = useState<DetectionRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile>(loadProfile());

  useEffect(() => {
    const savedRecords = loadRecords();
    setRecords(savedRecords);
  }, []);

  const handleLogin = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setCurrentPage('dashboard');
  };

  const handleSaveRecord = (result: DetectionResult) => {
    const newRecord: DetectionRecord = {
      ...result,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    const updatedRecords = addRecord(newRecord);
    setRecords(updatedRecords);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const compliantCount = records.filter(r => r.isCompliant).length;
  const nonCompliantCount = records.length - compliantCount;

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentPage === 'detection') {
    return (
      <DetectionPageEnhanced
        onNavigate={setCurrentPage}
        onSaveRecord={handleSaveRecord}
      />
    );
  }

  if (currentPage === 'history') {
    return (
      <HistoryPage
        records={records}
        onNavigate={setCurrentPage}
      />
    );
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage
        profile={profile}
        onNavigate={setCurrentPage}
        onUpdateProfile={handleUpdateProfile}
        totalDetections={records.length}
        compliantCount={compliantCount}
        nonCompliantCount={nonCompliantCount}
      />
    );
  }

  return (
    <DashboardEnhanced
      records={records}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      username={username}
    />
  );
}