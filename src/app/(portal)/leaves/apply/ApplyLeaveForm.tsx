'use client';

import { Button } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { TextField } from '@/components/TextField';
import { DatePicker } from '@/components/ui/date-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeaveCategory, LeaveType, Staff } from '@prisma/client';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const minimumDate = new Date();
minimumDate.setDate(minimumDate.getDate() - 1);

const applyLeaveSchema = z
  .object({
    reportingOfficer: z.string().min(1),
    leaveCategory: z.nativeEnum(LeaveCategory),
    leaveType: z.nativeEnum(LeaveType),
    startDate: z.date().min(minimumDate),
    endDate: z.date().min(minimumDate),
    leaveDetails: z.string().max(1200).nullable(),
  })
  .refine(data => data.startDate < data.endDate, {
    message: 'Start date must be before end date',
    path: ['startDate', 'endDate'],
  });

type ApplyLeaveSchemaType = z.infer<typeof applyLeaveSchema>;

type ApplyLeaveFormProps = {
  reportingOfficers: Staff[];
};

export default function ApplyLeaveForm({
  reportingOfficers,
}: ApplyLeaveFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyLeaveSchemaType>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      leaveCategory: LeaveCategory.MOM,
      leaveType: LeaveType.FULL,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<ApplyLeaveSchemaType> = async data => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-3xl w-full bg-slate-100 shadow-lg p-3 mx-auto rounded-md mt-6 gap-3"
    >
      <Dropdown
        options={reportingOfficers.map(officer => ({
          value: officer.id,
          label: officer.name,
        }))}
        label="To"
        onChange={option => {
          setValue('reportingOfficer', option.value as LeaveCategory);
        }}
      />
      <Dropdown
        options={[
          {
            label: 'MOM',
            value: LeaveCategory.MOM,
          },
          {
            label: 'GovTech',
            value: LeaveCategory.GOVTECH,
          },
        ]}
        label="Category of Leave"
        onChange={option => {
          setValue('leaveCategory', option.value as LeaveCategory);
        }}
      />
      <Dropdown
        options={[
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
        label="Type of Leave"
        onChange={option => {
          setValue('leaveType', option.value as LeaveType);
        }}
      />
      <div className="flex flex-col gap-2">
        <label>Start Date</label>
        <DatePicker
          onChange={date => setValue('startDate', date)}
          startDate={new Date()}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>End Date</label>
        <DatePicker
          onChange={date => setValue('endDate', date)}
          startDate={new Date()}
        />
      </div>
      <TextField
        label="Leave Details"
        variant="textarea"
        placeholder="Describe reasons of your leave if needed"
        {...register('leaveDetails')}
        error={errors.leaveDetails?.message}
      />
      <Button type="submit">Apply Leave</Button>
    </form>
  );
}
