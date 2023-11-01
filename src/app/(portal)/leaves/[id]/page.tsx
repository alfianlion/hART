import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { EditOrCancelLeavePage } from './_components/EditOrCancelLeavePage';
import { Leave, Staff, StaffType } from '@prisma/client';
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

  if (!leave) return redirect('/leaves');

  if (currentUserRole === 'INTERN') {
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
      <EditOrCancelLeavePage
        leave={leave}
        reportingOfficers={reportingOfficers}
        remainingLeaves={remainingLeaves}
      />
    );
  }

  return <ApproveOrRejectPage id={id} leave={leave} />;
};

type Props = {
  id: string;
  leave:
    | (Leave & {
        staff: Staff;
        ro: Staff;
      })
    | null;
};

const ApproveOrRejectPage = async ({ id }: Props) => {
  const leave = await prisma.leave.findUnique({
    where: { id },
    include: {
      staff: true,
      ro: true,
    },
  });
  return <div></div>;
};

export default LeaveDetailsPage;
