// pages/Home.tsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home () {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen w-full items-center justify-center space-y-8 bg-background text-foreground">
            <h1 className="text-5xl font-bold text-center">
                Welcome to SchoolprepsLLM
            </h1>
            <div className="flex space-x-4">
                <Button
                    size="lg"
                    onClick={() => navigate("/login")}
                    className="bg-primary text-primary-foreground"
                >
                    Login
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate("/signup")}
                    className="bg-secondary text-secondary-foreground"
                >
                    Signup
                </Button>
            </div>
        </div>
    );
}
