import { prisma } from '@/lib/database';

export default async function Home() {
  const leaves = await prisma.leave.findMany();

  return (
    <div>
      {leaves.map(leave => (
        <div>{leave.staffId}</div>
      ))}
    </div>
  );
}
