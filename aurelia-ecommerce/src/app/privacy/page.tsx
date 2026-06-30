import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Aurelia collects, uses, and protects your personal information. We never sell your data.',
}

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      description="Your privacy matters. Here is exactly what we collect, why we collect it, and what we do (and don't do) with it."
      lastUpdated="June 2026"
      cta={{ href: '/contact', label: 'Contact us about privacy' }}
      sections={[
        {
          heading: 'The short version',
          body: [
            'We collect the minimum information needed to run an online store: your name, email, shipping address, and payment details (which we never see — they go directly through our PCI-DSS Level 1 certified payment processors). We use your email to send order confirmations and shipping updates. If you opt into marketing, we send occasional product launches and offers. We never sell your data. We never share your data with third parties for advertising. You can opt out of marketing emails at any time.',
          ],
        },
        {
          heading: 'Information we collect',
          body: [
            'We collect three categories of information:',
          ],
          bullets: [
            'Information you provide directly: name, email, shipping address, billing address, phone number, and any notes you add to your order. We also collect your account password (stored as a salted bcrypt hash, never in plain text).',
            'Information collected automatically: IP address, browser type and version, device type, referring URL, pages viewed, time on page, and approximate location (city-level, derived from IP).',
            'Information from payment processors: a payment token from your bank or card network. We never see or store your full card number, expiry, or CVC.',
          ],
        },
        {
          heading: 'How we use your information',
          body: [
            'We use your information to:',
          ],
          bullets: [
            'Process and ship your orders, including calculating tax and shipping, and sending tracking updates.',
            'Respond to your support requests and provide product support.',
            'Prevent fraud and abuse (we use your IP and device info to flag suspicious orders).',
            'Improve our products and website (we look at aggregate, anonymized behavior to see what works and what doesn\'t).',
            'Send you marketing emails — but only if you opt in. You can opt out at any time via the unsubscribe link in any email.',
            'Comply with our legal obligations (tax records, export controls, etc.).',
          ],
        },
        {
          heading: 'What we do NOT do',
          body: [
            'A few things we want to be explicit about:',
          ],
          bullets: [
            'We never sell your personal information to third parties.',
            'We never share your email with third parties for advertising.',
            'We never use your personal information to train AI models.',
            'We never read your order notes for anything other than fulfilling your order.',
            'We never use tracking pixels from social networks (Facebook, Twitter, Pinterest, etc.) in our emails.',
          ],
        },
        {
          heading: 'Cookies and tracking',
          body: [
            'We use first-party cookies to keep you signed in, remember your cart and wishlist, and remember your currency and language preferences. We do not use third-party advertising cookies.',
            'We use privacy-friendly analytics (Plausible) that does not use cookies and does not track you across other websites. We see aggregate page views, top referrers, and country-level location — nothing personally identifiable.',
            'You can clear our cookies at any time in your browser settings. This will sign you out and clear your local cart and wishlist (signed-in users will get their cart and wishlist back on next sign-in).',
          ],
        },
        {
          heading: 'Data retention',
          body: [
            'We retain your order history indefinitely (we need it for warranty claims, tax records, and customer service). We retain your account information for as long as your account is active. If you delete your account, we will remove your personal information within 30 days, except for order records which we are legally required to retain for 7 years.',
          ],
        },
        {
          heading: 'Your rights',
          body: [
            'Depending on your location, you may have the following rights regarding your personal information:',
          ],
          bullets: [
            'The right to access — request a copy of the personal information we hold about you.',
            'The right to rectification — request that we correct inaccurate information.',
            'The right to erasure — request that we delete your personal information (subject to legal retention requirements).',
            'The right to object — object to our processing of your personal information for marketing purposes.',
            'The right to data portability — request your personal information in a machine-readable format.',
            'The right to opt out of sale — we never sell your data, but you can confirm this by contacting us.',
          ],
        },
        {
          heading: 'Security',
          body: [
            'We take security seriously. All traffic is encrypted with TLS 1.3. Payment details are processed through PCI-DSS Level 1 certified providers (Stripe and PayPal) and never touch our servers. Passwords are hashed with bcrypt. We undergo annual third-party security audits and run a bug bounty program. If you believe you have found a security issue, please email security@aurelia.example.com and we will respond within 24 hours.',
          ],
        },
        {
          heading: 'Children',
          body: [
            'Our website is not directed at children under 16, and we do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us and we will delete it.',
          ],
        },
        {
          heading: 'Changes to this policy',
          body: [
            'We will email all active customers at least 30 days before any material change to this policy takes effect. The "Last updated" date at the top of this page reflects the most recent revision.',
          ],
        },
      ]}
    />
  )
}
