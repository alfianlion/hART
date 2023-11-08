'use client';
import { rejectLeave } from '@/actions/leave';
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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Leave, Staff } from '@prisma/client';
import { format, isSameDay } from 'date-fns';
import { ReactNode, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

type RejectLeaveModalProps = {
  leave: Leave & {
    staff: Staff;
  };
  children: ReactNode;
  open: boolean;
};

const RejectLeaveFormSchema = z.object({
  details: z.string().min(1, {
    message: 'Please provide rejection details',
  }),
});

type RejectLeaveForm = z.infer<typeof RejectLeaveFormSchema>;

export const RejectLeaveModal = ({
  leave,
  children,
  open,
}: RejectLeaveModalProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RejectLeaveForm>({
    resolver: zodResolver(RejectLeaveFormSchema),
  });

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onSubmit: SubmitHandler<RejectLeaveForm> = async data => {
    try {
      await rejectLeave(leave.id, data.details);
      setIsOpen(false);
      toast.success('Rejected leave successfully!');
    } catch (e) {
      if (e instanceof Error) return toast.error(e.message);
      toast.error('Something went wrong please try again later.');
    }
  };

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
          <DialogTitle>Reject Leave</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-foreground">
          Are you sure you want to{' '}
          <span className="text-red-600 font-bold">reject</span> the leave for{' '}
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Rejection details"
              className="border-2 border-blue-600 focus:bg-muted focus-visible:ring-0"
              {...register('details')}
            />
            {errors.details?.message && (
              <p className="text-red-500 text-sm">{errors.details?.message}</p>
            )}
          </div>
          <DialogFooter>
            <div className="w-full flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {!isSubmitting ? 'Yes' : <Spinner />}
              </button>
              <DialogClose asChild>
                <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition">
                  No
                </button>
              </DialogClose>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
