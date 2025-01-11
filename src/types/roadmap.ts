export type FeatureStatus = 'considering' | 'planned' | 'in-development' | 'completed' | 'rejected';

export interface Feature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  votes: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  features: Feature[];
}

export const projects: Project[] = [
  {
    id: 'tubeflowz',
    name: 'Tubeflowz',
    description: 'YouTube automation tool',
    features: []
  },
  {
    id: 'mediaflowz',
    name: 'Mediaflowz',
    description: 'Social media automation',
    features: []
  },
  {
    id: 'winflowz',
    name: 'Winflowz',
    description: 'Windows automation',
    features: []
  }
]; 