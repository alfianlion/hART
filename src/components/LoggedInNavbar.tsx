import { prisma } from '@/lib/database';
import { Staff } from '@prisma/client';

type LoggedInNavbarProps = {
  currentUser: Staff;
};

export const LoggedInNavbar = async ({ currentUser }: LoggedInNavbarProps) => {
  const remainingLeaves = currentUser.remainingLeaves;

  const pendingLeaves =
    currentUser.type === 'RO'
      ? await prisma.leave.count({
          where: {
            leaveStatus: 'PENDING',
            roId: currentUser.id,
          },
        })
      : null;

  return (
    <nav className="w-full bg-slate-100 sticky top-0 p-6 z-50 border-l border-slate-700/10 border-b flex justify-between">
      <h1>
        Hi, <b>{currentUser.name}</b>
      </h1>
      {currentUser.type === 'INTERN' && remainingLeaves != null ? (
        <p>
          <b>{remainingLeaves}</b> leaves left
        </p>
      ) : null}
      {currentUser.type === 'RO' && pendingLeaves != null ? (
        <p>
          <b>{pendingLeaves}</b> pending leaves
        </p>
      ) : null}
    </nav>
  );
};
