'use client';
import { Leave, LeaveStatus, LeaveType, Staff } from '@prisma/client';
import { format, isSameDay } from 'date-fns';
import { CalendarRangeIcon, ClipboardEdit, User2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { FC, ReactNode, Suspense } from 'react';
import { ApproveLeaveModal } from '@/app/(portal)/leaves/_components/ApproveLeaveModal';
import { RejectLeaveModal } from '@/app/(portal)/leaves/_components/RejectLeaveModal';

type CardProps = {
  leave: Leave & {
    staff: Staff;
    ro: Staff;
  };
  isIntern: boolean;
  showModal: 'approve' | 'reject' | undefined;
};

export default function CardLeaves({ leave, isIntern, showModal }: CardProps) {
  const {
    leaveStatus,
    startDate,
    endDate,
    leaveType,
    ro,
    leaveDetails,
    rejectedDetails,
    staff,
  } = leave;

  const badgeColors = {
    APPROVED: 'bg-green-100 border border-green-200 text-green-600',
    REJECTED: 'bg-red-100 border border-red-200 text-red-600',
    PENDING: 'bg-amber-100 border border-amber-200 text-amber-600',
    CANCELLED: 'bg-gray-100 border border-gray-200 text-gray-600',
  } as {
    [key in LeaveStatus]: string;
  };

  const leaveTypes = {
    FULL: 'Full day',
    HALF_AM: 'Half day (AM)',
    HALF_PM: 'Half day (PM)',
  } as {
    [key in LeaveType]: string;
  };

  const Parent: FC<{ children: ReactNode }> = ({ children }) => {
    const className = `relative shadow-md rounded-md pt-1 pb-3 px-3 flex gap-2 flex-col w-[calc(25%-24px)] min-w-[250px] bg-white justify-between`;
    if (isIntern) {
      return (
        <Link href={`/leaves/${leave.id}`} className={className}>
          {children}
        </Link>
      );
    }
    return <div className={className}>{children}</div>;
  };

  return (
    <Parent>
      <div className="flex gap-2 flex-col w-full">
        <div
          className={`font-bold rounded-tr-md rounded-bl-md absolute top-0 right-0 py-1 px-2 ${badgeColors[leaveStatus]}`}
        >
          {leaveStatus}
        </div>
        <span className="font-bold text-lg">{leaveTypes[leaveType]}</span>
        <div className="flex items-center gap-2">
          <CalendarRangeIcon />
          {leaveType === 'FULL' && !isSameDay(startDate, endDate)
            ? `${format(startDate, 'dd/MM/yyyy')} - ${format(
                endDate,
                'dd/MM/yyyy'
              )}`
            : format(startDate, 'dd/MM/yyyy')}
        </div>
        <div className="flex items-center gap-2">
          <User2 />
          {isIntern ? ro.name : staff.name}
        </div>
        <div className="flex items-start gap-2">
          <ClipboardEdit className="shrink-0" />
          {leaveDetails || <i>No details were provided</i>}
        </div>
        {leaveStatus === LeaveStatus.REJECTED && (
          <div className="flex items-start gap-2">
            <XCircle className="shrink-0" />
            {rejectedDetails || <i>No details were provided</i>}
          </div>
        )}
      </div>
      <Suspense>
        {!isIntern && (
          <div className="flex gap-2 w-full">
            <ApproveLeaveModal leave={leave} open={showModal === 'approve'}>
              <button
                key={'Approve'}
                className={`flex-1 px-4 py-2 rounded-md text-center text-slate-100 transition bg-blue-700 hover:bg-blue-800`}
              >
                Approve
              </button>
            </ApproveLeaveModal>
            <RejectLeaveModal leave={leave} open={showModal === 'reject'}>
              <button
                key={'reject'}
                className="flex-1 px-4 py-2 rounded-md text-center text-slate-100 transition bg-red-600 hover:bg-red-700"
              >
                Reject
              </button>
            </RejectLeaveModal>
          </div>
        )}
      </Suspense>
    </Parent>
  );
}
