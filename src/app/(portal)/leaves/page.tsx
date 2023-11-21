import CardLeaves from '@/components/CardLeave';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/database';
import { z } from 'zod';

type LeavesPageProps = {
  searchParams: unknown;
};

const SearchParamsSchema = z.object({
  id: z.string(),
  mode: z.enum(['approve', 'reject']),
});

export default async function LeavesPage({ searchParams }: LeavesPageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect('/login');

  const isIntern = currentUser.type === 'INTERN';

  const appliedLeaves = await prisma.leave.findMany({
    where: {
      ...(isIntern
        ? {
            staffId: currentUser.id,
          }
        : {
            roId: currentUser.id,
          }),
      ...(isIntern
        ? {}
        : {
            leaveStatus: 'PENDING',
          }),
    },
    include: {
      staff: true,
      ro: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  const data = SearchParamsSchema.safeParse(searchParams);

  return (
    <div className="container mx-auto flex flex-col gap-3 pb-6">
      <div className="flex flex-wrap gap-6 justify-center">
        {appliedLeaves.map(leave => (
          <CardLeaves
            key={leave.id}
            leave={leave}
            isIntern={isIntern}
            showModal={
              data.success && data.data.id === leave.id
                ? data.data.mode
                : undefined
            }
          />
        ))}
        {appliedLeaves.length === 0 && (
          <div className="text-center text-gray-500">
            You have not applied for any leaves yet.
          </div>
        )}
      </div>
    </div>
  );
}
