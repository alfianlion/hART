import { prisma } from '@/lib/database';
import React from 'react';

type RemainingLeavesProps = {
  staffId: string;
  totalLeaves: number | null;
};

export default async function RemainingLeaves({
  staffId,
  totalLeaves,
}: RemainingLeavesProps) {
  const leaves = await prisma.leave.count({
    where: {
      staffId: staffId,
      leaveStatus: 'APPROVED',
    },
  });

  if (!totalLeaves) return null;

  return (
    <h1 className="font-bold text-2xl w-full text-center">
      Available Leave: {totalLeaves - leaves}/{totalLeaves}
    </h1>
  );
}
