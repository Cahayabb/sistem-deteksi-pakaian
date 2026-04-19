import { DetectionRecord } from '../types';

const STORAGE_KEY = 'sop_detection_records';

export function loadRecords(): DetectionRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading records:', error);
    return [];
  }
}

export function saveRecords(records: DetectionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving records:', error);
  }
}

export function addRecord(record: DetectionRecord): DetectionRecord[] {
  const records = loadRecords();
  records.push(record);
  saveRecords(records);
  return records;
}

export function clearRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}
