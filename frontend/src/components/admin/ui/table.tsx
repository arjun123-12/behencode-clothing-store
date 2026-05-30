'use client';

import React from 'react';

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({ className = '', ...props }) => (
  <div className="overflow-x-auto w-full">
    <table className={`w-full text-left border-collapse ${className}`} {...props} />
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = '', ...props }) => (
  <thead className={`bg-cream/15 border-b border-border-custom/30 text-[10px] font-bold tracking-wider uppercase text-light-brown select-none ${className}`} {...props} />
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = (props) => (
  <tbody {...props} />
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className = '', ...props }) => (
  <tr className={`border-b border-border-custom/10 hover:bg-cream/5 transition-colors duration-200 ${className}`} {...props} />
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className = '', ...props }) => (
  <th className={`py-4 px-5 font-bold text-light-brown text-[10px] uppercase tracking-wider ${className}`} {...props} />
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = '', ...props }) => (
  <td className={`py-3.5 px-5 text-xs text-foreground align-middle ${className}`} {...props} />
);
