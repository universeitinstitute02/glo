
import './globals.css';
import ClientProviders from './ClientProviders';

export const metadata = {
  title: 'Glossy Eve',
  description: 'A modern shopping experience for cosmetics and fashion.'
};

export default function RootLayout({
  children


}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>);

}