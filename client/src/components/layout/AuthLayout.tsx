import { Outlet } from "react-router-dom";
import { FolderKanban } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900/40 via-gray-900 to-gray-950 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border border-indigo-500/10 animate-pulse" />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-indigo-500/10" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-indigo-500/15" />
        </div>
        <div className="relative text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <FolderKanban className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">TaskBoard</h1>
          <p className="text-gray-400 max-w-xs">
            Collaborate on projects, manage tasks, and ship faster — together.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
