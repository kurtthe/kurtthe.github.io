import type { Metadata, Viewport } from 'next';
import { asset } from '@/lib/asset';
import './globals.css';

const siteUrl = 'https://kurtthe.github.io';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Jefferson Solano — Front End Web Developer, Brisbane',
  description:
    'Jefferson Solano is a Brisbane front end developer with 5+ years building React.js and Next.js web and mobile experiences, with a focus on accessibility, performance and content-driven sites.',
  alternates: { canonical: '/' },
  icons: { icon: asset('/assets/favicon.svg') },
  openGraph: {
    title: 'Jefferson Solano — Beyond the CV',
    description: 'Digital experiences that work for people. Selected frontend work, experience and the thinking behind it.',
    url: '/',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#eeeee8' };

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jefferson Solano',
  jobTitle: 'Front End Web Developer',
  email: 'mailto:solanojefferson@gmail.com',
  url: siteUrl,
  sameAs: ['https://www.linkedin.com/in/jefferson-solano-b783b973'],
  homeLocation: { '@type': 'Place', name: 'Brisbane, Australia' },
  knowsAbout: ['React.js', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'RESTful APIs', 'Web accessibility', 'WCAG', 'Technical SEO', 'Web performance'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body id="top">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        {children}
      </body>
    </html>
  );
}
