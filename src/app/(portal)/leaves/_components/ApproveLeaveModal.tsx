'use client';

import { approveLeave } from '@/actions/leave';
import { Spinner } from '@/components/Spinner';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Leave, Staff } from '@prisma/client';
import { format, isSameDay } from 'date-fns';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type ApproveLeaveModalProps = {
  leave: Leave & {
    staff: Staff;
  };
  children: ReactNode;
  open: boolean;
};

export const ApproveLeaveModal = ({
  leave,
  children,
  open,
}: ApproveLeaveModalProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Leave</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-foreground">
          Are you sure you want to approve the leave for{' '}
          <b>{leave?.staff.name}</b> dated on{' '}
          <b>
            {leave?.leaveType === 'FULL'
              ? isSameDay(leave.startDate, leave.endDate)
                ? format(leave.startDate, 'dd MMM yyyy')
                : `${format(leave.startDate, 'dd MMM yyyy')} - ${format(
                    leave.endDate,
                    'dd MMM yyyy'
                  )}`
              : format(leave.startDate, 'dd MMM yyyy')}
          </b>
          ?
        </DialogDescription>
        <DialogFooter>
          <div className="w-full flex gap-2">
            <button
              onClick={async () => {
                setIsLoading(true);
                try {
                  await approveLeave(leave.id);
                  setIsOpen(false);
                  toast.success('Approved leave successfully!');
                } catch (e) {
                  if (e instanceof Error) return toast.error(e.message);
                  toast.error('Something went wrong please try again later.');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition flex items-center justify-center disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {!isLoading ? 'Yes' : <Spinner />}
            </button>
            <DialogClose asChild>
              <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition">
                No
              </button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
