'use client';

import React from 'react';
import { MailOpen, Trash2, User, AlertCircle, HelpCircle } from 'lucide-react';

interface MessagesTableProps {
  messages: any[];
  onDelete: (messageId: string) => void;
  formatDate: (dateStr: string) => string;
}

export const MessagesTable: React.FC<MessagesTableProps> = ({
  messages = [],
  onDelete,
  formatDate,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-custom/30 bg-background shadow-sm select-none">
      {messages.length === 0 ? (
        <div className="py-16 text-center text-light-brown flex flex-col items-center justify-center space-y-2">
          <MailOpen size={24} className="text-light-brown/60" />
          <p className="text-[10px] font-bold uppercase tracking-wider">Inbox is Empty</p>
          <p className="text-[8px] text-light-brown/70">No incoming customer inquiries at the moment</p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/15 border-b border-border-custom/30 text-[10px] font-bold tracking-wider uppercase text-light-brown">
              <th className="py-4 px-5">Sender</th>
              <th className="py-4 px-5">Subject</th>
              <th className="py-4 px-5">Message Body</th>
              <th className="py-4 px-5">Date Received</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr
                key={msg._id}
                className="border-b border-border-custom/10 hover:bg-cream/5 transition-colors duration-200 text-xs text-foreground"
              >
                {/* Sender Details */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rose/10 text-rose flex items-center justify-center text-[10px] font-bold">
                      <User size={12} />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{msg.name}</div>
                      <div className="text-[10px] text-light-brown mt-0.5">{msg.email}</div>
                    </div>
                  </div>
                </td>

                {/* Subject */}
                <td className="py-3.5 px-5 font-bold max-w-[120px] truncate">
                  <span className="flex items-center gap-1">
                    <HelpCircle size={10} className="text-rose" /> {msg.subject || 'No Subject'}
                  </span>
                </td>

                {/* Message Body */}
                <td className="py-3.5 px-5 text-light-brown text-[11px] max-w-xs truncate font-medium">
                  {msg.message}
                </td>

                {/* Date */}
                <td className="py-3.5 px-5 font-semibold text-light-brown text-[10px]">
                  {formatDate(msg.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete message from "${msg.name}"?`)) {
                          onDelete(msg._id);
                        }
                      }}
                      title="Delete Support Ticket"
                      className="p-1.5 border border-border-custom hover:border-rose bg-cream/10 hover:bg-rose hover:text-white rounded-lg transition-all duration-300 cursor-pointer text-foreground"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MessagesTable;
