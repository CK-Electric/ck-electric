'use client';

import React, { useState } from 'react';
import { Share, ContentCopy } from '@mui/icons-material';
import Button from './Button';

export default function BlogShareButtons() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToastMessage('Link copied successfully!');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href,
        });
        showToastMessage('Article shared successfully!');
      } else {
        // Fallback: copy link
        handleCopyLink();
      }
    }
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-4 bg-neutral-950 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {toastMessage}
        </div>
      )}
      
      <div className="flex justify-center gap-4 mb-8">
        <Button
          label="Share Article"
          icon={<Share />}
          variant="tertiary"
          onClick={handleShare}
        />
      </div>
    </>
  );
}
