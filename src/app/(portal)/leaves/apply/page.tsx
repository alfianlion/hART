import RemainingLeaves from '@/components/RemainingLeaves';
import { prisma } from '@/lib/database';
import ApplyLeaveForm from './ApplyLeaveForm';
import { StaffType } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ApplyLeavePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect('/login');

  const reportingOfficers = await prisma.staff.findMany({
    where: {
      type: StaffType.RO,
    },
  });

  const leaves = await prisma.leave.findMany({
    where: {
      staffId: currentUser.id,
      leaveStatus: 'APPROVED',
    },
  });

  let remainingLeaves = 0;
  leaves.forEach(leave => {
    remainingLeaves += leave.leaveType === 'FULL' ? 1 : 0.5;
  });
  remainingLeaves = Math.max((currentUser.leaves ?? 0) - remainingLeaves, 0);

  return (
    <div>
      <RemainingLeaves
        staffId={currentUser.id}
        totalLeaves={currentUser.leaves ?? 0}
      />
      <ApplyLeaveForm
        reportingOfficers={reportingOfficers}
        remainingLeaves={remainingLeaves}
      />
    </div>
  );
}
