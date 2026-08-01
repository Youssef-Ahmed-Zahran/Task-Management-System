import { Calendar, User, Trash2, Edit2, AlertCircle } from "lucide-react";
import type { Task } from "../api/tasks.api";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import { useTaskCard } from "../hooks/useTaskCard";
import { TaskCardProps } from "../types/TaskCard.types";

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  LOW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const { state } = useTaskCard(task);

  return (
    <div className="group bg-gray-800/60 border border-gray-700/50 rounded-xl p-3.5 hover:border-indigo-500/30 hover:bg-gray-800 transition-all duration-150 cursor-pointer">
      {/* Priority badge */}
      <div className="flex items-start justify-between mb-2">
        <span
          className={cn(
            "inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border",
            PRIORITY_STYLES[task.priority],
          )}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
        {state.canModify && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1 text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="p-1 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded transition"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-white mb-1 line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          {task.assignee ? (
            <>
              <div className="w-5 h-5 bg-indigo-600/20 rounded-full flex items-center justify-center text-[9px] font-semibold text-indigo-400">
                {task.assignee.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500 truncate max-w-[80px]">
                {task.assignee.name}
              </span>
            </>
          ) : (
            <User className="w-3.5 h-3.5 text-gray-600" />
          )}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div
            className={cn(
              "flex items-center gap-1 text-[10px]",
              state.overdue ? "text-red-400" : "text-gray-600",
            )}
          >
            {state.overdue && <AlertCircle className="w-3 h-3" />}
            <Calendar className="w-3 h-3" />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
