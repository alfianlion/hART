'use client';

import { Button } from '@/components/Button';
import { Footer } from '@/components/Footer';
import { TextField } from '@/components/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
});

export default function LoginPage() {
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
      callbackUrl: searchParams.get('callbackUrl') ?? '/leaves',
    });
    if (!result?.ok) {
      return toast.error('Invalid email or password');
    }
    window.location.href = result.url ?? '/leaves';
  };

  return (
    <>
      <main className="w-full h-screen flex justify-center items-center gap-12 flex-col">
        <h1 className="text-3xl font-bold">Login</h1>
        <form
          className="bg-slate-100 p-4 rounded-md shadow w-full max-w-lg flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            label="Email"
            placeholder="e.g. joe@mom.gov.sg"
            error={errors.email?.message}
            {...register('email')}
          />
          <TextField
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button
            className="w-full mt-3"
            type="submit"
            isLoading={isSubmitting}
          >
            Login
          </Button>
        </form>
      </main>
      <Footer />
    </>
  );
}
