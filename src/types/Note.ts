export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tab {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  hasUnsavedChanges: boolean;
}