import { supabase } from '../supabase';
import type { ReportTargetType, ReportReasonType } from '../database.types';

interface CreateReportParams {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReasonType;
  detail?: string;
}

// 신고 생성
export async function createReport({
  reporterId,
  targetType,
  targetId,
  reason,
  detail,
}: CreateReportParams) {
  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: reporterId,
      target_type: targetType,
      target_id: targetId,
      reason,
      detail: detail || null,
    } as any)
    .select()
    .single();

  if (error) {
    // 중복 신고인 경우
    if (error.code === '23505') {
      throw new Error('이미 신고한 게시물/댓글입니다.');
    }
    console.error('Error creating report:', error);
    throw error;
  }

  return data;
}

// 이미 신고했는지 확인
export async function checkReported(
  reporterId: string,
  targetType: ReportTargetType,
  targetId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', reporterId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle();

  if (error) {
    console.error('Error checking report:', error);
    return false;
  }

  return !!data;
}
