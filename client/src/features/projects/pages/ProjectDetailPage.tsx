import { Link } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  UserMinus,
  Users,
  ClipboardList,
  Plus,
} from "lucide-react";
import Loader from "@/components/loader/Loader";
import TaskBoard from "@/features/tasks/components/TaskBoard";
import { useProjectDetailPage } from "../hooks/useProjectDetailPage";
import { useAuthStore } from "@/store/authStore";

const ProjectDetailPage = () => {
  const { state, query, actions } = useProjectDetailPage();
  const { user } = useAuthStore();

  if (query.isLoading || !query.project) return <Loader fullScreen />;

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          {query.project.name}
        </h1>
        {query.project.description && (
          <p className="text-sm text-gray-400">{query.project.description}</p>
        )}
        <p className="text-xs text-gray-600 mt-2">
          Owned by {query.project.owner.name}
        </p>
      </div>

      {/* Members section */}
      <div className="mb-8 bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">
              Members ({query.project.members.length})
            </h2>
          </div>
          {state.isOwner && user?.role === "ADMIN" && (
            <button
              onClick={() => state.setShowAddMember(!state.showAddMember)}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Member
            </button>
          )}
        </div>

        {/* Add member input */}
        {state.showAddMember && state.isOwner && user?.role === "ADMIN" && (
          <div className="relative mb-4">
            <div className="flex gap-2">
              <input
                value={state.addEmail}
                onChange={(e) => state.setAddEmail(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && actions.handleAddMember()
                }
                placeholder="Search by name or email..."
                type="text"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => actions.handleAddMember()}
                disabled={actions.isAdding || !state.addEmail.trim()}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl text-xs font-medium transition"
              >
                {actions.isAdding ? "Adding..." : "Add"}
              </button>
            </div>

            {/* Search Dropdown */}
            {state.addEmail.trim() && query.allUsers && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto top-full">
                {(() => {
                  const filteredUsers = query.allUsers.filter(
                    (u) =>
                      !query.project?.members.some((m) => m.user.id === u.id) &&
                      (u.name
                        .toLowerCase()
                        .includes(state.addEmail.toLowerCase()) ||
                        u.email
                          .toLowerCase()
                          .includes(state.addEmail.toLowerCase())),
                  );

                  if (filteredUsers.length === 0) {
                    return (
                      <div className="px-3 py-4 text-center text-xs text-gray-500">
                        No matching users found
                      </div>
                    );
                  }

                  return filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => actions.handleAddMember(u.email)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 transition flex items-center justify-between group border-b border-gray-700/50 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-white font-medium">
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                      <Plus className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ));
                })()}
              </div>
            )}
          </div>
        )}

        {/* Member list */}
        <div className="space-y-2">
          {query.project.members.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-4">
              No members yet. Add team members to collaborate.
            </p>
          ) : (
            query.project.members.map(({ user: member, joinedAt }) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-indigo-600/20 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-400">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-white">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 hidden sm:block">
                    Joined {new Date(joinedAt).toLocaleDateString()}
                  </span>
                  {state.isOwner &&
                    user?.role === "ADMIN" &&
                    member.id !== query.user?.id && (
                      <button
                        onClick={() => actions.removeMember(member.id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task board */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Task Board</h2>
        </div>
        <TaskBoard projectId={state.id!} members={query.project.members} />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
