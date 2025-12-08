'use client';

import { ReactNode } from 'react';

// next
import { SessionProvider } from 'next-auth/react';

// project import
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import { ConfigProvider } from 'contexts/ConfigContext';
import { AuthErrorProvider } from '@/contexts/AuthErrorContext';
import AuthErrorDialog from '@/components/AuthErrorDialog';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider>
      <ThemeCustomization>
        <Locales>
          <ScrollTop>
            <SessionProvider refetchInterval={0}>
              <AuthErrorProvider>
                <Notistack>
                  <Snackbar />
                  <AuthErrorDialog />
                  {children}
                </Notistack>
              </AuthErrorProvider>
            </SessionProvider>
          </ScrollTop>
        </Locales>
      </ThemeCustomization>
    </ConfigProvider>
  );
}
