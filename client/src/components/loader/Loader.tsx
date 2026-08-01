const Loader = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen bg-gray-950" : "min-h-[200px]"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
        </div>
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
