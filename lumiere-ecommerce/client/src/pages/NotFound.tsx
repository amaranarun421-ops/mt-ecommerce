import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist or has been moved." canonical="/404" />
      <div className="container-premium section-py min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-md text-center">
          <p className="font-display text-7xl md:text-9xl font-semibold text-gradient-brand">404</p>
          <h1 className="mt-4 font-display text-2xl md:text-3xl font-semibold">This page wandered off</h1>
          <p className="mt-3 text-muted-foreground">
            We couldn't find the page you were looking for. It may have been moved, deleted, or never existed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/"><Button shine><Home size={16} /> Back to Home</Button></Link>
            <Link to="/shop"><Button variant="outline"><Search size={16} /> Browse Products</Button></Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Or <button onClick={() => window.history.back()} className="text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft size={12} /> go back to the previous page
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
