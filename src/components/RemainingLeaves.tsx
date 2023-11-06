import { prisma } from '@/lib/database';
import { Leave } from '@prisma/client';
import { differenceInCalendarDays } from 'date-fns';

type RemainingLeavesProps = {
  staffId: string;
  totalLeaves: number;
};

export const getRemainingLeaves = (total: number, leaves: Leave[]) => {
  return leaves.reduce((totalLeaves, l) => {
    return (
      totalLeaves +
      (l.leaveType === 'FULL'
        ? differenceInCalendarDays(l.startDate, l.endDate) - 1
        : -0.5)
    );
  }, total);
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
