import { LoggedInNavbar } from '@/components/LoggedInNavbar';
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
      <div className="w-full min-h-screen flex flex-col">
        <LoggedInNavbar currentUser={currentUser} />
        <main className="p-6 w-full flex-1">{children}</main>
      </div>
    </div>
  );
}
