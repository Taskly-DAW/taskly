import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex antialiased`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
