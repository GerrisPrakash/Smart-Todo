import { useTasks } from './hooks/useTasks';
import { getTaskStatus } from './api/tasks';
import { useState } from 'react';

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

  const grouped = {
    ongoing: [],
    success: [],
    failure: []
  };

  tasks?.forEach((task) => {
    const status = getTaskStatus(task);
    grouped[status].push(task);
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Smart Todo List</h1>

        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-2 rounded"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>

        {isLoading && <p className="text-gray-500">Loading...</p>}
        {isError && <p className="text-red-500">Error loading tasks.</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['ongoing', 'success', 'failure'].map((status) => (
            <div key={status}>
              <h2 className="text-lg font-semibold mb-2 capitalize">
                {status === 'ongoing' ? 'Ongoing' : status === 'success' ? 'Completed' : 'Overdue'}
              </h2>
              <div className="space-y-2">
                {grouped[status].length > 0 ? (
                  grouped[status].map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-50 border p-3 rounded shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(task.deadline).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => update(task.id, { isCompleted: !task.isCompleted })}
                          className="text-sm text-green-600 hover:underline"
                        >
                          {task.isCompleted ? 'Undo' : 'Complete'}
                        </button>
                        <button
                          onClick={() => remove(task.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}