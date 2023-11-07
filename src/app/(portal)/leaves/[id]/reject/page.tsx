import { prisma } from "@/lib/database";
import React from "react";

const RejectLeavePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const leave = await prisma.leave.findUnique({
    where: { id },
    include: {
      ro: true,
      staff: true,
    }
  });

  return <pre>{JSON.stringify(leave, null, 2)}</pre>;
};

export default RejectLeavePage;
