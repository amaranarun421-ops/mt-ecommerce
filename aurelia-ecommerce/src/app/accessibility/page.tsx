import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Accessibility',
  description: 'Aurelia is committed to making our website usable for everyone, including people with disabilities.',
}

export default function AccessibilityPage() {
  return (
    <PolicyPage
      title="Accessibility"
      description="We are committed to making aurelia.example.com usable for everyone, including people with disabilities. Here's what we've done and what we're working on."
      lastUpdated="June 2026"
      cta={{ href: '/contact', label: 'Report an accessibility issue' }}
      sections={[
        {
          heading: 'Our commitment',
          body: [
            'We believe that good design is accessible design. Our website is built to meet WCAG 2.1 AA standards wherever possible, and we test our pages with both automated tools and real users who rely on assistive technology. If something is not working for you, please tell us — we treat accessibility issues as bugs, not feature requests.',
          ],
        },
        {
          heading: 'What we\'ve done',
          body: [
            'Here are the accessibility features currently in place across the site:',
          ],
          bullets: [
            'Semantic HTML throughout — proper headings, landmarks, lists, and tables for screen reader users.',
            'Keyboard navigation for every interactive element — modals, drawers, dropdowns, and forms all work without a mouse.',
            'Visible focus states on every focusable element — you can always see where you are on the page.',
            'Alt text on every product image — written by humans, not generated.',
            'ARIA labels on icon-only buttons — screen readers announce "Add to cart" not "button".',
            'Color contrast that meets WCAG AA — we test every text/background combination.',
            'Form fields with associated labels and clear error messages — errors are announced on submit and inline.',
            'Skip-to-content link on every page — keyboard users can jump past the navigation.',
            'Respect for prefers-reduced-motion — animations are disabled or reduced when the user requests it.',
            'Respect for prefers-color-scheme — automatic dark mode based on your OS setting.',
          ],
        },
        {
          heading: 'Known issues',
          body: [
            'We are aware of the following accessibility issues and are working to fix them:',
          ],
          bullets: [
            'The product image gallery on the product detail page does not yet support swipe gestures on iOS with VoiceOver. Workaround: use the thumbnail buttons. Fix expected: Q3 2026.',
            'The color filter on the shop page is not yet operable with voice control software. Workaround: use the category checkboxes. Fix expected: Q3 2026.',
            'Some complex data tables (the warranty comparison table) do not yet have proper scope attributes for screen readers. Fix expected: Q3 2026.',
          ],
        },
        {
          heading: 'Compatibility with assistive technology',
          body: [
            'We test our site with the following assistive technology:',
          ],
          bullets: [
            'NVDA on Windows (latest version, Firefox)',
            'JAWS on Windows (latest version, Chrome)',
            'VoiceOver on macOS (latest version, Safari)',
            'VoiceOver on iOS (latest version, Safari)',
            'TalkBack on Android (latest version, Chrome)',
            'Dragon NaturallySpeaking on Windows (for voice control)',
            'Keyboard-only navigation (no mouse, no AT)',
          ],
        },
        {
          heading: 'How to report an issue',
          body: [
            'If you encounter an accessibility issue, please contact us. Include as much of the following as you can:',
          ],
          bullets: [
            'The URL of the page where you encountered the issue.',
            'A description of what you expected to happen and what actually happened.',
            'The assistive technology and browser you are using (e.g., "NVDA 2024.1 with Firefox 125").',
            'A screenshot or screen recording, if possible.',
          ],
        },
        {
          heading: 'Response time',
          body: [
            'We acknowledge accessibility reports within one business day. Critical issues (a page is completely unusable with a screen reader) are prioritized and typically fixed within 5 business days. Non-critical issues are batched into our regular release cycle, typically every 2 weeks.',
          ],
        },
        {
          heading: 'Third-party content',
          body: [
            'Some content on our site is provided by third parties (payment forms, product review widgets, social media embeds). We require our third-party vendors to meet WCAG 2.1 AA, but we cannot guarantee their compliance. If you encounter an accessibility issue with a third-party widget, please report it — we will work with the vendor to fix it or replace them.',
          ],
        },
      ]}
    />
  )
}
