import { useTasks } from './hooks/useTasks';
import { getTaskStatus, type Task } from './api/tasks';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


export default function App() {
  const { tasks, isLoading, isError, create, update, remove } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleAdd = async () => {
    if (!title || !deadline) return;
    await create({ title, description, deadline, isCompleted: false });
    setTitle('');
    setDescription('');
    setDeadline('');
  };

  const grouped: Record<'ongoing' | 'success' | 'failure', Task[]> = {
    ongoing: [],
    success: [],
    failure: [],
  };

  tasks?.forEach((task) => {
    const status = getTaskStatus(task);
    grouped[status].push(task);
  });

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-white p-4 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-indigo-600">
          Smart Todo List
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            className="border p-3 rounded w-full"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="datetime-local"
            className="border p-3 rounded w-full"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <textarea
          className="border p-3 rounded w-full mb-4"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white font-semibold px-6 py-3 rounded w-full md:w-auto"
        >
          Add Task
        </button>

        {isLoading && <p className="text-gray-500 mt-6">Loading...</p>}
        {isError && <p className="text-red-500 mt-6">Error loading tasks.</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {(['ongoing', 'success', 'failure'] as const).map((status) => (
            <div key={status}>
              <h2 className="text-xl font-semibold mb-4 capitalize text-indigo-700">
                {status === 'ongoing' ? 'Ongoing' : status === 'success' ? 'Completed' : 'Overdue'}
              </h2>
              <AnimatePresence>
                {grouped[status].length > 0 ? (
                  grouped[status].map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      layout
                      className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm mb-3 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(task.deadline).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-end gap-3 mt-3">
                        <button
                          onClick={() => update(task.id, { isCompleted: !task.isCompleted })}
                          className="text-sm text-green-600 hover:underline"
                        >
                          {task.isCompleted ? 'Undo' : 'Complete'}
                        </button>
                        <button
                          onClick={() => remove(task.id)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No tasks</p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}