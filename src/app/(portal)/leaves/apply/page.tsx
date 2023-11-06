import RemainingLeaves, {
  getRemainingLeaves,
} from '@/components/RemainingLeaves';
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

  const remainingLeaves = getRemainingLeaves(currentUser.leaves ?? 0, leaves);

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
