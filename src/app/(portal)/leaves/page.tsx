import RemainingLeaves from '@/components/RemainingLeaves';
import CardLeaves from '@/components/CardLeave';
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
      <div className='flex flex-row flex-wrap space-x-6 w-screen'>
        <CardLeaves 
          leaveStatus='Approved'
          startDate='10 October 2023'
          endDate='13 October 2023'/>
          <CardLeaves 
          leaveStatus='Rejected'
          startDate='10 October 2023'
          endDate='13 October 2023'/>
          <CardLeaves 
          leaveStatus='Approved'
          startDate='10 October 2023'
          endDate='13 October 2023'/>
      </div>
      {staffs.map(staff => (
        <div>{staff.name}</div>
      ))}
    </div>
  );
}
