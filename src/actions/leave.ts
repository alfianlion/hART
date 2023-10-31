'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { ApplyLeaveSchema, ApplyLeaveSchemaType } from '@/schema/leaves';
import { Leave, LeaveCategory, LeaveType } from '@prisma/client';
import { Resend } from 'resend';
import ApproveLeaveEmail from '../../emails/ApproveLeaveEmail';
import { format, isSameDay } from 'date-fns';

const resend = new Resend(process.env['RESEND_API_KEY']);

export const saveLeave = async (data: ApplyLeaveSchemaType) => {
  const staffId = (await getCurrentUser())?.id;
  if (!staffId) {
    throw new Error('Staff ID not found!');
  }
  const applyLeaveData = ApplyLeaveSchema.parse(data);
  const result = await prisma.leave.create({
    data: {
      leaveType: applyLeaveData.leaveType,
      startDate: applyLeaveData.startDate,
      endDate: applyLeaveData.endDate,
      leaveDetails: applyLeaveData.leaveDetails,
      leaveCategory: LeaveCategory.MOM,
      leaveStatus: 'PENDING',
      roId: applyLeaveData.reportingOfficer,
      staffId,
    },
  });
  await sendEmail(result);
  return result;
};

const sendEmail = async (leave: Leave) => {
  const staff = await prisma.staff.findUnique({
    where: {
      id: leave.staffId,
    },
  });
  if (!staff) {
    throw new Error('Staff not found!');
  }
  const ro = await prisma.staff.findUnique({
    where: {
      id: leave.roId,
    },
  });
  if (!ro) {
    throw new Error('Reporting Officer not found!');
  }
  try {
    const duration =
      leave.leaveType === 'FULL' && !isSameDay(leave.startDate, leave.endDate)
        ? `${format(leave.startDate, 'dd MMM yyyy')} - ${format(
            leave.endDate,
            'dd MMM yyyy'
          )}`
        : format(leave.startDate, 'dd MMM yyyy');

    const type = {
      [LeaveType.FULL]: 'Full Day',
      [LeaveType.HALF_AM]: 'Half Day (AM)',
      [LeaveType.HALF_PM]: 'Half Day (PM)',
    }[leave.leaveType];

    const data = await resend.emails.send({
      from: 'noreply <noreply@resend.dev>',
      to: [
        process.env['NODE_ENV'] === 'production'
          ? ro.email
          : 'nasrullah01n@gmail.com',
        staff.email,
      ],
      subject: `Approve Leave Request by ${staff.name} (${type}) on ${duration}`,
      react: ApproveLeaveEmail({
        duration: duration,
        leaveId: leave.id,
        roName: ro.name,
        staffName: staff.name,
        type: type,
        description: leave.leaveDetails,
      }),
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
