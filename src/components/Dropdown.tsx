'use client';

import ReactDropdown, { ReactDropdownProps } from 'react-dropdown';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

type DropdownProps = Omit<
  ReactDropdownProps,
  | 'className'
  | 'controlClassName'
  | 'arrowClosed'
  | 'arrowOpen'
  | 'menuClassName'
> & {
  label: string;
};

export default function Dropdown({ label, ...props }: DropdownProps) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <ReactDropdown
        {...props}
        className="relative"
        controlClassName={`flex cursor-pointer justify-between items-center bg-slate-200/0 p-3 transition rounded-md outline-none text-slate-800 border-2 focus:bg-slate-200 border-blue-600 focus:border-blue-700`}
        arrowClosed={<MdArrowDropDown size={30} />}
        arrowOpen={<MdArrowDropUp className="text-blue-700" size={30} />}
        menuClassName="cursor-pointer absolute top-[60px] right-0 overflow-hidden left-0 bg-slate-100 shadow-lg rounded-md flex flex-col z-[800]"
      />
    </div>
  );
}
