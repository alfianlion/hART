import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  return (
    <div className="flex h-full w-screen overflow-x-hidden">
      <Sidebar currentUser={currentUser} />
      <main className="p-6 w-full">{children}</main>
    </div>
  );
}
