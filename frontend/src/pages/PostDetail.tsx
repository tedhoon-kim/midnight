import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderWithBack } from '../components/common/HeaderWithBack';
import { PostDetailCard } from '../components/post/PostDetailCard';
import { ReactionBar } from '../components/post/ReactionBar';
import { CommentInput } from '../components/post/CommentInput';
import { CommentList } from '../components/post/CommentList';

// Mock data - 실제로는 API에서 가져옴
const mockPost = {
  id: 1,
  author: '편의점 야식러',
  time: '45분 전',
  tag: 'shout' as const,
  content: `이 공기, 이 소음. 지금 나만 살아있는 것 같은 이 기분이 좋으면서도 지독하게 외롭다. 다들 자?

편의점 불빛 아래 앉아서 맥주 하나 따고 있는데, 이상하게 이 순간이 너무 좋아. 아무도 나한테 뭘 기대하지 않고, 나도 누구한테 뭘 증명할 필요 없는 이 시간.

근데 동시에 이렇게 혼자라는 게 가끔 무섭기도 해.`,
  imageUrl: 'https://images.unsplash.com/photo-1643319572017-d42f30cc18ef?w=1080',
  reactions: 47,
  comments: 12,
};

export const PostDetail = () => {
  const { id } = useParams();
  const [isReacted, setIsReacted] = useState(false);
  const [reactions, setReactions] = useState(mockPost.reactions);

  const handleReact = () => {
    if (isReacted) {
      setReactions(reactions - 1);
    } else {
      setReactions(reactions + 1);
    }
    setIsReacted(!isReacted);
  };

  const handleComment = (content: string) => {
    console.log('New comment:', content);
    // API 호출 로직
  };

  return (
    <div className="min-h-screen bg-midnight-bg flex flex-col items-center">
      <HeaderWithBack timeLeft="03:42:15 남음" />
      
      {/* Main Content */}
      <main className="w-full max-w-[640px] px-5 md:px-0 py-8 md:py-12 flex flex-col gap-4">
        {/* Post Card */}
        <PostDetailCard
          author={mockPost.author}
          time={mockPost.time}
          tag={mockPost.tag}
          content={mockPost.content}
          imageUrl={mockPost.imageUrl}
        />

        {/* Reaction Bar */}
        <ReactionBar
          reactions={reactions}
          comments={mockPost.comments}
          isReacted={isReacted}
          onReact={handleReact}
        />

        {/* Comments */}
        <CommentList postId={Number(id)} />

        {/* Comment Input */}
        <CommentInput onSubmit={handleComment} />
      </main>
    </div>
  );
};
