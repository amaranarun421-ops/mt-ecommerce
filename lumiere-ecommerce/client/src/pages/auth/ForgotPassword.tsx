import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Seo } from "@/components/shared/Seo";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Mock — in production this would POST to /auth/forgot-password
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Password reset link sent (demo mode)");
    }, 800);
  };

  return (
    <>
      <Seo title="Forgot Password" description="Reset your Lumière account password." canonical="/auth/forgot-password" />
      <div className="container-premium section-py">
        <div className="mx-auto max-w-md">
          <div className="card-premium p-8">
            {sent ? (
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h1 className="font-display text-2xl font-semibold">Check your inbox</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  If an account exists for <span className="font-medium text-foreground">{email}</span>, we've sent a password reset link. The link expires in 30 minutes.
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  Try a different email
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  <Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link>
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send you a reset link</p>
                </div>
                <form onSubmit={submit} className="space-y-4">
                  <Input
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                  <Button type="submit" size="lg" shine className="w-full" disabled={loading}>
                    {loading ? "Sending link…" : <>Send Reset Link <ArrowRight size={16} /></>}
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Remembered your password?{" "}
                  <Link to="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
