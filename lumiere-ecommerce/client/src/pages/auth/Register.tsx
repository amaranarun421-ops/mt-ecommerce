import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Seo } from "@/components/shared/Seo";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const registerUser = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const user = await registerUser(data.name, data.email, data.password);
      toast.success(`Welcome to Lumière, ${user.name.split(" ")[0]}!`);
      navigate("/account");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <>
      <Seo title="Create Account" description="Create a free Lumière account to track orders, save favorites, and check out faster." canonical="/auth/register" />
      <div className="container-premium section-py">
        <div className="mx-auto max-w-md">
          <div className="card-premium p-8">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl font-semibold">Create your account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Join thousands of customers who shop with us</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Full name" autoComplete="name" {...register("name")} error={errors.name?.message} required />
              <Input label="Email address" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} required />
              <Input label="Password" type="password" autoComplete="new-password" hint="At least 6 characters" {...register("password")} error={errors.password?.message} required />
              <Input label="Confirm password" type="password" autoComplete="new-password" {...register("confirmPassword")} error={errors.confirmPassword?.message} required />

              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" required className="mt-0.5 rounded" />
                <span>I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></span>
              </label>

              <Button type="submit" size="lg" shine className="w-full" disabled={loading}>
                {loading ? "Creating account…" : <>Create Account <ArrowRight size={16} /></>}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
