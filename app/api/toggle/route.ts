import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

export async function POST(request: Request) {
  try {
    const { selectedRow } = await request.json();

    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss', { locale: ko });

    const { data: currentTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('*');

    const orderingData = currentTasks?.sort((a, b) => a.id - b.id);

    if (fetchError) throw new Error(fetchError.message);

    const updates = orderingData?.map(async (task) => {
      const isSelected = !!selectedRow[task.id - 1];

      if (task.done !== isSelected) {
        const { error } = await supabase
          .from('tasks')
          .update({
            done: isSelected,
            date: now,
          })
          .match({ id: task.id });

        if (error) throw new Error(error.message);
      }
    });

    if (!updates) throw new Error('No updates');

    await Promise.all(updates);

    return NextResponse.json({ message: 'Update successful' });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
