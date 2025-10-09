// pages/NotFound.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound () {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen items-center justify-center space-y-6 bg-gray-950 text-gray-100">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-lg text-gray-400">Oops! Page not found.</p>
      <Button variant="default" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </div>
  );
}
