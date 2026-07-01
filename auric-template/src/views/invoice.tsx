"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { sampleOrders, companyInfo } from "@/lib/data";
import { Download, Printer, FileText } from "lucide-react";

export function InvoicePage() {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const order = sampleOrders[0];
  const tax = Math.round(order.total * 0.08);
  const subtotal = order.total - tax;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.account"), href: "/account" },
          { label: t("invoice.title") },
        ]}
      />

      <div className="flex items-center justify-between flex-wrap gap-3 mt-4 mb-6">
        <h1 className="font-display text-3xl font-semibold">{t("invoice.title")}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 me-2" />
            {t("invoice.print")}
          </Button>
          <Button onClick={() => alert("PDF download simulated")} className="bg-foreground hover:bg-foreground/90 text-background">
            <Download className="w-4 h-4 me-2" />
            {t("invoice.download")}
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-soft">
        <CardContent className="p-8 lg:p-12">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center font-display font-bold text-sm">
                  A
                </div>
                <span className="font-display text-xl font-semibold">AURIC Audio</span>
              </div>
              <p className="text-xs text-muted-foreground">{companyInfo.address}</p>
              <p className="text-xs text-muted-foreground">{companyInfo.email}</p>
              <p className="text-xs text-muted-foreground">VAT: {companyInfo.vat}</p>
            </div>
            <div className="text-end">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("invoice.number")}</p>
              <p className="font-display text-lg font-semibold mb-2">INV-{order.id.split("-")[1]}-2025</p>
              <p className="text-xs text-muted-foreground">{t("invoice.date")}: Jun 15, 2025</p>
              <p className="text-xs text-muted-foreground">{t("invoice.due")}: Jun 15, 2025</p>
            </div>
          </div>

          {/* Bill to / Ship to */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("invoice.billTo")}</p>
              <p className="font-medium">Marcus Reed</p>
              <p className="text-sm text-muted-foreground">marcus@example.com</p>
              <p className="text-sm text-muted-foreground">+1 (917) 555-0142</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("invoice.shipTo")}</p>
              <p className="font-medium">Marcus Reed</p>
              <p className="text-sm text-muted-foreground">247 Bedford Avenue, Apt 4B</p>
              <p className="text-sm text-muted-foreground">Brooklyn, NY 11211, USA</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-start py-3 font-semibold">{t("invoice.item")}</th>
                <th className="text-center py-3 font-semibold">{t("invoice.qty")}</th>
                <th className="text-end py-3 font-semibold">{t("invoice.price")}</th>
                <th className="text-end py-3 font-semibold">{t("invoice.total")}</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variant}</p>
                  </td>
                  <td className="py-4 text-center tabular-nums">{item.qty}</td>
                  <td className="py-4 text-end tabular-nums">${item.price}</td>
                  <td className="py-4 text-end font-semibold tabular-nums">${(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-6">
            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invoice.subtotal")}</span>
                <span className="tabular-nums">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invoice.shipping")}</span>
                <span className="text-accent">{t("cart.free")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invoice.tax")} (8%)</span>
                <span className="tabular-nums">${tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>{t("invoice.grandTotal")}</span>
                <span className="font-display tabular-nums">${order.total}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">{t("invoice.thanks")}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {companyInfo.legalName} · {companyInfo.address} · {companyInfo.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
