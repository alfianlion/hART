import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/database';

const LeaveDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const currentUserRole = (await getCurrentUser())!.type;
  const leave = await prisma.leave.findUnique({
    where: { id },
    include: {
      staff: true,
      ro: true,
    },
  });

  return <pre>{JSON.stringify(leave, null, 2)}</pre>;
};

const EditLeavePage = async () => {};

const MoreLeaveDetailsPage = async () => {};

export default LeaveDetailsPage;
