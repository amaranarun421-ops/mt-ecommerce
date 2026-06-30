import { Link } from "react-router-dom";
import { RefreshCcw, Mail, Home } from "lucide-react";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";

export default function ServerErrorPage() {
  return (
    <>
      <Seo title="Server Error" description="Something went wrong on our end. Please try again." canonical="/500" />
      <div className="container-premium section-py min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-md text-center">
          <p className="font-display text-7xl md:text-9xl font-semibold text-destructive">500</p>
          <h1 className="mt-4 font-display text-2xl md:text-3xl font-semibold">Something broke on our end</h1>
          <p className="mt-3 text-muted-foreground">
            We've been notified of the issue and are working on it. Please try again in a moment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button shine onClick={() => window.location.reload()}>
              <RefreshCcw size={16} /> Try Again
            </Button>
            <Link to="/"><Button variant="outline"><Home size={16} /> Back to Home</Button></Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            If the problem persists, <a href="mailto:support@lumiere.store" className="text-primary hover:underline inline-flex items-center gap-1">
              <Mail size={12} /> contact support
            </a>.
          </p>
        </div>
      </div>
    </>
  );
}
