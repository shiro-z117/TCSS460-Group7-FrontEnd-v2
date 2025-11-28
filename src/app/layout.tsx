import type { Metadata, Viewport } from 'next';

import './globals.css';

// PROJECT IMPORTS
import ProviderWrapper from './ProviderWrapper';
import { publicSans } from 'config';

export const metadata: Metadata = {
  title: 'PIBBLE: Movies & TV Shows',
  description: 'PIBBLE: Movies & TV Shows'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={publicSans.className}>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
