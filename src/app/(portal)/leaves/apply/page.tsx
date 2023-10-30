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
      type: StaffType.RO
    }
  })

  return (
    <div>
      <RemainingLeaves staffId={currentUser.id} totalLeaves={currentUser.leaves ?? 0} />
      <ApplyLeaveForm reportingOfficers={reportingOfficers} />
    </div>
  );
}
