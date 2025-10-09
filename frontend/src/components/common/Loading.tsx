// components/common/Loading.tsx
export default function Loading () {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 text-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
      <span className="ml-3 text-lg">Loading...</span>
    </div>
  );
}
