import * as React from 'react';

export function Table({ className = '', ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={`w-full border-collapse ${className}`} {...props} />;
}

export function TableHeader({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props} />;
}

export function TableBody({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TableRow({ className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`border-b last:border-b-0 ${className}`} {...props} />;
}

export function TableHead({ className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`text-left text-sm font-medium text-gray-600 py-2 ${className}`} {...props} />;
}

export function TableCell({ className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`py-2 text-sm ${className}`} {...props} />;
}

