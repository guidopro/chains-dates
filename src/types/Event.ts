export interface EventFirestore {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  createdAt: string;
  createdByName: string;
  attendees: string[];
  imageUrl: string;
  isFree: boolean;
}
