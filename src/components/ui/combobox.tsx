'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type ComboboxItem = {
  value: string;
  label: string;
};

type ComboboxProps = {
  items: ComboboxItem[];
  label: string;
  error?: string | null;
  onChange: (value: string | null) => void;
  defaultValue?: string;
};

export function Combobox({
  items,
  onChange,
  label,
  error,
  defaultValue,
}: ComboboxProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex flex-col gap-2">
          <label>{label}</label>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            type="button"
            aria-expanded={open}
            className={cn(
              'w-full justify-between cursor-pointer bg-slate-200/0 p-3 transition rounded-md outline-none text-slate-800 border-2 focus:bg-slate-200 border-blue-600',
              open && 'bg-slate-200',
              error && 'border-red-500'
            )}
          >
            {value
              ? items.find(item => item.value === value)?.label
              : 'Select...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-slate-100"
        align="start"
        style={{
          width: `${(buttonRef.current?.clientWidth ?? 0) + 4}px`,
        }}
      >
        <Command className="w-full">
          <CommandInput placeholder="Search" />
          <CommandEmpty>Invalid search result</CommandEmpty>
          <CommandGroup className="p-0">
            {items.map(item => (
              <CommandItem
                key={item.value}
                onSelect={() => {
                  setValue(item.value);
                  setOpen(false);
                  onChange(item.value)
                }}
                className="text-slate-700 bg-slate-100 hover:bg-slate-200 p-3 transition border-b border-slate-300 last:border-none cursor-pointer"
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === item.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
