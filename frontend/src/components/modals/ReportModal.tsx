import { useState } from 'react';
import { Flag, X } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, detail?: string) => void;
  isLoading?: boolean;
}

const reportReasons = [
  { id: 'spam', label: '스팸/광고' },
  { id: 'abuse', label: '욕설/혐오 표현' },
  { id: 'harassment', label: '괴롭힘/따돌림' },
  { id: 'inappropriate', label: '부적절한 콘텐츠' },
  { id: 'copyright', label: '저작권 침해' },
  { id: 'other', label: '기타' },
];

export const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [detail, setDetail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmit(selectedReason, detail || undefined);
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-midnight-card border border-midnight-border rounded-2xl w-full max-w-sm animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-midnight-card flex items-center justify-between p-5 border-b border-midnight-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-status-warning/10 border border-status-warning/20 rounded-xl flex items-center justify-center">
              <Flag className="w-5 h-5 text-status-warning" />
            </div>
            <h2 className="text-lg font-semibold text-midnight-text-primary">
              신고하기
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-midnight-border rounded transition-colors"
          >
            <X className="w-5 h-5 text-midnight-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Reason Selection */}
          <p className="text-midnight-text-muted text-sm mb-4">
            신고 사유를 선택해 주세요
          </p>
          
          <div className="flex flex-col gap-2 mb-5">
            {reportReasons.map((reason) => (
              <label
                key={reason.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedReason === reason.id
                    ? 'bg-indigo-500/10 border-indigo-500/30'
                    : 'bg-midnight-bg border-midnight-border hover:border-midnight-text-subtle'
                }`}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedReason === reason.id
                      ? 'border-indigo-400'
                      : 'border-midnight-text-subtle'
                  }`}
                >
                  {selectedReason === reason.id && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  )}
                </div>
                <span className="text-midnight-text-secondary text-sm">{reason.label}</span>
              </label>
            ))}
          </div>

          {/* Detail Input */}
          <div className="mb-5">
            <label className="block text-midnight-text-muted text-sm mb-2">
              상세 내용 (선택)
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="신고 내용을 자세히 적어주세요"
              rows={3}
              className="w-full bg-midnight-bg border border-midnight-border rounded-xl p-3 text-midnight-text-secondary text-sm placeholder:text-midnight-text-subtle resize-none focus:outline-none focus:border-midnight-text-muted transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 h-11 bg-midnight-border rounded-xl text-midnight-text-secondary text-sm font-medium hover:bg-midnight-text-subtle transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedReason || isLoading}
              className="flex-1 h-11 bg-status-warning rounded-xl text-black text-sm font-medium hover:bg-status-warning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '신고 중...' : '신고하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
