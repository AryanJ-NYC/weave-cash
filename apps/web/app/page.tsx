import { buildPageMetadata, DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_TITLE } from '@/lib/site-metadata';
import {
  Hero,
  Features,
  CLIInstallSection,
  SocialProof,
  CTASection,
} from '@/_components/marketing';

export const metadata = buildPageMetadata({
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <CLIInstallSection />
      <SocialProof />
      <CTASection />
    </>
  );
}
