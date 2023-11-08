'use client';
import { cancelLeave, updateLeave } from '@/actions/leave';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { ApplyLeaveSchema, ApplyLeaveSchemaType } from '@/schema/leaves';
import { zodResolver } from '@hookform/resolvers/zod';
import { Leave, LeaveStatus, LeaveType, Staff } from '@prisma/client';
import { isAfter } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
  leave:
    | Leave & {
        staff: Staff;
        ro: Staff;
      };
  reportingOfficers: Staff[];
  remainingLeaves: number;
};

export const EditOrCancelLeavePage = ({
  leave,
  reportingOfficers,
  remainingLeaves,
}: Props) => {
  const [cancelledLoading, setCancelledLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplyLeaveSchemaType>({
    resolver: zodResolver(ApplyLeaveSchema),
  });

  const leaveType = watch('leaveType');
  const startDate = watch('startDate');
  const currentDate = useMemo(() => new Date(), []);

  useEffect(() => {
    setValue('remainingLeaves', remainingLeaves);
  }, [remainingLeaves]);

  useEffect(() => {
    if (leaveType === 'FULL') return;
    setValue('endDate', startDate);
  }, [startDate, leaveType]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    setValue('endDate', leave?.endDate);
    setValue('startDate', leave.startDate);
    setValue('leaveDetails', leave.leaveDetails);
    setValue('leaveType', leave.leaveType);
    setValue('reportingOfficer', leave.ro.id);
  }, [leave]);

  const onSubmit: SubmitHandler<ApplyLeaveSchemaType> = async data => {
    try {
      await updateLeave(leave.id, data);
      toast.success('Leave updated successfully');
      router.refresh();
      router.push('/leaves');
    } catch {
      toast.error('Failed to update leave');
    }
  };

  const badgeColors = {
    APPROVED: 'bg-green-100 border border-green-200 text-green-600',
    REJECTED: 'bg-red-100 border border-red-200 text-red-600',
    PENDING: 'bg-amber-100 border border-amber-200 text-amber-600',
    CANCELLED: 'bg-gray-100 border border-gray-200 text-gray-600',
  } as {
    [key in LeaveStatus]: string;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col max-w-md w-full bg-white shadow-lg p-3 mx-auto rounded-md mt-6 gap-3 relative pt-[36px]`}
    >
      <div
        className={`font-bold rounded-tr-md rounded-bl-md absolute top-0 right-0 py-1 px-2 ${
          badgeColors[leave.leaveStatus]
        }`}
      >
        {leave.leaveStatus}
      </div>
      <Combobox
        key="ro"
        items={reportingOfficers.map(officer => ({
          value: officer.id,
          label: officer.name,
        }))}
        defaultValue={leave.ro.id}
        label="Reporting Officer"
        error={errors.reportingOfficer?.message}
        onChange={option => {
          if (!option) return;
          setValue('reportingOfficer', option);
        }}
      />
      <Combobox
        key="type"
        items={[
          {
            label: 'Full day',
            value: LeaveType.FULL,
          },
          {
            label: 'Half day (AM)',
            value: LeaveType.HALF_AM,
          },
          {
            label: 'Half day (PM)',
            value: LeaveType.HALF_PM,
          },
        ]}
        defaultValue={leave.leaveType}
        label="Type of Leave"
        onChange={option => {
          setValue('leaveType', option as LeaveType);
        }}
      />
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-2 flex-1">
          <label>{leaveType === 'FULL' ? 'Start Date' : 'Date of Leave'}</label>
          <DatePicker
            onChange={date => {
              if (date === startDate) return;
              setValue('startDate', date);
            }}
            isError={!!errors.startDate}
            startDate={currentDate}
            defaultValue={leave.startDate}
          />
          {errors.startDate?.message && (
            <div className="text-red-500 text-sm">
              {errors.startDate.message}
            </div>
          )}
        </div>
        {leaveType === 'FULL' && (
          <div className={`flex flex-col gap-2 flex-1`}>
            <label>End Date</label>
            <DatePicker
              onChange={date => setValue('endDate', date)}
              isError={!!errors.endDate}
              startDate={currentDate}
              defaultValue={leave.endDate}
            />
            {errors.endDate?.message && (
              <div className="text-red-500 text-sm">
                {errors.endDate.message}
              </div>
            )}
          </div>
        )}
      </div>
      <TextField
        label="Leave Details"
        variant="textarea"
        placeholder="Describe reasons of your leave if needed"
        {...register('leaveDetails')}
        error={errors.leaveDetails?.message}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Update Leave
      </Button>
      {leave.leaveStatus !== 'REJECTED' &&
        leave.leaveStatus !== 'CANCELLED' &&
        isAfter(leave.startDate, new Date()) && (
          <Button
            type="button"
            variant="secondary"
            isLoading={cancelledLoading}
            onClick={async () => {
              try {
                setCancelledLoading(true);
                await cancelLeave(leave.id);
                toast.success('Leave cancelled successfully');
                router.refresh();
                router.push('/leaves');
              } catch {
                toast.error('Failed to cancel leave');
              } finally {
                setCancelledLoading(false);
              }
            }}
          >
            Cancel Leave
          </Button>
        )}
    </form>
  );
};
