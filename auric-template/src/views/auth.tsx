"use client";

import { useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AuthPage({ mode = "signin" }: { mode?: "signin" | "signup" | "forgot" | "reset" }) {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const { signIn } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [pwUpdated, setPwUpdated] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = (fd.get("email") as string) || "";
    const name = (fd.get("name") as string) || "";

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "signin" || mode === "signup") {
        signIn(email, name);
        toast.success(mode === "signin" ? "Welcome back" : "Account created");
        navigate("/account");
      } else if (mode === "forgot") {
        setResetSent(true);
        toast.success("Reset link sent");
      } else if (mode === "reset") {
        setPwUpdated(true);
        toast.success("Password updated");
      }
    }, 1200);
  };

  const titles: Record<typeof mode, { title: string; subtitle: string }> = {
    signin: { title: t("auth.welcomeBack"), subtitle: t("auth.signInSubtitle") },
    signup: { title: t("auth.createAccount"), subtitle: t("auth.createAccountSubtitle") },
    forgot: { title: t("auth.forgot"), subtitle: t("auth.forgotSubtitle") },
    reset: { title: t("auth.reset"), subtitle: t("auth.resetSubtitle") },
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: titles[mode].title },
        ]}
      />

      <div className="text-center mt-6 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center mx-auto mb-5 font-display text-2xl font-bold">
          A
        </div>
        <h1 className="font-display text-3xl font-semibold mb-2">{titles[mode].title}</h1>
        <p className="text-sm text-muted-foreground">{titles[mode].subtitle}</p>
      </div>

      <Card className="border-border shadow-soft">
        <CardContent className="p-6 lg:p-8">
          {mode === "forgot" && resetSent ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">{t("auth.resetSent", { email: "your@email.com" })}</p>
              <Button onClick={() => navigate("/login")} variant="outline">
                {t("auth.signIn")}
              </Button>
            </div>
          ) : mode === "reset" && pwUpdated ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">{t("auth.passwordUpdated")}</p>
              <Button onClick={() => navigate("/login")} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {t("auth.signIn")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("auth.name")}</Label>
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input name="name" required className="ps-9" placeholder="Marcus Reed" />
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-1.5 block">{t("auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" name="email" required className="ps-9" placeholder="your@email.com" />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-sm font-medium">{mode === "reset" ? t("auth.newPassword") : t("auth.password")}</Label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-xs text-accent hover:underline"
                      >
                        {t("auth.forgot")}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPw ? "text" : "password"}
                      name="password"
                      required
                      className="ps-9 pe-9"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Toggle password visibility"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "signin" && (
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="accent-accent" />
                  {t("auth.rememberMe")}
                </label>
              )}

              {mode === "signup" && (
                <p className="text-xs text-muted-foreground">{t("auth.terms")}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin me-2" />
                ) : null}
                {mode === "signin" && t("auth.signInButton")}
                {mode === "signup" && t("auth.signUpButton")}
                {mode === "forgot" && t("auth.resetButton")}
                {mode === "reset" && t("auth.updatePassword")}
              </Button>

              {(mode === "signin" || mode === "signup") && (
                <>
                  <div className="relative py-2">
                    <Separator />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-background px-3 text-xs text-muted-foreground">
                        {t("auth.signInWith")}
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" onClick={() => { signIn("google@user.com", "Google User"); navigate("/account"); }}>
                      Google
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { signIn("apple@user.com", "Apple User"); navigate("/account"); }}>
                      Apple
                    </Button>
                  </div>
                </>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {mode === "signin" && (
          <>
            {t("auth.noAccount")}{" "}
            <button onClick={() => navigate("/register")} className="text-accent font-medium hover:underline">
              {t("auth.signUp")}
            </button>
          </>
        )}
        {(mode === "signup" || mode === "forgot" || mode === "reset") && (
          <>
            {t("auth.haveAccount")}{" "}
            <button onClick={() => navigate("/login")} className="text-accent font-medium hover:underline">
              {t("auth.signIn")}
            </button>
          </>
        )}
      </p>
    </div>
  );
}

function Separator() {
  return <div className="h-px bg-border" />;
}
