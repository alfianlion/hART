import RemainingLeaves from '@/components/RemainingLeaves';
import { prisma } from '@/lib/database';

export default async function Home() {
  const staffs = await prisma.staff.findMany();
  const james = staffs.find(staff => staff.name.includes('James'))!;

  return (
    <div className="container mx-auto">
      <RemainingLeaves 
        totalLeaves={james.leaves}
        staffId={james.id}
      />
      {staffs.map(staff => (
        <div>{staff.name}</div>
      ))}
    </div>
  );
}
