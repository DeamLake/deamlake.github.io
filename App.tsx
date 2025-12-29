
import React, { useState, useEffect, useCallback } from 'react';
import { Task, WorkType } from './types';
import TaskCard from './components/TaskCard';
import { suggestTaskType, generateTaskAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('traffic-light-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('traffic-light-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSuggesting(true);
    // AI assists with the initial type suggestion
    const suggestedType = await suggestTaskType(newTitle, newDesc);
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTitle,
      description: newDesc,
      type: suggestedType,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
    setIsSuggesting(false);
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const updateType = (id: string, type: WorkType) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, type } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const getTip = useCallback(async () => {
      if (tasks.length === 0) return;
      const tip = await generateTaskAnalysis(tasks);
      setAiTip(tip);
  }, [tasks]);

  useEffect(() => {
      const timer = setTimeout(() => {
          getTip();
      }, 3000);
      return () => clearTimeout(timer);
  }, [tasks.length, getTip]);

  const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed === b.completed) {
          return b.createdAt - a.createdAt;
      }
      return a.completed ? 1 : -1;
  });

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 bg-[#fdfdff]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 py-6 mb-8 border-b border-gray-100 glass">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-600">
              Traffic Tasker
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Categorize your focus with precision.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Card
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* AI Insight Section */}
        {aiTip && tasks.length > 0 && (
            <div className="mb-10 p-5 rounded-3xl bg-indigo-50/50 border border-indigo-100/50 flex items-center gap-4 animate-in fade-in slide-in-from-top duration-700">
                <div className="bg-white p-2.5 rounded-2xl shadow-sm text-indigo-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                    </svg>
                </div>
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">AI Productivity Insight</span>
                    <p className="text-indigo-900 text-sm font-medium leading-relaxed italic">"{aiTip}"</p>
                </div>
            </div>
        )}

        {/* Task Grid */}
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Your task list is pristine</h3>
            <p className="text-slate-500 mt-2">Click the button above to start capturing your work items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onUpdateType={updateType}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">New Work Task</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={addTask} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g., Q3 Budget Review"
                    className="w-full px-5 py-4 bg-slate-50 border-transparent border-2 focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Details about this work block..."
                    className="w-full px-5 py-4 bg-slate-50 border-transparent border-2 focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300 resize-none"
                  />
                </div>
                
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSuggesting}
                    type="submit"
                    className="flex-[2] px-6 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    {isSuggesting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        AI Categorizing...
                      </>
                    ) : (
                      'Save Task'
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-indigo-50 p-6 flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                    </svg>
                </div>
                <p className="text-xs text-indigo-700 font-medium leading-tight">
                    Our AI will analyze your title and description to automatically set the initial priority light.
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
