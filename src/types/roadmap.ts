export interface Feature {
  id: string;
  title: string;
  description: string;
  status: "in-development" | "planned" | "considering" | "completed";
  votes: number;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  features: Feature[];
}

export const projects: Project[] = [
  {
    id: "tubeflowz",
    name: "TubeFlowz",
    description: "Plateforme de gestion et d'automatisation pour YouTube",
    features: [
      {
        id: "1",
        title: "Planification des vidéos",
        description: "Planifier et organiser vos publications YouTube à l'avance",
        status: "completed",
        votes: 45,
        projectId: "tubeflowz"
      },
      {
        id: "2",
        title: "Analytics en temps réel",
        description: "Suivre les performances de vos vidéos en temps réel",
        status: "in-development",
        votes: 38,
        projectId: "tubeflowz"
      },
      {
        id: "3",
        title: "Gestion des commentaires",
        description: "Gérer et modérer les commentaires automatiquement",
        status: "planned",
        votes: 29,
        projectId: "tubeflowz"
      }
    ]
  },
  {
    id: "mediaflowz",
    name: "MediaFlowz",
    description: "Solution de gestion de contenu multimédia",
    features: [
      {
        id: "1",
        title: "Bibliothèque centralisée",
        description: "Centraliser tous vos fichiers médias au même endroit",
        status: "completed",
        votes: 52,
        projectId: "mediaflowz"
      },
      {
        id: "2",
        title: "Conversion automatique",
        description: "Convertir automatiquement vos fichiers dans différents formats",
        status: "in-development",
        votes: 41,
        projectId: "mediaflowz"
      },
      {
        id: "3",
        title: "Tags intelligents",
        description: "Système de tags automatique basé sur l'IA",
        status: "considering",
        votes: 33,
        projectId: "mediaflowz"
      }
    ]
  }
]; 