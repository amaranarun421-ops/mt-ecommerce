import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Thanks for reaching out! We'll reply within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "", phone: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Contact Us" description="Get in touch with Lumière. We respond within 24 hours, Monday through Friday." canonical="/contact" />
      <div className="container-premium section-py">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} className="mb-6" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-semibold">Get in touch</h1>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Questions about a product, an order, or a custom request? We're here to help and reply within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <form onSubmit={submit} className="card-premium p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Select label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                <option value="">Choose a topic…</option>
                <option value="Order question">Order question</option>
                <option value="Product question">Product question</option>
                <option value="Return or exchange">Return or exchange</option>
                <option value="Wholesale inquiry">Wholesale inquiry</option>
                <option value="Press">Press</option>
                <option value="Other">Other</option>
              </Select>
              <Textarea
                label="Your message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                placeholder="How can we help?"
                required
              />
              <Button type="submit" size="lg" shine disabled={loading}>
                {loading ? "Sending…" : <><Send size={16} /> Send Message</>}
              </Button>
            </form>

            <aside className="space-y-4">
              <div className="card-premium p-5">
                <h3 className="font-display text-base font-semibold mb-3">Other ways to reach us</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail size={16} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <a href="mailto:support@lumiere.store" className="font-medium hover:text-primary">support@lumiere.store</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone size={16} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <a href="tel:+18005550142" className="font-medium hover:text-primary">+1 (800) 555-0142</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin size={16} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Studio</p>
                      <p className="font-medium">1208 Market Street<br />San Francisco, CA 94103</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock size={16} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Hours</p>
                      <p className="font-medium">Mon–Fri, 9am–6pm PT</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card-premium p-5 bg-accent/30 border-accent">
                <h3 className="font-display text-base font-semibold mb-1">Quick answers</h3>
                <p className="text-sm text-muted-foreground">Many common questions are answered in our FAQ — check there first for instant answers.</p>
                <a href="/faq" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">View FAQ →</a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
