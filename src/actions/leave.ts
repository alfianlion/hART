'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { ApplyLeaveSchema, ApplyLeaveSchemaType } from '@/schema/leaves';
import { Leave, LeaveCategory, LeaveType } from '@prisma/client';
import { Resend } from 'resend';
import { format, isSameDay } from 'date-fns';
import { getRemainingLeaves } from '@/components/RemainingLeaves';
import { ApproveLeaveEmail, ApproveRejectResultEmail } from '@/emails';

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
  await sendEmail(result, 'create');
  return result;
};

const sendEmail = async (
  leave: Leave,
  typeOfEmail: 'update' | 'create' | 'cancel'
) => {
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
      ],
      subject:
        typeOfEmail === 'cancel'
          ? `Cancelled Leave on ${duration} by ${staff.name} (${type})`
          : `${
              typeOfEmail === 'update' ? '[UPDATE] ' : ''
            }Approve Leave Request by ${staff.name} (${type}) on ${duration}`,
      react: ApproveLeaveEmail({
        duration: duration,
        leaveId: leave.id,
        roName: ro.name,
        staffName: staff.name,
        type: type,
        description: leave.leaveDetails,
        update: typeOfEmail === 'update',
        cancel: typeOfEmail === 'cancel',
      }),
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const updateRemainingLeaves = async () => {
  const currentUser = (await getCurrentUser())!;
  const leaves = await prisma.leave.findMany({
    where: {
      leaveStatus: 'APPROVED',
      staffId: currentUser.id,
    },
  });
  const remainingLeaves = getRemainingLeaves(currentUser.leaves ?? 12, leaves);
  await prisma.staff.update({
    where: {
      id: currentUser.id,
    },
    data: {
      remainingLeaves,
    },
  });
};

export const updateLeave = async (id: string, data: ApplyLeaveSchemaType) => {
  const leave = await getLeave(id);
  const updateLeaveData = ApplyLeaveSchema.parse(data);
  const result = await prisma.leave.update({
    where: {
      id: leave.id,
    },
    data: {
      leaveType: updateLeaveData.leaveType,
      startDate: updateLeaveData.startDate,
      endDate: updateLeaveData.endDate,
      leaveDetails: updateLeaveData.leaveDetails,
      leaveCategory: LeaveCategory.MOM,
      leaveStatus: 'PENDING',
      roId: updateLeaveData.reportingOfficer,
    },
  });
  await updateRemainingLeaves();
  await sendEmail(result, 'update');
  return result;
};

export const cancelLeave = async (id: string) => {
  const leave = await getLeave(id);
  const result = await prisma.leave.update({
    where: { id: leave.id },
    data: {
      leaveStatus: 'CANCELLED',
    },
  });
  await updateRemainingLeaves();
  await sendEmail(result, 'cancel');
  return result;
};

export const approveLeave = async (id: string) => {
  const currentUser = (await getCurrentUser())!;
  const leave = await prisma.leave.findFirst({
    where: {
      id,
      roId: currentUser.id,
    },
  });
  if (!leave) throw new Error('Leave not found!');
  const result = await prisma.leave.update({
    where: {
      id: leave.id,
    },
    data: {
      leaveStatus: 'APPROVED',
    },
  });
  await updateRemainingLeaves();
  await sendApproveEmail(result, 'approve');
  return result;
};

export const rejectLeave = async (id: string, reason: string) => {
  const currentUser = (await getCurrentUser())!;
  const leave = await prisma.leave.findFirst({
    where: {
      id,
      roId: currentUser.id,
    },
  });
  if (!leave) throw new Error('Leave not found!');
  const result = await prisma.leave.update({
    where: { id: leave.id },
    data: {
      leaveStatus: 'REJECTED',
      rejectedDetails: reason,
    },
  });
  await sendApproveEmail(result, 'reject');
  return result;
};

async function getLeave(id: string) {
  const currentUser = (await getCurrentUser())!;
  const leave = await prisma.leave.findUnique({
    where: { id },
  });
  if (leave?.staffId !== currentUser.id) {
    throw new Error("Cannot update other staff's leaves");
  }
  return leave;
}

const sendApproveEmail = async (
  leave: Leave,
  typeOfEmail: 'approve' | 'reject'
) => {
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
      ],
      subject:
        typeOfEmail === 'approve'
          ? `Approved Leave on ${duration} (${type}) by ${ro.name}`
          : `Rejected Leave on ${duration} (${type}) by ${ro.name}`,
      react: ApproveRejectResultEmail({
        duration: duration,
        roName: ro.name,
        staffName: staff.name,
        type: type,
        description: leave.rejectedDetails,
        typeOfEmail: typeOfEmail,
      }),
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
