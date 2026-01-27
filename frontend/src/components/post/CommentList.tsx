import { CommentItem } from './CommentItem';

const mockComments = [
  {
    id: 1,
    author: '잠 못 드는 고양이',
    time: '10분 전',
    content: '나도 그래... 이 시간이 제일 좋으면서도 가끔 무섭더라. 근데 그래서 여기 오는 거 아닐까?',
    likes: 12,
    isLiked: true,
    isAuthor: false,
  },
  {
    id: 2,
    author: '편의점 야식러',
    time: '8분 전',
    content: '맞아 맞아 ㅋㅋㅋ 그래서 여기 오는 거지',
    likes: 3,
    isLiked: false,
    isAuthor: true,
  },
  {
    id: 3,
    author: '새벽산책러',
    time: '5분 전',
    content: '편의점 불빛 아래 앉아있는 거 진짜 공감... 그 형광등 빛이 묘하게 위로가 될 때가 있어',
    likes: 8,
    isLiked: false,
    isAuthor: false,
  },
];

interface CommentListProps {
  postId?: number;
}

export const CommentList = ({ postId: _postId }: CommentListProps) => {
  return (
    <div className="w-full bg-midnight-card border border-midnight-border p-5">
      <h3 className="text-white text-[15px] font-semibold mb-4">
        댓글 {mockComments.length}
      </h3>
      
      <div className="flex flex-col">
        {mockComments.map((comment) => (
          <CommentItem
            key={comment.id}
            {...comment}
          />
        ))}
      </div>
    </div>
  );
};
