import { Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '정말 삭제할까요?',
  description = '삭제된 내용은 복구할 수 없어요.',
  isLoading = false,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-midnight-card border border-midnight-border rounded-2xl w-full max-w-sm p-6 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-midnight-border rounded transition-colors"
        >
          <X className="w-5 h-5 text-midnight-text-muted" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-status-error/10 border border-status-error/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Trash2 className="w-7 h-7 text-status-error" />
        </div>

        {/* Content */}
        <h2 className="text-lg font-semibold text-midnight-text-primary text-center mb-2">
          {title}
        </h2>
        <p className="text-midnight-text-muted text-sm text-center mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 bg-midnight-border rounded-xl text-midnight-text-secondary text-sm font-medium hover:bg-midnight-text-subtle transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-11 bg-status-error rounded-xl text-white text-sm font-medium hover:bg-status-error/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
};
