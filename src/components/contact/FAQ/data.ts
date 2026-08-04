export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItemData[] = [
  {
    id: 'faq-1',
    question: 'What is a typical project timeline?',
    answer: 'Our project timelines vary depending on complexity and scope. A standard web application might take 8-12 weeks from discovery to launch, while simpler marketing sites typically take 4-6 weeks. We provide a detailed timeline during the discovery phase.',
  },
  {
    id: 'faq-2',
    question: 'How do you structure your pricing?',
    answer: 'We offer value-based pricing tailored to your specific requirements. After our initial discovery call, we provide a detailed proposal with transparent pricing. We typically work on a fixed-fee basis for clear scopes, or a retainer model for ongoing development.',
  },
  {
    id: 'faq-3',
    question: 'What happens during a discovery call?',
    answer: 'The discovery call is a 30-45 minute conversation where we learn about your business goals, current challenges, and technical requirements. It helps us determine if we\'re a good fit and forms the foundation for our project proposal.',
  },
  {
    id: 'faq-4',
    question: 'What is your communication process during a project?',
    answer: 'We maintain transparent communication through weekly status meetings, a dedicated Slack channel for daily queries, and a shared project management board (like Linear or Jira) so you always know exactly what we\'re working on.',
  },
  {
    id: 'faq-5',
    question: 'What technologies do you specialize in?',
    answer: 'We specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and Tailwind CSS. We choose the best tech stack for your specific needs, focusing on performance, scalability, and maintainability.',
  },
  {
    id: 'faq-6',
    question: 'Do you offer maintenance and support?',
    answer: 'Yes, we offer ongoing maintenance and support packages. These cover regular security updates, performance monitoring, bug fixes, and minor feature additions to ensure your digital product remains secure and up-to-date.',
  },
  {
    id: 'faq-7',
    question: 'How do you handle hosting and deployment?',
    answer: 'We typically deploy modern web applications using platforms like Vercel or AWS, depending on your infrastructure requirements. We set up automated CI/CD pipelines to ensure smooth, zero-downtime deployments.',
  },
  {
    id: 'faq-8',
    question: 'How do you ensure data security?',
    answer: 'Security is baked into our development process. We follow industry best practices, including data encryption, secure authentication (like OAuth or JWT), regular vulnerability scanning, and adherence to GDPR/CCPA guidelines where applicable.',
  },
  {
    id: 'faq-9',
    question: 'Will my project remain confidential?',
    answer: 'Absolutely. We take confidentiality seriously and are happy to sign a Non-Disclosure Agreement (NDA) before discussing any sensitive information about your project or business ideas.',
  },
  {
    id: 'faq-10',
    question: 'What happens after the product is launched?',
    answer: 'Post-launch, we provide a 30-day warranty period for any critical bug fixes. After that, we can seamlessly transition into a maintenance plan or a phased approach for building future features.',
  },
];
