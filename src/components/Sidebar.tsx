'use client';

import { Staff } from '@prisma/client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Link = {
  label: string;
  href?: string;
  onClick?: () => void;
};

const internLinks: Link[] = [
  {
    label: 'View Leave',
    href: '/leaves',
  },
  {
    label: 'Apply Leave',
    href: '/leaves/apply',
  },
  {
    label: 'Logout',
    onClick: () => {
      signOut({
        callbackUrl: `${window.location.origin}/`,
      });
    },
  },
];

const roLinks: Link[] = [
  {
    label: 'View Pending Leave',
    href: '/leaves',
  },
  {
    label: 'Logout',
    onClick: () => {
      signOut({
        callbackUrl: `${window.location.origin}/`,
      });
    },
  },
];

type SidebarProps = {
  currentUser: Staff;
};

export default function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();

  const links = currentUser.type === 'RO' ? roLinks : internLinks;

  return (
    <aside className="h-full w-[412px] max-w-[25%] bg-slate-100 p-6 flex flex-col gap-2 items-center justify-center shadow-lg sticky top-0">
      {links.map((link, index) =>
        link.href ? (
          <Link
            key={index}
            href={link.href}
            className={`text-2xl hover:underline ${
              pathname === link.href
                ? 'font-bold text-blue-600 hover:text-blue-700'
                : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            {link.label}
          </Link>
        ) : (
          <button
            key={index}
            onClick={link.onClick}
            className={`text-2xl hover:underline ${
              pathname === link.href
                ? 'font-bold text-blue-600 hover:text-blue-700'
                : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            {link.label}
          </button>
        )
      )}
    </aside>
  );
}
