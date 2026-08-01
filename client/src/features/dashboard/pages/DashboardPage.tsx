import { Link } from "react-router-dom";
import { FolderKanban, CheckSquare, Users, TrendingUp } from "lucide-react";
import { useProjects } from "@/features/projects/api/projects.api";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/loader/Loader";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <Loader />;

  const totalTasks = projects?.reduce((acc, p) => acc + p._count.tasks, 0) ?? 0;
  const totalMembers =
    projects?.reduce((acc, p) => acc + p.members.length, 0) ?? 0;

  const stats = [
    {
      label: "Total Projects",
      value: projects?.length ?? 0,
      icon: FolderKanban,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: CheckSquare,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Collaborators",
      value: totalMembers,
      icon: Users,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Your Role",
      value: user?.role ?? "—",
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's an overview of your workspace
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
          >
            <div
              className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}
            >
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Recent Projects</h2>
          <Link
            to="/projects"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition"
          >
            View all →
          </Link>
        </div>

        {projects?.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500">No projects yet.</p>
            <Link
              to="/projects"
              className="mt-3 inline-block text-xs text-indigo-400 hover:text-indigo-300"
            >
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects?.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-indigo-500/40 transition-all group"
              >
                <div className="w-8 h-8 bg-indigo-600/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {project._count.tasks} tasks · {project.members.length}{" "}
                    members
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
