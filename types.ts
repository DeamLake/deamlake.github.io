
export enum WorkType {
  RED = 'RED',     // e.g., Urgent/High Priority
  YELLOW = 'YELLOW', // e.g., Medium/In-Progress
  GREEN = 'GREEN'    // e.g., Routine/Low Priority
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: WorkType;
  completed: boolean;
  createdAt: number;
}

export type NewTaskInput = Omit<Task, 'id' | 'completed' | 'createdAt'>;
