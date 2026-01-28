-- ============================================
-- Midnight 테스트 데이터
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 테스트 유저 생성
INSERT INTO users (id, nickname, provider, provider_id) VALUES
  ('11111111-1111-1111-1111-111111111111', '잠 못 드는 올빼미', 'google', 'test_user_1'),
  ('22222222-2222-2222-2222-222222222222', '새벽의 고양이', 'kakao', 'test_user_2'),
  ('33333333-3333-3333-3333-333333333333', '밤을 걷는 여우', 'google', 'test_user_3'),
  ('44444444-4444-4444-4444-444444444444', '별을 보는 곰', 'kakao', 'test_user_4'),
  ('55555555-5555-5555-5555-555555555555', '꿈꾸는 나그네', 'google', 'test_user_5')
ON CONFLICT (provider, provider_id) DO NOTHING;

-- 2. 테스트 글 생성
INSERT INTO posts (id, user_id, content, tag, created_at) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111', 
    '새벽 3시에 라면 끓여 먹으면서 유튜브 보는 이 시간이 제일 좋아... 아무도 나한테 연락 안 하고, 나도 아무한테 연락 안 해도 되는 이 시간.', 
    'monologue',
    now() - interval '2 hours'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222', 
    '오늘 면접 떨어졌어요. 3개월째 백수인데 이제 진짜 지쳐요... 다들 어떻게 버티는 거예요?', 
    'comfort',
    now() - interval '1 hour'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333', 
    '야근하는 사람들 다 퇴근해!!! 회사는 내일도 있어!!! 건강이 최고야!!!', 
    'shout',
    now() - interval '30 minutes'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '11111111-1111-1111-1111-111111111111', 
    '편의점 불빛 아래 앉아서 맥주 하나 따고 있는데, 이상하게 이 순간이 너무 좋아. 아무도 나한테 뭘 기대하지 않고, 나도 누구한테 뭘 증명할 필요 없는 이 시간.

근데 동시에 이렇게 혼자라는 게 가끔 무섭기도 해.', 
    'monologue',
    now() - interval '15 minutes'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '44444444-4444-4444-4444-444444444444', 
    '결혼식 끝. 다들 축하한다고 하는데, 집 오자마자 화장 지우면서 그냥 펑펑 울었어. 기뻐서가 아니라 그냥 너무 무거워서.', 
    'comfort',
    now() - interval '45 minutes'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '55555555-5555-5555-5555-555555555555', 
    '드디어 합격했어요!!! 6개월간의 노력이 드디어 결실을 맺었습니다! 새벽에 혼자 소리 지르고 있어요 ㅋㅋㅋ', 
    'shout',
    now() - interval '10 minutes'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. 테스트 댓글 생성
INSERT INTO comments (user_id, post_id, content, created_at) VALUES
  -- 면접 떨어진 글에 댓글
  ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '나도 그랬어... 힘내요. 분명 좋은 날이 올 거예요.', now() - interval '50 minutes'),
  ('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '저도 6개월 걸렸어요. 포기하지 마세요!', now() - interval '45 minutes'),
  ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '새벽에 이런 글 보면 왜 이렇게 마음이 아픈지... 화이팅이에요', now() - interval '40 minutes'),
  
  -- 편의점 글에 댓글
  ('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '완전 공감... 그 형광등 빛이 묘하게 위로가 될 때가 있어', now() - interval '10 minutes'),
  ('55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '나도 지금 편의점 앞이야 ㅋㅋㅋ', now() - interval '5 minutes'),
  
  -- 합격 글에 댓글
  ('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '축하해요!!! 대박!!!', now() - interval '8 minutes'),
  ('22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '우와 진짜 축하드려요 ㅠㅠ 저도 힘내야겠다', now() - interval '6 minutes');

-- 4. 테스트 공감(reactions) 생성
INSERT INTO reactions (user_id, post_id) VALUES
  -- 라면 글에 공감
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  
  -- 면접 글에 공감 (많이)
  ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  
  -- 야근 글에 공감
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  
  -- 편의점 글에 공감 (가장 많이)
  ('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('44444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('55555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  
  -- 결혼식 글에 공감
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  ('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  ('33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  
  -- 합격 글에 공감
  ('11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('44444444-4444-4444-4444-444444444444', 'ffffffff-ffff-ffff-ffff-ffffffffffff')
ON CONFLICT (user_id, post_id) DO NOTHING;

-- 5. 댓글 좋아요 생성
INSERT INTO comment_likes (user_id, comment_id)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  id
FROM comments 
WHERE user_id != '11111111-1111-1111-1111-111111111111'
LIMIT 3
ON CONFLICT (user_id, comment_id) DO NOTHING;

-- ============================================
-- 완료! 데이터 확인
-- ============================================
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Comments', COUNT(*) FROM comments
UNION ALL
SELECT 'Reactions', COUNT(*) FROM reactions
UNION ALL
SELECT 'Comment Likes', COUNT(*) FROM comment_likes;
