import useSWR from 'swr';
import { fetchTasks, createTask, updateTask, deleteTask, type Task } from '../api/tasks';

const fetcher = async () => await fetchTasks();

export const useTasks = () => {
  const { data, error, mutate, isLoading } = useSWR<Task[]>('tasks', fetcher);

  const create = async (task: Partial<Task>) => {
    await createTask(task);
    mutate();
  };

  const update = async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates);
    mutate();
  };

  const remove = async (id: string) => {
    await deleteTask(id);
    mutate();
  };

  return {
    tasks: data,
    isLoading,
    isError: error,
    create,
    update,
    remove,
  };
};