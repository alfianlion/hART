'use client';

import { Staff } from '@prisma/client';
import {
  CalendarDays,
  LineChart,
  LogOut,
  LucideIcon,
  PlusSquare,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Link = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const internLinks: Link[] = [
  {
    label: 'View Leave',
    href: '/leaves',
    icon: CalendarDays,
  },
  {
    label: 'Apply Leave',
    href: '/leaves/apply',
    icon: PlusSquare,
  },
];

const roLinks: Link[] = [
  {
    label: 'View Pending Leave',
    href: '/leaves',
    icon: CalendarDays,
  },
  {
    label: 'Dashboard',
    href: '/leaves/dashboard',
    icon: LineChart,
  },
];

type SidebarProps = {
  currentUser: Staff;
};

export default function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();

  const links = currentUser.type === 'RO' ? roLinks : internLinks;

  return (
    <aside className="h-full bg-slate-100 p-6 flex flex-col justify-between sticky top-0">
      <div>
        <div className="flex flex-col items-center justify-center gap-1 pb-3 mb-3 border-b border-slate-700/10">
          <Link href="https://www.mom.gov.sg" target="_blank">
            <img src="https://www.mom.gov.sg/html/mom/images/branding/mom-logo-color.svg" />
          </Link>
          <h1 className="font-bold">Hart</h1>
        </div>
        <div className="flex flex-col gap-2">
          {links.map((link, index) => {
            return (
              <Link
                key={index}
                href={link.href}
                className={`whitespace-nowrap min-w-[180px] flex gap-2 items-center p-2 rounded-md transition ${
                  pathname === link.href
                    ? 'font-bold text-white bg-blue-600 hover:bg-blue-600'
                    : 'hover:bg-slate-500/25'
                }`}
              >
                {<link.icon />}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="border-t border-slate-700/10 pt-3">
        <button
          key={'log-out'}
          onClick={() => {
            signOut({
              callbackUrl: `${window.location.origin}/`,
            });
          }}
          className={`whitespace-nowrap min-w-[180px] w-full flex gap-2 items-center p-2 rounded-md transition hover:bg-slate-500/25`}
        >
          <LogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}
