import { Inbox, Search, FileText, MessageCircle, Heart } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateType = 'default' | 'search' | 'posts' | 'comments' | 'reactions';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: ReactNode;
}

const defaultContent = {
  default: {
    icon: Inbox,
    title: '아무것도 없어요',
    description: '아직 내용이 없습니다.',
  },
  search: {
    icon: Search,
    title: '검색 결과가 없어요',
    description: '다른 키워드로 검색해 보세요.',
  },
  posts: {
    icon: FileText,
    title: '작성한 글이 없어요',
    description: '새벽에 첫 번째 이야기를 남겨보세요.',
  },
  comments: {
    icon: MessageCircle,
    title: '댓글이 없어요',
    description: '첫 번째 댓글을 남겨보세요.',
  },
  reactions: {
    icon: Heart,
    title: '공감한 글이 없어요',
    description: '마음에 드는 글에 공감을 눌러보세요.',
  },
};

export const EmptyState = ({
  type = 'default',
  title,
  description,
  action,
}: EmptyStateProps) => {
  const content = defaultContent[type];
  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-16 h-16 bg-midnight-card border border-midnight-border rounded-2xl flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-midnight-text-subtle" />
      </div>
      <h3 className="text-lg font-semibold text-midnight-text-secondary mb-1">
        {title || content.title}
      </h3>
      <p className="text-midnight-text-muted text-sm text-center max-w-xs mb-5">
        {description || content.description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
