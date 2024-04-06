import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

export async function POST(request: Request) {
  try {
    const { searchCondition } = await request.json();
    let data, error;

    if (searchCondition) {
      ({ data, error } = await supabase
        .from('tasks')
        .select('*')
        .ilike('task', `%${searchCondition}%`));
    } else {
      ({ data, error } = await supabase.from('tasks').select('*'));
    }

    if (error) throw new Error(error.message);

    const orderingData = data?.sort((a, b) => {
      return a.id - b.id;
    });

    return NextResponse.json({ list: orderingData });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
