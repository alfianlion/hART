import { prisma } from '@/lib/database';
import { Leave } from '@prisma/client';
import { differenceInCalendarDays } from 'date-fns';

type RemainingLeavesProps = {
  staffId: string;
  totalLeaves: number;
};

export const getRemainingLeaves = (total: number, leaves: Leave[]) => {
  return (
    total -
    leaves.reduce((acc, leave) => {
      if (leave.leaveType !== 'FULL') return acc + 0.5;
      const days = differenceInCalendarDays(leave.endDate, leave.startDate) + 1;
      return acc + days;
    }, 0)
  );
};

export default async function RemainingLeaves({
  staffId,
  totalLeaves,
}: RemainingLeavesProps) {
  if (!totalLeaves) return null;

  const leaves = await prisma.leave.findMany({
    where: {
      staffId: staffId,
      leaveStatus: 'APPROVED',
    },
  });

  const remainingLeaves = getRemainingLeaves(totalLeaves, leaves);

  if (!totalLeaves) return null;

  return (
    <h1 className="font-bold text-2xl w-full text-center">
      Available Leave: {remainingLeaves}/{totalLeaves}
    </h1>
  );
}
