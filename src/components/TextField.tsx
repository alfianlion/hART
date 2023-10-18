'use client';

import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';

type TextFieldProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
  error?: string;
  variant?: 'input' | 'textarea';
  height?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, variant, height, ...props }: TextFieldProps, ref) => {
    props.id = props.id ?? label;
    variant = variant ?? 'input';

    return (
      <div
        className={`flex flex-col gap-2 ${height ?? ''} ${
          props.className ?? ''
        }`}
      >
        <label htmlFor={props.id}>{label}</label>
        <div className={`flex flex-col gap-1 ${height ?? ''}`}>
          {variant === 'textarea' ? (
            <textarea
              {...(props as any)}
              ref={ref as any}
              className={`bg-slate-200/0 p-3 transition rounded-md outline-none text-slate-800 border-2 focus:bg-slate-200 h-48 resize-none ${height} ${
                error
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-blue-600 focus:border-blue-700'
              }`}
            ></textarea>
          ) : (
            <input
              {...props}
              ref={ref as any}
              className={`bg-slate-200/0 p-3 transition rounded-md outline-none text-slate-800 border-2 focus:bg-slate-200 ${
                error
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-blue-600 focus:border-blue-700'
              }`}
            />
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </div>
    );
  }
);
