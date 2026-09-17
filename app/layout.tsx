import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Red de Libros Latinoamérica',
  description: 'Monitoreo comunitario de distribución de libros en Latinoamérica.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
