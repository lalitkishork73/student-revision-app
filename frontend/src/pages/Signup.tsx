// pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/api/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Signup () {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error("All fields are required");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const res: any = await signup(name, email, password);
            if (res?.status === 201) {
                toast.success("Signup successful! Redirecting to login...");
                navigate("/login");
            } else {
                toast.error(res?.message || "Signup failed. Please try again.");
            }
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <form
                onSubmit={handleSubmit}
                className="p-6 rounded-xl shadow-lg bg-card w-96 space-y-6 border border-border"
            >
                <h1 className="text-3xl font-bold text-center text-foreground">Sign Up</h1>

                <div className="space-y-4">
                    <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-input border-input text-foreground"
                    />
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-input border-input text-foreground"
                    />

                    <div className="relative">
                        <Input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-input border-input text-foreground pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </Button>

                <div className="text-center text-muted-foreground mt-2">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-primary-foreground hover:underline"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
