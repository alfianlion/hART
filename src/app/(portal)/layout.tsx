import Sidebar from '@/components/Sidebar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-screen">
      <Sidebar />
      <main className="p-6 w-full">{children}</main>
    </div>
  );
}
