import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Red de Libros Latinoamérica',
  description: 'Monitoreo comunitario de distribución de libros en Latinoamérica.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} antialiased`}>{children}</body>
    </html>
  );
}
