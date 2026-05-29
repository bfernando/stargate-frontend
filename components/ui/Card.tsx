import { HTMLAttributes } from 'react';

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`rounded-md border border-slate-200 bg-white p-4 shadow-sm ${className}`} {...props}>{children}</section>;
}
