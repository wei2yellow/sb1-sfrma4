export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  validFrom: string;
  validTo: string;
  visibleTo: string[];
  readBy: {
    userId: string;
    readAt: string;
  }[];
  questions?: {
    id: string;
    userId: string;
    question: string;
    createdAt: string;
    answer?: string;
    answeredAt?: string;
    answeredBy?: string;
  }[];
}

export interface AnnouncementQuestion {
  id: string;
  announcementId: string;
  userId: string;
  question: string;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
  answeredBy?: string;
}