
import React from 'react';
import { Task, WorkType } from '../types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onUpdateType: (id: string, type: WorkType) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onUpdateType, onDelete }) => {
  const getLightColor = (type: WorkType, isActive: boolean) => {
    if (!isActive) return 'bg-gray-200 opacity-30 scale-90';
    switch (type) {
      case WorkType.RED: return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110 ring-2 ring-red-400 ring-offset-2';
      case WorkType.YELLOW: return 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110 ring-2 ring-yellow-300 ring-offset-2';
      case WorkType.GREEN: return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110 ring-2 ring-emerald-400 ring-offset-2';
    }
  };

  return (
    <div className={`relative group p-5 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 ${
      task.completed ? 'bg-slate-50 border-gray-100 opacity-75' : 'bg-white shadow-xl shadow-slate-200/50 border-transparent border-2 hover:border-indigo-100'
    }`}>
      <div className="flex justify-between items-start mb-4">
        {/* Traffic Lights */}
        <div className="flex gap-2.5 items-center p-1.5 bg-gray-50 rounded-full">
          <button
            onClick={() => onUpdateType(task.id, WorkType.RED)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${getLightColor(WorkType.RED, task.type === WorkType.RED)}`}
            title="Urgent / High Priority"
          />
          <button
            onClick={() => onUpdateType(task.id, WorkType.YELLOW)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${getLightColor(WorkType.YELLOW, task.type === WorkType.YELLOW)}`}
            title="Regular / In-Progress"
          />
          <button
            onClick={() => onUpdateType(task.id, WorkType.GREEN)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${getLightColor(WorkType.GREEN, task.type === WorkType.GREEN)}`}
            title="Routine / Low Priority"
          />
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Task Content */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
            task.completed 
              ? 'bg-indigo-500 border-indigo-500' 
              : 'border-slate-300 hover:border-indigo-400'
          }`}
        >
          {task.completed && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg leading-tight transition-all ${
            task.completed ? 'text-slate-400 line-through decoration-indigo-300/50' : 'text-slate-800'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1.5 text-sm leading-relaxed transition-all ${
              task.completed ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
         <span className={`text-[10px] font-bold tracking-widest uppercase py-1 px-2.5 rounded-md ${
             task.type === WorkType.RED ? 'bg-red-50 text-red-500' :
             task.type === WorkType.YELLOW ? 'bg-yellow-50 text-yellow-600' :
             'bg-emerald-50 text-emerald-600'
         }`}>
             {task.type}
         </span>
         <span className="text-[10px] text-slate-300 font-medium">
             {new Date(task.createdAt).toLocaleDateString()}
         </span>
      </div>
    </div>
  );
};

export default TaskCard;
