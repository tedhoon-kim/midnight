-- =====================================================
-- Global Settings 테이블 (어드민 설정용)
-- =====================================================

-- settings 테이블 생성
CREATE TABLE IF NOT EXISTS global_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 설정값 삽입
INSERT INTO global_settings (key, value)
VALUES ('dev_mode', '{"enabled": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS 정책
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
CREATE POLICY "Anyone can read global_settings" ON global_settings
  FOR SELECT USING (true);

-- 인증된 사용자만 수정 가능 (나중에 admin 체크 추가 가능)
CREATE POLICY "Authenticated users can update global_settings" ON global_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 권한 부여
GRANT SELECT ON global_settings TO anon, authenticated;
GRANT UPDATE ON global_settings TO authenticated;
