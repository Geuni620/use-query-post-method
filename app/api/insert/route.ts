import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { NextResponse } from 'next/server';

import { handleErrorResponse } from '@/app/api/errorHandler';
import data from '@/app/mock/data.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

type ListItem = (typeof data)[0];
type ListItemWithDate = ListItem & { date: Date };

export async function POST() {
  try {
    const startDate = new Date(2020, 0, 1);
    const endDate = new Date(2024, 11, 31);

    const list: ListItem[] = JSON.parse(
      fs.readFileSync('app/mock/data.json', 'utf-8'),
    );

    const listWithRandomDates: ListItemWithDate[] = list.map((item) => ({
      ...item,
      date: getRandomDate(startDate, endDate),
    }));

    const mockupData = listWithRandomDates.map((item: ListItemWithDate) => ({
      task: item.task,
      status_id: item.status.id,
      status_name: item.status.name,
      notes: item.notes,
      date: item.date,
    }));

    const { error } = await supabase.from('tasks').insert(mockupData);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'success' });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
