import RemainingLeaves from '@/components/RemainingLeaves';
import { prisma } from '@/lib/database';
import ApplyLeaveForm from './ApplyLeaveForm';
import { StaffType } from '@prisma/client';

export default async function ApplyLeavePage() {
  const james = await prisma.staff.findFirstOrThrow({
    where: {
      name: {
        contains: 'James',
      },
    },
  });

  const reportingOfficers = await prisma.staff.findMany({
    where: {
      type: StaffType.RO
    }
  })

  return (
    <div>
      <RemainingLeaves staffId={james.id} totalLeaves={james.leaves} />
      <ApplyLeaveForm reportingOfficers={reportingOfficers} />
    </div>
  );
}
