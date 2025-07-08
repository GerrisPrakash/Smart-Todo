import useSWR from 'swr';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';

const fetcher = async () => await fetchTasks();

export const useTasks = () => {
  const { data, error, mutate, isLoading } = useSWR('tasks', fetcher);

  const create = async (task: any) => {
    await createTask(task);
    mutate();
  };

  const update = async (id: any, updates: any) => {
    await updateTask(id, updates);
    mutate();
  };

  const remove = async (id: any) => {
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