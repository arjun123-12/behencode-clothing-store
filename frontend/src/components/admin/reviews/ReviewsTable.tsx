'use client';

import React from 'react';
import { Star, Trash2, User, AlertCircle, MessageSquare } from 'lucide-react';

interface ReviewsTableProps {
  reviews: any[];
  onDelete: (reviewId: string) => void;
  formatDate: (dateStr: string) => string;
}

export const ReviewsTable: React.FC<ReviewsTableProps> = ({
  reviews = [],
  onDelete,
  formatDate,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={12}
            className={index < rating ? 'fill-rose text-rose' : 'text-light-brown/30'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-custom/30 bg-background shadow-sm select-none">
      {reviews.length === 0 ? (
        <div className="py-16 text-center text-light-brown flex flex-col items-center justify-center space-y-2">
          <MessageSquare size={24} className="text-light-brown/60" />
          <p className="text-[10px] font-bold uppercase tracking-wider">No Reviews Yet</p>
          <p className="text-[8px] text-light-brown/70">Reviews will be shown when customers write about products</p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/15 border-b border-border-custom/30 text-[10px] font-bold tracking-wider uppercase text-light-brown">
              <th className="py-4 px-5">Reviewer</th>
              <th className="py-4 px-5">Product Review Rating</th>
              <th className="py-4 px-5">Comment</th>
              <th className="py-4 px-5">Date Created</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev) => (
              <tr
                key={rev._id}
                className="border-b border-border-custom/10 hover:bg-cream/5 transition-colors duration-200 text-xs text-foreground"
              >
                {/* Reviewer Details */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rose/10 text-rose flex items-center justify-center text-[10px] font-bold">
                      <User size={12} />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{rev.name}</div>
                      <div className="text-[10px] text-light-brown mt-0.5">{rev.email}</div>
                    </div>
                  </div>
                </td>

                {/* Star Rating */}
                <td className="py-3.5 px-5">
                  {renderStars(rev.rating)}
                </td>

                {/* Comment */}
                <td className="py-3.5 px-5 text-light-brown text-[11px] max-w-xs truncate font-medium">
                  "{rev.comment}"
                </td>

                {/* Date */}
                <td className="py-3.5 px-5 font-semibold text-light-brown text-[10px]">
                  {formatDate(rev.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete this review from "${rev.name}"?`)) {
                          onDelete(rev._id);
                        }
                      }}
                      title="Remove Review"
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

export default ReviewsTable;
