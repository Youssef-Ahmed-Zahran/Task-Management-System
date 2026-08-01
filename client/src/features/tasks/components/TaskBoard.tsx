import { Plus, Filter, Search, X } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import type { TaskStatus, Priority } from "../api/tasks.api";
import Loader from "@/components/loader/Loader";
import { cn } from "@/utils/cn";
import { useTaskBoard } from "../hooks/useTaskBoard";
import { TaskBoardProps } from "../types/TaskBoard.types";

const COLUMNS: {
  status: TaskStatus;
  label: string;
  color: string;
  dot: string;
}[] = [
  {
    status: "TODO",
    label: "To Do",
    color: "border-t-gray-600",
    dot: "bg-gray-500",
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    color: "border-t-amber-500",
    dot: "bg-amber-500",
  },
  {
    status: "DONE",
    label: "Done",
    color: "border-t-emerald-500",
    dot: "bg-emerald-500",
  },
];

const PRIORITY_OPTIONS: Priority[] = ["LOW", "MEDIUM", "HIGH"];

const TaskBoard = ({ projectId, members }: TaskBoardProps) => {
  const { state, query, actions } = useTaskBoard(projectId);

  if (query.isLoading) return <Loader />;
  if (query.isError)
    return (
      <div className="text-red-500 p-4 bg-red-500/10 rounded-xl">
        Error fetching tasks:{" "}
        {(query.error as any)?.response?.data?.message ||
          (query.error as any)?.message ||
          "Unknown error"}
      </div>
    );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={state.searchInput}
            onChange={(e) => state.setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={() => state.setShowFilters(!state.showFilters)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl text-sm transition",
            state.hasFilters
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
              : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white",
          )}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {state.hasFilters && (
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center">
              {Object.values(state.filters).filter(Boolean).length}
            </span>
          )}
        </button>
        <button
          onClick={() => actions.openCreateForColumn("TODO")}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Task
        </button>
      </div>

      {/* Filter panel */}
      {state.showFilters && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-5 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Priority</label>
            <select
              value={state.filters.priority ?? ""}
              onChange={(e) =>
                state.setFilters((f) => ({
                  ...f,
                  priority: (e.target.value as Priority) || undefined,
                }))
              }
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All priorities</option>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Assignee</label>
            <select
              value={state.filters.assigneeId ?? ""}
              onChange={(e) =>
                state.setFilters((f) => ({
                  ...f,
                  assigneeId: e.target.value || undefined,
                }))
              }
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All assignees</option>
              {members.map(({ user }) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          {state.hasFilters && (
            <button
              onClick={() => state.setFilters({})}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(({ status, label, color, dot }) => {
          const columnTasks =
            query.tasks?.filter((t) => t.status === status) ?? [];
          return (
            <div
              key={status}
              className={cn(
                "bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden",
                "border-t-2",
                color,
              )}
            >
              {/* Column header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", dot)} />
                  <span className="text-sm font-medium text-white">
                    {label}
                  </span>
                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => actions.openCreateForColumn(status)}
                  className="text-gray-600 hover:text-indigo-400 transition p-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks */}
              <div className="p-3 space-y-2 min-h-[200px]">
                {columnTasks.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-gray-700 text-xs">
                    No tasks
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={state.setEditingTask}
                      onDelete={actions.handleDelete}
                    />
                  ))
                )}
              </div>

              {/* Quick status move (shown on cards via context) */}
              {status !== "DONE" && (
                <div className="px-3 pb-3">
                  <p className="text-[10px] text-gray-700 text-center">
                    Use edit to move tasks between columns
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create form modal */}
      {state.showForm && (
        <TaskForm
          title="New Task"
          defaultValues={{ status: state.defaultStatus }}
          onSubmit={actions.handleCreate}
          isPending={actions.isCreating}
          onCancel={() => state.setShowForm(false)}
          members={members}
        />
      )}

      {/* Edit form modal */}
      {state.editingTask && (
        <TaskForm
          title="Edit Task"
          defaultValues={{
            title: state.editingTask.title,
            description: state.editingTask.description ?? "",
            status: state.editingTask.status,
            priority: state.editingTask.priority,
            dueDate: state.editingTask.dueDate
              ? new Date(state.editingTask.dueDate).toISOString().split("T")[0]
              : null,
            assigneeId: state.editingTask.assignee?.id ?? null,
          }}
          onSubmit={actions.handleUpdate}
          isPending={actions.isUpdating}
          onCancel={() => state.setEditingTask(null)}
          members={members}
        />
      )}
    </div>
  );
};

export default TaskBoard;
