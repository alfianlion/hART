'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerProps = {
  onChange: (date: Date) => void;
  startDate: Date;
  isError: boolean;
};

export function DatePicker({ onChange, startDate, isError }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!date) return;
    setIsOpen(false);
    onChange(date);
  }, [date]);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal w-full p-3 border-2 border-blue-700',
            !date && 'text-muted-foreground',
            isOpen && 'bg-slate-200',
            isError && 'border-red-500'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full flex justify-start p-0 bg-slate-100"
        align={'start'}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          fromDate={startDate}
        />
      </PopoverContent>
    </Popover>
  );
}
