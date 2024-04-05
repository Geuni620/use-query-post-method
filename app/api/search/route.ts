import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';
import data from '@/app/mock/data.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

type ListItem = (typeof data)[0];

export async function POST(request: Request) {
  try {
    const { searchCondition } = await request.json();
    let data, error;

    if (searchCondition) {
      // 검색 조건이 있을 경우 해당 조건으로 데이터 조회
      ({ data, error } = await supabase
        .from('tasks')
        .select('*')
        .ilike('task', `%${searchCondition}%`));
    } else {
      // 검색 조건이 없거나 유효하지 않은 경우 전체 데이터 조회
      ({ data, error } = await supabase.from('tasks').select('*'));
    }

    if (error) throw new Error(error.message);

    return NextResponse.json({ list: data });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
