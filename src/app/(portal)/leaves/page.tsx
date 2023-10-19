import RemainingLeaves from '@/components/RemainingLeaves';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/database';

export default async function LeavesPage() {
  const staffs = await prisma.staff.findMany();
  const authUser = await getAuthUser();
  const currentUser = staffs.find(staff => staff.id == authUser?.id)!;

  return (
    <div className="container mx-auto">
      <RemainingLeaves
        totalLeaves={currentUser?.leaves}
        staffId={currentUser?.id}
      />
      <span className="font-bold">Logged in as {currentUser.name}</span>
      {staffs.map(staff => (
        <div>{staff.name}</div>
      ))}
    </div>
  );
}
