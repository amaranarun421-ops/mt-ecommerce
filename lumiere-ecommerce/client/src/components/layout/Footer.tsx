import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post("/newsletter", { email, source: "FOOTER" });
      toast.success("Thanks for subscribing! Check your inbox for a welcome.");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-auto bg-foreground text-background">
      {/* Newsletter */}
      <section className="border-b border-background/10">
        <div className="container-premium py-12 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-background">
              Join the Lumière list
            </h3>
            <p className="mt-2 text-sm text-background/70 max-w-md">
              Get early access to new collections, members-only offers, and design notes from our studio. No spam — unsubscribe anytime.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              required
              className="flex-1 h-12 rounded-lg bg-background/10 border border-background/20 px-4 text-background placeholder:text-background/50 focus:bg-background/15 focus:ring-2 focus:ring-background/40 outline-none transition"
            />
            <Button type="submit" variant="secondary" size="lg" disabled={loading} className="bg-background text-foreground hover:bg-background/90">
              {loading ? "Subscribing…" : <>Subscribe <ArrowRight size={16} /></>}
            </Button>
          </form>
        </div>
      </section>

      {/* Links */}
      <div className="container-premium py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="font-display text-2xl font-semibold text-background">
            Lumière
          </Link>
          <p className="mt-3 text-sm text-background/70 max-w-sm">
            Premium lifestyle goods, designed in San Francisco and crafted by independent makers around the world. Built to last, made to be lived with.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <a href="mailto:support@lumiere.store" className="flex items-center gap-3 text-background/80 hover:text-background">
              <Mail size={16} /> support@lumiere.store
            </a>
            <a href="tel:+18005550142" className="flex items-center gap-3 text-background/80 hover:text-background">
              <Phone size={16} /> +1 (800) 555-0142
            </a>
            <p className="flex items-center gap-3 text-background/80">
              <MapPin size={16} /> 1208 Market Street, San Francisco, CA 94103
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
              { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-background/20 text-background/80 hover:text-background hover:border-background/40 transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Shop" links={[
          { label: "All Products", href: "/shop" },
          { label: "Best Sellers", href: "/shop?bestSeller=true" },
          { label: "New Arrivals", href: "/shop?newArrival=true" },
          { label: "On Sale", href: "/shop?onSale=true" },
          { label: "Gift Cards", href: "/shop" },
        ]} />

        <FooterCol title="Help" links={[
          { label: "Contact Us", href: "/contact" },
          { label: "FAQ", href: "/faq" },
          { label: "Track Order", href: "/track-order" },
          { label: "Shipping Policy", href: "/shipping" },
          { label: "Returns", href: "/returns" },
          { label: "Size Guide", href: "/size-guide" },
        ]} />

        <FooterCol title="Company" links={[
          { label: "About Us", href: "/about" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Sign In", href: "/auth/login" },
          { label: "Create Account", href: "/auth/register" },
        ]} />
      </div>

      <div className="border-t border-background/10">
        <div className="container-premium py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/60">
          <p>© {new Date().getFullYear()} Lumière. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure checkout</span>
            <span>·</span>
            <span>SSL encrypted</span>
            <span>·</span>
            <span>30-day returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-background uppercase tracking-wider">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.href} className="text-sm text-background/70 hover:text-background transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
