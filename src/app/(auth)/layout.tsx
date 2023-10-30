import { Navbar } from '@/components/Navbar';
import { getCurrentUser } from '@/lib/auth';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
