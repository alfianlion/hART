import RemainingLeaves from '@/components/RemainingLeaves';
import CardLeaves from '@/components/CardLeave';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LeaveStatus } from '@prisma/client';
import { prisma } from '@/lib/database';

export default async function LeavesPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect('/login');

  const appliedLeaves = await prisma.leave.findMany({
    where: {
      staffId: currentUser.id,
    },
    include: {
      staff: true,
      ro: true,
    },
  });

  return (
    <div className="container mx-auto flex flex-col gap-3 pb-6">
      <RemainingLeaves
        totalLeaves={currentUser?.leaves ?? 0}
        staffId={currentUser?.id}
      />
      <div className="flex flex-wrap gap-6 justify-center">
        {appliedLeaves.map(leave => (
          <CardLeaves key={leave.id} leave={leave} />
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
