'use client';

import { Button } from '@/components/Button';
import { signOut } from 'next-auth/react';
import React from 'react';

export default function LogoutPage() {
  return (
    <Button
      onClick={() => {
        signOut({
          callbackUrl: `${window.location.origin}/`,
        });
      }}
    >
      Logout
    </Button>
  );
}
