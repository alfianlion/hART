import { prisma } from '@/lib/database';

const ApproveLeavePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const leave = await prisma.leave.findUnique({
    where: { id },
    include: {
      ro: true,
      staff: true,
    },
  });

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-slate-100 rounded-md p-3 shadow-md flex flex-col gap-3 max-w-lg">
        <h1 className="text-2xl font-bold">Approve Leave</h1>
        <p>
          Are you sure you want to approve the leave for{' '}
          <b>{leave?.staff.name}</b> dated on ...?
        </p>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition">
            Yes
          </button>
          <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveLeavePage;
