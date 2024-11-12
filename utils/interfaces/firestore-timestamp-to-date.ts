import { type Timestamp } from 'firebase-admin/firestore';

export function firestoreTimestampToDate(timestamp: Timestamp): Date {
  const typeofTimestamp = typeof timestamp;
  if (typeofTimestamp === 'string') {
    return new Date(timestamp as unknown as string);
  }

  try {
    return timestamp.toDate();
  } catch (e) {
    console.info(`timestamp: ${timestamp}`);
    console.error(e);
    throw new Error('Failed to convert Firestore Timestamp to Date');
  }
}
