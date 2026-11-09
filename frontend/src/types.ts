// src/types.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export type TaskCreate = {
  title: string;
  description?: string;
  completed?: boolean;
}