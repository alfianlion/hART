type CardProps = {
  leaveStatus: string;
  startDate: string;
  endDate: string; 
};

export default async function CardLeaves({
    leaveStatus,
    startDate,
    endDate
  }: CardProps) {

    return (
        <div className="bg-slate-100 shadow-md rounded-md p-6 flex space-y-2 flex-col w-1/4 h-auto">
          {leaveStatus === 'Approved' ? (
            <>
                <span className="font-bold">Status: 
                    <span className="text-green-600">{leaveStatus}</span>
                </span>
                <hr/>
                <span className="font-bold">Start Date: 
                    <span className="font-normal">{startDate}</span>
                </span>
                <span className="font-bold">End Date: 
                    <span className="font-normal">{endDate}</span>
                </span>
            </>
          ) : (
            <>
            <span className="font-bold">Status: 
                <span className="text-red-600">{leaveStatus}</span>
            </span>
            <hr/>
            <span className="font-bold">Start Date: 
                <span className="font-normal">{startDate}</span>
            </span>
            <span className="font-bold">End Date: 
                <span className="font-normal">{endDate}</span>
            </span>
        </>
          )}
        </div>
      );
    // const leaves = await prisma.leave.count({
    //   where: {
    //     staffId: staffId,
    //     leaveStatus: 'APPROVED',
    //   },
    // });
}
