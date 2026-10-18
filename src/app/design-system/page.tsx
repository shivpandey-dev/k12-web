import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DesignSystemPreview } from '@/components/design-system';

export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
};

/** Token reference for developers. Returns 404 in production builds. */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <DesignSystemPreview />;
}
