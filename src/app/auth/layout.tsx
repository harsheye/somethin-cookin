import Footer from '@/components/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <main>{children}</main>
      
    </div>
  );
}