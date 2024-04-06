import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

export async function POST(request: Request) {
  try {
    const { selectedRow } = await request.json();

    const { error: resetError } = await supabase
      .from('tasks')
      .update({ done: false })
      .gt('id', 0);

    if (resetError) throw new Error(resetError.message);

    const updates = Object.entries(selectedRow).map(async ([id, done]) => {
      if (done) {
        const { error } = await supabase
          .from('tasks')
          .update({ done: true })
          .match({ id: parseInt(id) + 1 });

        if (error) throw new Error(error.message);
      }
    });

    await Promise.all(updates);

    return NextResponse.json({ message: 'Update successful' });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
