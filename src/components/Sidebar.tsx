'use client';

import Link from 'next/link';
import {useState, useEffect} from 'react';
import {usePathname} from 'next/navigation'

const links = [
  {
    label: 'View Leave',
    href: '/'
  },
  {
    label: 'Apply Leave',
    href: '/leaves/apply'
  },
  {
    label: 'Logout',
    href: '/logout'
  }
]

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='h-full w-[412px] max-w-[25%] bg-slate-100 p-6 flex flex-col gap-2 items-center justify-center shadow-lg'>
      {
        links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`text-2xl hover:underline ${
              pathname === link.href ? 'font-bold text-blue-600 hover:text-blue-700' : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            {link.label}
          </Link>
        ))
      }
    </aside>
  )
}
