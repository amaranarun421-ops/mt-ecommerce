import { StaticPage } from "./ShippingPolicy";

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      description="How Lumière collects, uses, and protects your personal information."
      canonical="/privacy"
      sections={[
        { heading: "Our commitment to your privacy", body: [
          "Lumière takes your privacy seriously. This policy explains what information we collect, why we collect it, and how we use it. We never sell your personal data to third parties.",
        ]},
        { heading: "Information we collect", body: [
          "When you create an account or place an order, we collect your name, email, shipping address, billing address, and phone number. We also collect information about your orders, wishlist, and product reviews.",
          "We automatically collect technical information such as your IP address, browser type, and pages visited. This helps us diagnose problems and improve the site.",
        ]},
        { heading: "How we use your information", body: [
          "We use your information to process orders, communicate with you about your purchases, provide customer support, personalize your shopping experience, and (with your permission) send marketing emails.",
          "We may also use aggregated, anonymized data to analyze trends and improve our products and services.",
        ]},
        { heading: "Information sharing", body: [
          "We share your information only with service providers who help us run our business — payment processors, shipping carriers, email providers, and analytics tools. These providers are contractually bound to protect your data and use it only for the services they provide to us.",
          "We may disclose information when required by law or to protect our rights, property, or safety.",
        ]},
        { heading: "Data security", body: [
          "We use industry-standard encryption (SSL/TLS) to protect your data in transit. Payment information is processed by PCI-compliant providers and is never stored on our servers.",
          "Despite our efforts, no system is 100% secure. We cannot guarantee the security of your information, but we work hard to protect it.",
        ]},
        { heading: "Your rights", body: [
          "You have the right to access, correct, or delete your personal information. You can update your profile from your account page, or contact us to request deletion of your account.",
          "You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email or updating your preferences in your account settings.",
        ]},
        { heading: "Cookies", body: [
          "We use cookies to keep you signed in, remember your cart and wishlist, and understand how you use the site. You can control cookies in your browser settings, but disabling them may affect site functionality.",
        ]},
        { heading: "Contact us", body: [
          "If you have questions about this privacy policy or how we handle your data, email us at privacy@lumiere.store or write to us at 1208 Market Street, San Francisco, CA 94103.",
        ]},
      ]}
    />
  );
}
