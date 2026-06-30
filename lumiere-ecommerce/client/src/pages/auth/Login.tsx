import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Seo } from "@/components/shared/Seo";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const [showDemo, setShowDemo] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "ADMIN" ? "/admin" : redirect);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  const fillDemo = (kind: "admin" | "customer") => {
    if (kind === "admin") {
      // set value via react-hook-form
      const event = new Event("input", { bubbles: true });
      const emailInput = document.getElementById("email") as HTMLInputElement;
      const passInput = document.getElementById("password") as HTMLInputElement;
      if (emailInput && passInput) {
        emailInput.value = "admin@example.com";
        passInput.value = "Admin@12345";
        emailInput.dispatchEvent(event);
        passInput.dispatchEvent(event);
      }
    } else {
      const event = new Event("input", { bubbles: true });
      const emailInput = document.getElementById("email") as HTMLInputElement;
      const passInput = document.getElementById("password") as HTMLInputElement;
      if (emailInput && passInput) {
        emailInput.value = "emma@example.com";
        passInput.value = "Password123";
        emailInput.dispatchEvent(event);
        passInput.dispatchEvent(event);
      }
    }
  };

  return (
    <>
      <Seo title="Sign In" description="Sign in to your Lumière account to track orders, save favorites, and check out faster." canonical="/auth/login" />
      <div className="container-premium section-py">
        <div className="mx-auto max-w-md">
          <div className="card-premium p-8">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
                required
              />
              <Input
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
                required
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded" /> Remember me
                </label>
                <Link to="/auth/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" size="lg" shine className="w-full" disabled={loading}>
                {loading ? "Signing in…" : <>Sign In <ArrowRight size={16} /></>}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-primary font-medium hover:underline">Create one</Link>
            </p>

            <button
              type="button"
              onClick={() => setShowDemo((s) => !s)}
              className="mt-6 w-full text-xs text-muted-foreground hover:text-foreground"
            >
              {showDemo ? "Hide demo credentials" : "View demo credentials"}
            </button>
            {showDemo && (
              <div className="mt-3 rounded-lg bg-secondary p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">Admin (full dashboard access)</p>
                  <p className="text-xs text-muted-foreground">admin@example.com · Admin@12345</p>
                  <button type="button" onClick={() => fillDemo("admin")} className="mt-1 text-xs text-primary hover:underline">
                    Fill admin →
                  </button>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-foreground">Customer</p>
                  <p className="text-xs text-muted-foreground">emma@example.com · Password123</p>
                  <button type="button" onClick={() => fillDemo("customer")} className="mt-1 text-xs text-primary hover:underline">
                    Fill customer →
                  </button>
                </div>
              </div>
            )}

            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck size={12} /> Your data is encrypted and never shared.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
