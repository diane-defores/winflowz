export type Database = {
  public: {
    Tables: {
      // Définissez vos tables ici
      // Par exemple :
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      // Ajoutez d'autres tables selon votre schéma
    }
    Views: {
      // Définissez vos vues ici
    }
    Functions: {
      // Définissez vos fonctions ici
    }
  }
} 