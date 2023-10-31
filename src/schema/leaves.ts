import { LeaveType } from '@prisma/client';
import { intervalToDuration } from 'date-fns';
import { z } from 'zod';

export const ApplyLeaveSchema = z
  .object({
    reportingOfficer: z
      .string({
        required_error: 'Reporting Officer required!',
      })
      .min(1),
    leaveType: z.nativeEnum(LeaveType, {
      required_error: 'Leave Type required!',
    }),
    startDate: z
      .date({
        required_error: 'Start Date required!',
      })
      .min(new Date(Date.now() - 24 * 60 * 60 * 1000), {
        message: 'Start date cannot be before today',
      }),
    endDate: z
      .date({
        required_error: 'End Date required!',
      })
      .min(new Date(Date.now() - 24 * 60 * 60 * 1000), {
        message: 'End date cannot be before today',
      }),
    leaveDetails: z.string().max(1200).nullable(),
    remainingLeaves: z.number().min(0),
  })
  .refine(data => data.startDate <= data.endDate, {
    message: 'End date cannot be before start date',
    path: ['endDate'],
  })
  .refine(
    data => {
      const daysOfLeave = intervalToDuration({
        start: data.startDate,
        end: data.endDate,
      }).days;
      if (daysOfLeave === undefined) return false;
      console.log({
        daysOfLeave,
        remaining: data.remainingLeaves
      });
      return daysOfLeave <= data.remainingLeaves;
    },
    {
      message: 'Insufficient number of leaves left',
      path: ['endDate'],
    }
  );

export type ApplyLeaveSchemaType = z.infer<typeof ApplyLeaveSchema>;
