import { useTasks } from './hooks/useTasks';
import { getTaskStatus, type Task } from './api/tasks';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function TodoApp() {
  const { tasks, isLoading, isError, create, update, remove } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleAddOrUpdate = async () => {
    if (!title || !deadline) return;

    const adjustedDeadline = new Date(deadline.getTime() + 5.5 * 60 * 60 * 1000); // Add 5h 30m

    const taskData = {
      title,
      description,
      deadline: adjustedDeadline.toISOString(), // ✅ Store deadline in UTC with IST offset
      isCompleted: false,
    };

    if (isEditing && editingTaskId) {
      await update(editingTaskId, taskData);
      setIsEditing(false);
      setEditingTaskId(null);
    } else {
      await create(taskData);
    }

    setTitle('');
    setDescription('');
    setDeadline(null);
  };

  const handleEdit = (task: Task) => {
    setIsEditing(true);
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setDeadline(new Date(task.deadline));
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
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 to-white p-4 md:p-10 font-['Inter']">
      <div className="w-full flex flex-col">
        <h1 className="text-4xl font-black text-center mb-10 text-slate-800 drop-shadow-sm tracking-tight">
          Smart Todo List
        </h1>

        <div className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-10 flex flex-col">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              className="border bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-300 p-3 rounded-[5px] w-full transition-all font-medium placeholder-gray-400"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Select deadline"
              className="border bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-300 p-3 rounded-[5px] w-full transition-all font-medium placeholder-gray-400"
            />
          </div>
          <textarea
            className="border bg-slate-50 border-slate-300 focus:ring-2 focus:ring-indigo-300 p-3 rounded-[5px] w-full mb-4 transition-all font-medium placeholder-gray-400"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddOrUpdate}
              className="bg-indigo-500 mr-auto hover:bg-indigo-700 transition-all duration-300 text-white font-semibold px-6 py-3 rounded-[5px] w-full sm:w-auto shadow-md tracking-wide"
            >
              {isEditing ? 'Update Task' : 'Add Task'}
            </button>
          </div>

          {isLoading && <p className="text-slate-500 mt-6">Loading...</p>}
          {isError && <p className="text-red-500 mt-6">Error loading tasks.</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 h-auto">
            {(['failure', 'ongoing', 'success'] as const).map((status) => (
              <div key={status}>
                <h2
                  className={`text-xl font-bold mb-4 capitalize px-2 py-1 rounded-[5px] w-fit text-white tracking-wide ml-auto mr-auto ${status === 'ongoing'
                    ? 'bg-yellow-500'
                    : status === 'success'
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                    }`}
                >
                  {status === 'ongoing' ? 'Ongoing' : status === 'success' ? 'Completed' : 'Overdue'}
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {grouped[status].length > 0 ? (
                      grouped[status].map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          layout
                          className="bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow duration-300 p-4 rounded-xl shadow-sm"
                        >
                          <div>
                            <h3 className="font-semibold text-slate-800 text-lg leading-snug">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-slate-600 mt-1 leading-snug">
                                {task.description}
                              </p>
                            )}
                            <p className="text-xs text-slate-400 mt-2">
                              {new Date(task.deadline).toLocaleString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </p>
                          </div>
                          <div className="flex justify-end gap-4 mt-4">
                            <button
                              onClick={() => handleEdit(task)}
                              className="text-sm text-indigo-500 hover:text-indigo-700 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => update(task.id, { isCompleted: !task.isCompleted })}
                              className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                            >
                              {task.isCompleted ? 'Undo' : 'Complete'}
                            </button>
                            <button
                              onClick={() => remove(task.id)}
                              className="text-sm text-rose-500 hover:text-rose-700 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 text-center mt-10 mb-10">No tasks</p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
