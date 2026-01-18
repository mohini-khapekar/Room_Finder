import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  isOpen: boolean;
  imageUrl: string;
  roomTitle: string;
  onClose: () => void;
}

export function ImageViewer({ isOpen, imageUrl, roomTitle, onClose }: ImageViewerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={32} />
        </button>

        <div className="relative">
          <img
            src={imageUrl}
            alt={roomTitle}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          <p className="text-white text-center mt-4 text-sm">{roomTitle}</p>
        </div>
      </div>
    </div>
  );
}
