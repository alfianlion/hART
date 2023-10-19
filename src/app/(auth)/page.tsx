import { Footer } from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  return (
    <>
      <main className="w-full">
        <div className="relative">
          <Image
            src="/lander.jpg"
            alt="Lander"
            width={1920}
            height={1080}
            className="w-full h-screen object-cover "
          />
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center max-w-md">
            <h1 className="font-extrabold text-6xl text-center mb-8">
              Automate your Leave / MC HR Processes
            </h1>
            <p className="text-center text-lg mb-6">
              hART, helps you to apply leaves / MC easier so that you can work
              on the tasks that matters.
            </p>
            <Link
              href="/leaves"
              className="px-4 py-2 bg-blue-600 text-slate-200 hover:bg-blue-700 rounded-md flex items-center gap-3 group"
            >
              Start Now{' '}
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
