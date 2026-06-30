import { StaticPage } from "./ShippingPolicy";

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms of Service"
      description="The terms and conditions that govern your use of Lumière's website and services."
      canonical="/terms"
      sections={[
        { heading: "Acceptance of terms", body: [
          "By accessing or using Lumière's website, you agree to be bound by these Terms of Service. If you don't agree with any part of these terms, please don't use our site.",
        ]},
        { heading: "Eligibility", body: [
          "You must be at least 18 years old to make purchases on our site. By placing an order, you represent that you are 18 or older and legally able to enter into binding contracts.",
        ]},
        { heading: "Account responsibility", body: [
          "You're responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately if you suspect unauthorized use.",
        ]},
        { heading: "Pricing and availability", body: [
          "We do our best to ensure all prices and product information on our site are accurate. Occasionally, errors occur — we reserve the right to correct errors and update prices without notice.",
          "If you place an order at an incorrect price, we'll contact you before processing. You'll have the option to confirm at the correct price or cancel your order.",
        ]},
        { heading: "Orders and payment", body: [
          "When you place an order, you authorize us to charge your payment method for the total amount shown. All orders are subject to acceptance and availability.",
          "We reserve the right to refuse or cancel any order at our discretion, including orders that appear fraudulent or that violate these terms.",
        ]},
        { heading: "Shipping and delivery", body: [
          "Delivery times are estimates and not guaranteed. We're not liable for delays caused by carriers, weather, or other events outside our control.",
          "Risk of loss passes to you upon delivery. If your package is lost in transit, contact us and we'll work with the carrier to resolve it.",
        ]},
        { heading: "Returns and refunds", body: [
          "Our return policy is described in detail on our Returns page. By placing an order, you agree to the terms of that policy.",
        ]},
        { heading: "Intellectual property", body: [
          "All content on this site — including text, graphics, logos, images, and software — is the property of Lumière or its licensors and is protected by copyright, trademark, and other laws.",
          "You may not reproduce, distribute, or create derivative works from our content without our written permission.",
        ]},
        { heading: "Limitation of liability", body: [
          "To the maximum extent permitted by law, Lumière is not liable for any indirect, incidental, special, or consequential damages arising from your use of our site or products.",
          "Our total liability for any claim arising from your use of our site or products is limited to the amount you paid us in the past 12 months.",
        ]},
        { heading: "Changes to these terms", body: [
          "We may update these terms from time to time. The 'last updated' date at the top reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated terms.",
        ]},
        { heading: "Contact", body: [
          "Questions about these terms? Email us at legal@lumiere.store or write to 1208 Market Street, San Francisco, CA 94103.",
        ]},
      ]}
    />
  );
}
