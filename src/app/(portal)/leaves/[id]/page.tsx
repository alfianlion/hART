import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { EditOrCancelLeavePage } from './EditOrCancelLeavePage';
import { StaffType } from '@prisma/client';
import { redirect } from 'next/navigation';

const LeaveDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const currentUser = (await getCurrentUser())!;
  const currentUserRole = currentUser.type;
  const leave = await prisma.leave.findUnique({
    where: { id },
    include: {
      staff: true,
      ro: true,
    },
  });

  if (!leave || currentUserRole === "RO") return redirect('/leaves');

  const reportingOfficers = await prisma.staff.findMany({
    where: {
      type: StaffType.RO,
    },
  });

  return (
    <EditOrCancelLeavePage
      leave={leave}
      reportingOfficers={reportingOfficers}
      remainingLeaves={
        currentUser.remainingLeaves ?? currentUser.leaves ?? 12
      }
    />
  );
};

export default LeaveDetailsPage;
