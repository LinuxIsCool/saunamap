import '../styles/globals.css'
import PlausibleProvider from 'next-plausible'
import { ClerkProvider } from '@clerk/nextjs'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <PlausibleProvider domain="crossywalk.com">
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
        </ClerkProvider>
    </PlausibleProvider>
  );
}
