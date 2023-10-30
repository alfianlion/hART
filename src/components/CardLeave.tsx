import format from "date-fns/format";

type CardProps = {
  leaveStatus: string;
  startDate: Date;
  endDate: Date; 
};

export default async function CardLeaves({
    leaveStatus,
    startDate,
    endDate
  }: CardProps) {

    return (
      <div className="bg-slate-100 shadow-md rounded-md p-6 flex space-y-2 flex-col w-1/4 h-auto">
      <span className="font-bold">
        Status:
        <span
          className={
            leaveStatus === 'Approved' ? 'text-green-600' : 'text-red-600'
          }
        >
          {leaveStatus}
        </span>
      </span>
      <hr />
      <span className="font-bold">
        Start Date:
        <span className="font-normal">{format(startDate, 'dd MMMM yyyy')}</span>
      </span>
      <span className="font-bold">
        End Date:
        <span className="font-normal">{format(endDate, 'dd MMMM yyyy')}</span>
      </span>
    </div>
      );
}
