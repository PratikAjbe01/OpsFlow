'use client';

import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { 
  FacebookShareButton, FacebookIcon, 
  TwitterShareButton, TwitterIcon, 
  LinkedinShareButton, LinkedinIcon, 
  WhatsappShareButton, WhatsappIcon 
} from 'next-share';

interface ShareModalProps {
  formId: string;
  onClose: () => void;
}

export default function ShareModal({ formId, onClose }: ShareModalProps) {
  // In production, this would be your actual domain (e.g., opsflow.com/f/...)
  const shareUrl = `${window.location.origin}/f/${formId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Share Form</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Anyone with this link can view and fill out the form.
        </p>

        {/* Copy Link Section */}
        <div className="flex items-center gap-2 mb-6">
          <input 
            type="text" 
            readOnly 
            value={shareUrl} 
            className="flex-1 rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-600 focus:outline-none"
          />
          <button 
            onClick={handleCopy}
            className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="flex justify-center gap-4">
          <WhatsappShareButton url={shareUrl} title="Check out this form!">
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
}