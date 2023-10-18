import { TextField } from '@/components/TextField';
import { prisma } from '@/lib/database';

export default async function Home() {
  const staffs = await prisma.staff.findMany();

  return (
    <div className='container mx-auto'>
      {staffs.map(staff => (
        <div>{staff.name}</div>
      ))}
    </div>
  );
}
