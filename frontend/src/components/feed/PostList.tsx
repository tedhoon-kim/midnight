import { PostCard } from './PostCard';

const mockPosts = [
  {
    id: 1,
    author: '편의점 야식러',
    time: '15분 전',
    tag: 'shout' as const,
    content: '이 공기, 이 소음. 지금 나만 살아있는 것 같은 이 기분이 좋으면서도 지독하게 외롭다. 다들 자?\n\n편의점 불빛 아래 앉아서 맥주 하나 따고 있는데, 이상하게 이 순간이 너무 좋아.',
    reactions: 47,
    comments: 12,
    isReacted: false,
  },
  {
    id: 2,
    author: '잠 못 드는 개발자',
    time: '32분 전',
    tag: 'monologue' as const,
    content: '새벽에 코딩하면 왜 이렇게 잘 되지? 낮에는 버그 하나 못 잡는데 새벽에는 머리가 맑아지는 느낌...',
    reactions: 89,
    comments: 23,
    isReacted: true,
  },
  {
    id: 3,
    author: '익명의 대학생',
    time: '1시간 전',
    tag: 'comfort' as const,
    content: '취준 3년차... 이번에도 서류 탈락했어. 뭐가 문제인지 모르겠다. 다들 어떻게 취업하는 거야? 정말 지쳤어.',
    reactions: 156,
    comments: 67,
    isReacted: false,
  },
  {
    id: 4,
    author: '밤산책러',
    time: '2시간 전',
    tag: 'monologue' as const,
    content: '새벽에 산책하다가 고양이 만났다. 서로 눈 마주치고 가만히 있다가 각자 갈 길 갔어. 이상하게 위로가 됐다.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    reactions: 234,
    comments: 45,
    isReacted: true,
  },
];

interface PostListProps {
  onPostClick?: (id: number) => void;
}

export const PostList = ({ onPostClick }: PostListProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {mockPosts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
          onClick={() => onPostClick?.(post.id)}
        />
      ))}
    </div>
  );
};
