import { Link, useParams } from "react-router-dom";
import { XCircle, RefreshCcw, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Seo } from "@/components/shared/Seo";

export default function PaymentFailedPage() {
  const { orderNumber } = useParams();

  return (
    <>
      <Seo title="Payment Failed" canonical="/order/failed" />
      <div className="container-premium section-py max-w-2xl text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
          <XCircle size={48} />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Payment could not be processed</h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          We weren't able to complete your payment. This can happen for a number of reasons — insufficient funds, an expired card, or a temporary issue with the payment processor.
        </p>

        {orderNumber && (
          <div className="mt-6 inline-block rounded-lg bg-secondary px-4 py-2 text-sm">
            Order reference: <span className="font-mono font-semibold">{orderNumber}</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button shine onClick={() => window.location.reload()}>
            <RefreshCcw size={16} /> Try Again
          </Button>
          <Link to="/checkout">
            <Button variant="outline"><ArrowLeft size={16} /> Back to Checkout</Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost"><Mail size={16} /> Contact Support</Button>
          </Link>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 text-left">
          <h2 className="font-display text-base font-semibold mb-3">What you can try</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Check that your card details were entered correctly</li>
            <li>• Try a different payment method (we support cards, UPI, wallets, and cash on delivery)</li>
            <li>• Contact your bank to confirm the transaction wasn't blocked</li>
            <li>• If the issue persists, our team can help — just reach out</li>
          </ul>
        </div>
      </div>
    </>
  );
}
