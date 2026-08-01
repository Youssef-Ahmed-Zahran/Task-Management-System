import { Link } from "react-router-dom";
import {
  FolderKanban,
  CheckSquare,
  Trash2,
  Edit2,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import { useProjectCard } from "../hooks/useProjectCard";
import { useAuthStore } from "@/store/authStore";
import { ProjectCardProps } from "../types/ProjectCard.types";

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const { state } = useProjectCard(project);
  const { user } = useAuthStore();

  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/25 transition-colors">
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <Link
              to={`/projects/${project.id}`}
              className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors line-clamp-1"
            >
              {project.name}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">
              by {project.owner.name}
            </p>
          </div>
        </div>

        {state.isOwner && user?.role === "ADMIN" && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(project)}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-4">
          {project.description}
        </p>
      )}

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs",
              project._count.tasks > 0 ? "text-gray-400" : "text-gray-600",
            )}
          >
            <CheckSquare className="w-3 h-3" />
            {project._count.tasks} task{project._count.tasks !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-gray-600">
            {project.members.length} member
            {project.members.length !== 1 ? "s" : ""}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          {formatDate(project.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
