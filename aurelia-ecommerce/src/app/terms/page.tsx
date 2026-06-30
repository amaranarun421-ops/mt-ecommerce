import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions that govern your use of the Aurelia website and your purchases from us.',
}

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      description="The terms and conditions that govern your use of aurelia.example.com and your purchases from us. Please read them carefully."
      lastUpdated="June 2026"
      cta={{ href: '/contact', label: 'Ask a question about our terms' }}
      sections={[
        {
          heading: 'Acceptance of terms',
          body: [
            'By accessing or using the Aurelia website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.',
            'These terms apply to all visitors, users, and others who access or use the service. We may revise these terms at any time — material changes will be communicated by email at least 30 days before they take effect.',
          ],
        },
        {
          heading: 'Use of the website',
          body: [
            'You may use our website only for lawful purposes and in accordance with these Terms. You agree not to:',
          ],
          bullets: [
            'Use the service in any way that violates applicable federal, state, local, or international law or regulation.',
            'Impersonate or attempt to impersonate the company, an employee, another user, or any other person or entity.',
            'Engage in any conduct that restricts or inhibits anyone\'s use of the service, or that may damage or overburden the service.',
            'Use any robot, spider, or other automatic device to access the service for any purpose without our express written permission.',
            'Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the service, the server on which it is hosted, or any server, computer, or database connected to the service.',
            'Place an order with the intent to defraud, or with knowledge that the payment method used is not authorized.',
          ],
        },
        {
          heading: 'Products and pricing',
          body: [
            'We make every effort to display the colors and features of our products as accurately as possible. However, we do not guarantee that your device\'s display will accurately reflect the color of the product you receive. Slight variations in materials, glazes, and finishes are part of the handmade nature of many of our products.',
            'All prices are listed in US dollars unless otherwise noted. We reserve the right to correct errors in pricing or product information without notice. If you have placed an order at an incorrect price, we will contact you before processing the order to confirm the correct price.',
            'We reserve the right to limit the quantity of any product we sell and to refuse any order. We may discontinue any product at any time.',
          ],
        },
        {
          heading: 'Orders and payment',
          body: [
            'When you place an order, you will receive an order confirmation email. This email confirms that we have received your order — it does not constitute acceptance of your order. We accept your order (and form a contract) when we ship the items.',
            'We accept Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, PayPal, and Affirm. Payment is processed at the time of order confirmation. We reserve the right to refuse or cancel any order at our discretion, including orders that we suspect may be fraudulent.',
            'If your payment is declined, your order will be cancelled. We will not be held responsible for any direct or indirect damages resulting from a declined payment.',
          ],
        },
        {
          heading: 'Shipping and delivery',
          body: [
            'Shipping times are estimates and not guaranteed. We are not responsible for shipping delays caused by carriers, weather, customs, or other events outside our control. Risk of loss passes to you when the package is delivered to your address — for freight deliveries, when the carrier places the item in your room of choice.',
            'For full shipping details, see our shipping policy.',
          ],
        },
        {
          heading: 'Returns and refunds',
          body: [
            'Our return policy is described in detail on our returns page. By placing an order, you agree to the terms of that policy. Items returned in violation of the policy may be subject to a restocking fee or refused entirely.',
          ],
        },
        {
          heading: 'Warranty',
          body: [
            'Our products carry the warranties described on our warranty page. Warranty does not cover damage caused by misuse, neglect, modification, normal wear and tear, or natural disasters. To make a warranty claim, contact our studio team with your order number and a description of the issue.',
          ],
        },
        {
          heading: 'Intellectual property',
          body: [
            'The service and its original content, features, and functionality — including but not limited to text, graphics, logos, product photography, and software — are the exclusive property of Aurelia Studio, Inc. and are protected by copyright, trademark, and other intellectual property laws.',
            'You may not reproduce, distribute, modify, or create derivative works of any content from this site without our express written permission. Product photography may not be used in any commercial context without a license.',
          ],
        },
        {
          heading: 'User reviews and content',
          body: [
            'If you submit a product review, photo, or other content to our site, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, publish, and distribute that content in connection with our business. You represent that you own or have the necessary rights to submit the content, and that the content does not violate the rights of any third party.',
            'We reserve the right to remove or edit any user-submitted content at our discretion.',
          ],
        },
        {
          heading: 'Limitation of liability',
          body: [
            'To the maximum extent permitted by law, Aurelia Studio, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of your use of the service or any products purchased from us. Our total liability for any claim arising from these terms or your use of the service is limited to the amount you paid us in the past 12 months.',
          ],
        },
        {
          heading: 'Indemnification',
          body: [
            'You agree to indemnify and hold harmless Aurelia Studio, Inc. and its affiliates from any claim or demand, including reasonable attorneys\' fees, made by any third party due to or arising out of your breach of these Terms, your misuse of the service, or your violation of any law or the rights of a third party.',
          ],
        },
        {
          heading: 'Governing law',
          body: [
            'These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any dispute arising under these Terms shall be resolved in the state or federal courts located in Kings County, New York.',
          ],
        },
        {
          heading: 'Changes to these terms',
          body: [
            'We reserve the right to revise these terms at any time. Material changes will be communicated by email at least 30 days before they take effect. By continuing to use the service after changes take effect, you agree to be bound by the revised terms.',
          ],
        },
      ]}
    />
  )
}
