import React from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-primary-500 text-white hover:bg-primary-600'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="text-xl" />
      </button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg transition-colors ${
              currentPage === page
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-primary-500 text-white hover:bg-primary-600'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="text-xl" />
      </button>
    </div>
  );
}
