'use client';

import { saveLeave } from '@/actions/leave';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { ApplyLeaveSchema, ApplyLeaveSchemaType } from '@/schema/leaves';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeaveType, Staff } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type ApplyLeaveFormProps = {
  reportingOfficers: Staff[];
  remainingLeaves: number;
};

export default function ApplyLeaveForm({
  reportingOfficers,
  remainingLeaves,
}: ApplyLeaveFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplyLeaveSchemaType>({
    resolver: zodResolver(ApplyLeaveSchema),
    defaultValues: {
      leaveType: LeaveType.FULL,
    }
  });

  const leaveType = watch('leaveType');
  const startDate = watch('startDate');
  const currentDate = useMemo(() => new Date(), []);

  useEffect(() => {
    setValue('remainingLeaves', remainingLeaves);
  }, [remainingLeaves]);

  useEffect(() => {
    if (leaveType === 'FULL') return;
    console.log('setting');
    setValue('endDate', startDate);
  }, [startDate, leaveType]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit: SubmitHandler<ApplyLeaveSchemaType> = async data => {
    try {
      await saveLeave(data);
      toast.success('Leave applied successfully');
      router.refresh();
      router.push('/leaves');
    } catch {
      toast.error('Failed to apply leave');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-md w-full bg-white shadow-lg p-3 mx-auto rounded-md mt-6 gap-3"
    >
      <Combobox
        key="ro"
        items={reportingOfficers.map(officer => ({
          value: officer.id,
          label: officer.name,
        }))}
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
        defaultValue={LeaveType.FULL}
        label="Type of Leave"
        onChange={option => {
          setValue('leaveType', option as LeaveType);
        }}
      />
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-2 flex-1">
          <label>{leaveType === 'FULL' ? 'Start Date' : 'Date of Leave'}</label>
          <DatePicker
            onChange={date => setValue('startDate', date)}
            isError={!!errors.startDate}
            startDate={currentDate}
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
        Apply Leave
      </Button>
    </form>
  );
}
