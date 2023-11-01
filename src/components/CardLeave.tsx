import { Leave, LeaveStatus, LeaveType } from '@prisma/client';
import { format, isSameDay } from 'date-fns';
import { CalendarRangeIcon, ClipboardEdit, User2, XCircle } from 'lucide-react';
import Link from 'next/link';

type CardProps = {
  leave: Leave & {
    staff: {
      name: string;
    };
    ro: {
      name: string;
    };
  };
};

export default async function CardLeaves({ leave }: CardProps) {
  const {
    leaveStatus,
    startDate,
    endDate,
    leaveType,
    ro,
    leaveDetails,
    rejectedDetails,
  } = leave;

  const badgeColors = {
    APPROVED: 'bg-green-100 border border-green-200 text-green-600',
    REJECTED: 'bg-red-100 border border-red-200 text-red-600',
    PENDING: 'bg-amber-100 border border-amber-200 text-amber-600',
    CANCELLED: 'bg-gray-100 border border-gray-200 text-gray-600'
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

  return (
    <Link
      href={`/leaves/${leave.id}`}
      className={`relative shadow-md rounded-md pt-1 pb-3 px-3 flex gap-2 flex-col w-[calc(25%-24px)] min-w-[250px] bg-white`}
    >
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
        {ro.name}
      </div>
      <div className="flex items-start gap-2">
        <ClipboardEdit className="shrink-0" />
        {leaveDetails || <i>No details were provided</i>}
      </div>
      {leaveStatus === LeaveStatus.REJECTED && (
        <div className="flex items-start gap-2">
          <XCircle className="shrink-0" />
          {rejectedDetails ?? <i>No details were provided</i>}
        </div>
      )}
    </Link>
  );
}
