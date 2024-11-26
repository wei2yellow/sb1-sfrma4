export type SituationCategory = 'customer' | 'service' | 'emergency' | 'other';
export type SituationPriority = 'high' | 'medium' | 'low';

export interface ServiceSituation {
  id: string;
  title: string;
  description: string;
  category: SituationCategory;
  priority: SituationPriority;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  responses?: ServiceResponse[];
}

export interface ServiceResponse {
  id: string;
  situationId: string;
  content: string;
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}