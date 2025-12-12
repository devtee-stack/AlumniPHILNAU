import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(1, "Password is required"),
});

const AuthModal = ({ open, onClose, mode, onModeChange }: AuthModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "register") {
      const result = signUpSchema.safeParse(formData);
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }
      
      setIsLoading(true);
      const { error } = await signUp(result.data.email, result.data.password, result.data.name);
      setIsLoading(false);
      
      if (error) {
        toast.error(error.message || "Failed to create account");
        return;
      }
      
      toast.success("Account created successfully! Welcome to UNIZIK Alumni.");
      onClose();
      setFormData({ name: "", email: "", password: "" });
    } else {
      const result = signInSchema.safeParse(formData);
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }
      
      setIsLoading(true);
      const { error } = await signIn(result.data.email, result.data.password);
      setIsLoading(false);
      
      if (error) {
        toast.error(error.message || "Failed to sign in");
        return;
      }
      
      toast.success("Signed in successfully!");
      onClose();
      setFormData({ name: "", email: "", password: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "register" ? "Create Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "register"
              ? "Create an account to unlock posting, applying for mentorship, and applying to jobs."
              : "Sign in to access all features and connect with alumni."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              variant="gold"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : mode === "register" ? "Create Account" : "Sign In"}
            </Button>
          </div>
          <div className="text-center text-sm">
            {mode === "register" ? (
              <button
                type="button"
                onClick={() => onModeChange("login")}
                className="text-primary hover:text-accent font-semibold"
              >
                Already have an account? Sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onModeChange("register")}
                className="text-primary hover:text-accent font-semibold"
              >
                Don't have an account? Register
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
