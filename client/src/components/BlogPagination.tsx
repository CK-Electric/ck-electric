import React from 'react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange?: (page: number) => void;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange
}: BlogPaginationProps) {
  const handlePrevious = () => {
    if (hasPrevious && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="mt-20 flex justify-center items-center space-x-2">
      {/* Previous Button */}
      <button
        className={`flex items-center px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
          hasPrevious 
            ? 'text-neutral-950 hover:text-primary-500' 
            : 'text-neutral-400 cursor-not-allowed'
        }`}
        onClick={handlePrevious}
        disabled={!hasPrevious}
      >
        <ArrowBack className="w-4 h-4 mr-1" />
        Previous
      </button>

      {/* Page Numbers */}
      {currentPage > 3 && (
        <>
          <button
            className="w-10 h-10 rounded-full hover:bg-neutral-100 font-bold flex items-center justify-center transition-colors text-neutral-950"
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
          {currentPage > 4 && <span className="px-2 text-neutral-400">...</span>}
        </>
      )}

      {getVisiblePages().map((page) => (
        <button
          key={page}
          className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors ${
            page === currentPage
              ? 'bg-neutral-950 text-primary-500'
              : 'hover:bg-neutral-100 text-neutral-950'
          }`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 3 && (
        <>
          {currentPage < totalPages - 4 && <span className="px-2 text-neutral-400">...</span>}
          <button
            className="w-10 h-10 rounded-full hover:bg-neutral-100 font-bold flex items-center justify-center transition-colors text-neutral-950"
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        className={`flex items-center px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
          hasNext 
            ? 'text-neutral-950 hover:text-primary-500' 
            : 'text-neutral-400 cursor-not-allowed'
        }`}
        onClick={handleNext}
        disabled={!hasNext}
      >
        Next
        <ArrowForward className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}
