'use client';

import { cn } from '@/lib/utils';
import { Staff } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

type NavbarProps = {
  user: Staff | null;
};

export const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-slate-100 shadow-md p-3 fixed top-0 left-0 z-50">
      <div className="flex justify-between container mx-auto items-center">
        <Link href="/" className="text-2xl font-bold">
          hART
        </Link>
        {user == null ? (
          <Link
            href="/login"
            className={cn(
              'text-blue-600 hover:bg-blue-600/20 px-4 p-2 rounded-md transition',
              pathname === '/login' && 'font-bold text-blue-700'
            )}
          >
            Login
          </Link>
        ) : (
          <button
            className={cn(
              'text-blue-600 hover:bg-blue-600/20 px-4 p-2 rounded-md transition',
              pathname === '/logout' && 'font-bold text-blue-700'
            )}
            onClick={() => signOut()}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};
