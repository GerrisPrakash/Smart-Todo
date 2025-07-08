import { supabase } from "../lib/superbase";

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'ongoing' | 'success' | 'failure';

export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
};


export const getTaskStatus = (task: Task): 'ongoing' | 'success' | 'failure' => {
  const now = new Date();
  const deadline = new Date(task.deadline);

  if (task.isCompleted) return 'success';
  if (now > deadline) return 'failure';
  return 'ongoing';
};
