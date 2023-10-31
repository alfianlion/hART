import { prisma } from '@/lib/database';

type RemainingLeavesProps = {
  staffId: string;
  totalLeaves: number | null;
};

export default async function RemainingLeaves({
  staffId,
  totalLeaves,
}: RemainingLeavesProps) {
  const leaves = await prisma.leave.findMany({
    where: {
      staffId: staffId,
      leaveStatus: 'APPROVED',
    },
  });

  let remainingLeaves = 0;
  leaves.forEach(leave => {
    remainingLeaves += leave.leaveType === 'FULL' ? 1 : 0.5;
  });

  if (!totalLeaves) return null;

  return (
    <h1 className="font-bold text-2xl w-full text-center">
      Available Leave: {totalLeaves - remainingLeaves}/{totalLeaves}
    </h1>
  );
}
